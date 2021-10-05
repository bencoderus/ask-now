import SubscriptionNotification from '../jobs/subscription.job';
import DatabaseFactory from '../utils/databases/factory';

export default class TestService {
  private readonly database: DatabaseFactory;

  constructor() {
    this.database = new DatabaseFactory();
  }

  public async setup(): Promise<void> {
    await this.database.connect();
  }

  public async teardown(): Promise<void> {
    await this.database.disconnect();
    await this.closeJobs();
  }

  private async closeJobs(): Promise<void> {
    await SubscriptionNotification.close();
  }
}
