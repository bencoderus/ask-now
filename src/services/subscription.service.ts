import HttpException from '../exceptions/http.exception';
import QuestionInterface from '../interfaces/models/question.interface';
import Question from '../models/question.model';
import { isValidObjectId } from 'mongoose';

export default class SubscriptionService {
  async subscribe(questionId: any, user: any) {
    if (!isValidObjectId(questionId)) {
      throw new HttpException('Question ID is invalid', 404);
    }

    const question: QuestionInterface | null = await Question.findById(
      questionId
    );

    if (!question) {
      throw new HttpException('Question was not found', 404);
    }

    const isSubscribed = await Question.findOne({
      'subscribers.user': user.id,
      _id: questionId
    });

    if (isSubscribed) {
      throw new HttpException(
        'User is already subscribed to this question',
        403
      );
    }

    const subscriptionData = {
      user: user.id
    };

    question.subscribers.push(subscriptionData);

    return await question.save();
  }

  async unsubscribe(questionId: any, user: any) {
    if (!isValidObjectId(questionId)) {
      throw new HttpException('Question ID is invalid', 404);
    }

    const question: QuestionInterface | null = await Question.findById(
      questionId
    );

    if (!question) {
      throw new HttpException('Question was not found', 404);
    }

    const isSubscribed = await Question.findOne({
      'subscribers.user': user.id,
      _id: questionId
    });

    if (!isSubscribed) {
      throw new HttpException('User is not subscribed to this question', 403);
    }

    await question.updateOne(
      { $pull: { subscribers: { user: user.id } } },
      { new: true }
    );

    return question;
  }

  public async getAllReceivers(
    questionId: any,
    userId?: string
  ): Promise<any[]> {
    const question: any = await Question.findById(questionId)
      .select('subscribers')
      .lean();

    if (!userId) {
      return question.subscribers;
    }

    // filter subscribers where user is not equal to userId.
    return question.subscribers.filter((subscriber: any) => {
      return subscriber.user.toString() !== userId;
    });
  }
}
