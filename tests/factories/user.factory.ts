import UserService from '../../src/services/user.service';

export default {
  create() {
    const service = new UserService();
    return service.createUser({});
  }
};
