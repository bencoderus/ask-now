import { isValidObjectId, ObjectId } from 'mongoose';
import { injectable } from 'tsyringe';
import HttpException from '../exceptions/http.exception';
import { PostInterface } from '../interfaces/models/post.interface';
import { QuestionInterface } from '../interfaces/models/question.interface';
import { UserInterface } from '../interfaces/models/user.interface';
import Post from '../models/post.model';
import Question from '../models/question.model';
import constants from '../utils/constants';
import { slugify } from '../utils/helpers';
import SubscriptionService from './subscription.service';

@injectable()
export default class QuestionService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async findAll(): Promise<QuestionInterface[]> {
    return Question.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName');
  }

  async findByUserId(user: UserInterface): Promise<QuestionInterface[]> {
    return Question.find({ user: user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName');
  }

  async findById(id: string): Promise<QuestionInterface> {
    if (!isValidObjectId(id)) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    const question = await Question.findById(id).populate(
      'user',
      'username firstName lastName'
    );

    if (!question) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    return question;
  }

  async create(
    data: Record<string, string>,
    user: UserInterface
  ): Promise<QuestionInterface> {
    const slug = slugify(data.title, true);

    const question: QuestionInterface = await Question.create({
      title: data.title,
      slug,
      tags: data.tags || null,
      user: user.id
    });

    const post: PostInterface = await Post.create({
      question: question._id,
      content: data.content,
      isFirst: true,
      user: user.id
    });

    await question.updateOne({ $push: { posts: post._id } });

    await this.subscriptionService.subscribe(question.id, user);

    return question.populate('posts');
  }

  async update(
    questionId: string,
    data: Record<string, string>,
    user: UserInterface
  ): Promise<QuestionInterface> {
    if (!isValidObjectId(questionId)) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    const question: QuestionInterface | null = await Question.findById(
      questionId
    );

    if (!question) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    if (question.user.toString() !== user.id) {
      throw new HttpException(constants.restrictedAccess, 403);
    }

    question.title = data.title || question.title;
    question.slug = slugify(data.title, true) || question.slug;
    question.tags = data.tags || question.tags;

    question.posts[0].content = data.content || question.posts[0].content;

    return question.save();
  }

  async delete(id: string, user: UserInterface): Promise<boolean> {
    if (!isValidObjectId(id)) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    const question: QuestionInterface | null = await Question.findById(id);

    if (!question) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    if (question.user.toString() !== user.id) {
      throw new HttpException(constants.restrictedAccess, 403);
    }

    await Post.deleteMany({ question: id as unknown as ObjectId });

    await Question.deleteOne({ id });

    return true;
  }
}
