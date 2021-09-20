import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/http.exception';
import PostInterface from '../interfaces/models/post.interface';
import Post from '../models/post.model';
import Question from '../models/question.model';
import constants from '../utils/constants';
import NotificationService from './notification.service';

export default class PostService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public async findByQuestion(questionId: any): Promise<PostInterface[]> {
    if (!isValidObjectId(questionId)) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    const posts: any = await Post.find({
      question: questionId
    }).populate('user', 'username firstName lastName');

    return posts;
  }

  public async findOne(postId: any): Promise<PostInterface> {
    if (!isValidObjectId(postId)) {
      throw new HttpException(constants.postNotFound, 404);
    }

    const post: PostInterface | null = await Post.findById(postId);

    if (!post) {
      throw new HttpException(constants.postNotFound, 404);
    }

    return post;
  }

  public async markAsBestAnswer(
    postId: any,
    user: any
  ): Promise<PostInterface> {
    if (!isValidObjectId(postId)) {
      throw new HttpException(constants.postNotFound, 404);
    }

    let post: any = await Post.findById(postId)
      .populate('question')
      .populate('user', 'username firstName lastName');

    if (!post) {
      throw new HttpException(constants.postNotFound, 404);
    }

    if (post.question.user.toString() !== user.id) {
      throw new HttpException(constants.restrictedAccess, 403);
    }

    post.isBestAnswer = true;
    post = await post.save();

    await this.notificationService.sendBestAnswerNotification(post, user);

    return post;
  }

  public async create(
    questionId: any,
    data: any,
    user: any
  ): Promise<PostInterface> {
    if (!isValidObjectId(questionId)) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    const question: any = await Question.findById(questionId);

    if (!question) {
      throw new HttpException(constants.questionNotFound, 404);
    }

    const post = await Post.create({
      content: data.content,
      user: user.id,
      question: questionId
    });

    question.posts.push(post);

    await question.save();

    await this.notificationService.sendCommentNotification(question, user);

    return post;
  }

  public async update(
    postId: any,
    data: any,
    user: any
  ): Promise<PostInterface> {
    if (!isValidObjectId(postId)) {
      throw new HttpException(constants.postNotFound, 404);
    }

    const post: any = await Post.findById(postId);

    if (!post) {
      throw new HttpException(constants.postNotFound, 404);
    }

    if (post.user.toString() !== user.id) {
      throw new HttpException(constants.restrictedAccess, 403);
    }

    post.content = data.content || post.content;

    await post.save();

    return post;
  }

  public async delete(postId: any, user: any): Promise<boolean> {
    if (!isValidObjectId(postId)) {
      throw new HttpException(constants.postNotFound, 404);
    }

    const post: any = await Post.findById(postId).populate(
      'user',
      'username firstName lastName'
    );

    if (!post) {
      throw new HttpException(constants.postNotFound, 404);
    }

    if (post.user.toString() !== user.id) {
      throw new HttpException(constants.restrictedAccess, 403);
    }

    await Question.updateOne(
      { _id: post.question },
      { $pull: { posts: post._id } }
    );

    await Post.deleteOne({ _id: postId });

    return true;
  }
}
