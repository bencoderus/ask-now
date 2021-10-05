import Joi from 'joi';

const schema = Joi.object({
  title: Joi.string().min(3).max(191).required(),
  content: Joi.string().min(3).required(),
  tags: Joi.string().min(3).max(120)
});

export default schema;
