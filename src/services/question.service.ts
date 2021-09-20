import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/http.exception';
import QuestionInterface from '../interfaces/models/question.interface';
import Post from '../models/post.model';
import Question from '../models/question.model';
import constants from '../utils/constants';
import { slugify } from '../utils/helpers';
import SubscriptionService from './subscription.service';

export default class QuestionService {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  async findAll(): Promise<QuestionInterface[]> {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName');

    return questions;
  }

  async findByUserId(user: any): Promise<QuestionInterface[]> {
    const questions = await Question.find({ user: user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName');

    return questions;
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

  async create(data: any, user: any): Promise<QuestionInterface> {
    const slug = slugify(data.title, true);

    const question = await Question.create({
      title: data.title,
      slug,
      tags: data.tags || null,
      user: user.id
    });

    const post: any = await Post.create({
      question: question._id,
      content: data.content,
      isFirst: true,
      user: user.id
    });

    question.posts.push(post);
    await question.save();

    await this.subscriptionService.subscribe(question, user);

    return question.populate('posts');
  }

  async update(
    questionId: string,
    data: any,
    user: any
  ): Promise<QuestionInterface> {
    if (!isValidObjectId(questionId)) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    const question: any = await Question.findById(questionId);

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

  async delete(id: any, user: any): Promise<boolean> {
    if (!isValidObjectId(id)) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    const question = await Question.findById(id);

    if (!question) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    if (question.user.toString() !== user.id) {
      throw new HttpException(constants.restrictedAccess, 403);
    }

    await Post.deleteMany({ question: id });

    await Question.deleteOne({ id });

    return true;
  }
}
