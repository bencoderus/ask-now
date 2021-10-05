import Joi from 'joi';

const schema = Joi.object({
  question_id: Joi.string().min(1).required()
});

export default schema;
