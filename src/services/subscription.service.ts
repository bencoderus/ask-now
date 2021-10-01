import { isValidObjectId, LeanDocument } from 'mongoose';
import { injectable } from 'tsyringe';
import HttpException from '../exceptions/http.exception';
import {
  QuestionInterface,
  SubscribersInterface
} from '../interfaces/models/question.interface';
import { UserInterface } from '../interfaces/models/user.interface';
import Question from '../models/question.model';

@injectable()
export default class SubscriptionService {
  async subscribe(
    questionId: string,
    user: UserInterface
  ): Promise<QuestionInterface> {
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
    await question.save();

    return question;
  }

  async unsubscribe(
    questionId: string,
    user: UserInterface
  ): Promise<QuestionInterface> {
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
    questionId: string,
    userId?: string
  ): Promise<LeanDocument<SubscribersInterface[]>> {
    const question = await Question.findById(questionId)
      .select('subscribers')
      .lean();

    if (!question) {
      return [];
    }

    if (!userId) {
      return question.subscribers;
    }

    // filter subscribers where user is not equal to userId.
    return question.subscribers.filter(
      (subscriber: LeanDocument<SubscribersInterface>) => {
        return subscriber.user.toString() !== userId;
      }
    );
  }
}
