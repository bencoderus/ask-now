import Joi from 'joi';

const schema = Joi.object({
  vote: Joi.string().valid('up', 'down').required()
});

export default schema;
