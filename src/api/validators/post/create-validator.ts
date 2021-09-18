import Joi from 'joi';

const schema = Joi.object({
  content: Joi.string().min(5).required()
});

export default schema;
