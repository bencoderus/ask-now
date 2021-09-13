import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6).max(60).required()
});

export default schema;
