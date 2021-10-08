import Joi from 'joi';

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(60).required()
});

export default schema;
