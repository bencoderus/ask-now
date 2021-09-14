import { Request } from 'express';
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

  async findAll() {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName');

    return questions;
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Question ID is invalid', 404);
    }

    const question = await Question.findById(id).populate(
      'user',
      'username firstName lastName'
    );

    if (!question) {
      throw new HttpException('Question was not found', 404);
    }

    return question.toJSON();
  }

  async create(data: any, user: any) {
    const slug = slugify(data.title, true);

    const question = await Question.create({
      title: data.title,
      slug: slug,
      tags: data.tags || null,
      user: user.id
    });

    const post: any = await Post.create({
      question: question._id,
      content: data.content,
      isFirstAnswer: true,
      user: user.id
    });

    question.posts.push(post);
    await question.save();

    await this.subscriptionService.subscribe(question, user);

    return question;
  }

  async update(questionId: string, request: Request) {
    const data = request.body;

    if (!isValidObjectId(questionId)) {
      throw new HttpException('Question ID is invalid', 404);
    }

    const question: any = await Question.findById(questionId);

    if (!question) {
      throw new HttpException('Question was not found', 404);
    }

    if (question.user !== request.user) {
      throw new HttpException(constants.restrictedAccess, 403);
    }

    question.title = data.title || question.title;
    question.slug = slugify(data.title, true) || question.slug;
    question.tags = data.tags || question.tags;

    question.posts[0].content = data.content || question.posts[0].content;

    return await question.save();
  }

  async delete(id: any, request: Request) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Question ID is invalid', 404);
    }

    const question = await Question.findById(id);

    if (!question) {
      throw new HttpException('Question was not found', 404);
    }

    if (question.user !== request.user) {
      throw new HttpException(constants.restrictedAccess, 403);
    }

    await Post.deleteMany({ question: id });

    await Question.deleteOne({ id });

    return true;
  }
}
