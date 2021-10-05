import Joi from 'joi';

const schema = Joi.object({
  vote: Joi.string().valid('up', 'down')
});

export default schema;
