import Joi from 'joi';

const schema = Joi.object({
  content: Joi.string().min(5).required(),
  question_id: Joi.string().required()
});

export default schema;
