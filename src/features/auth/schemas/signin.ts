import joi, { ObjectSchema }  from 'joi';

const loginSchema: ObjectSchema = joi.object().keys({
  email: joi.string().required().email().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Email must be valid',
    'string.empty': 'Email should not be empty'
  }),
  password: joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Password length must me over 4 characters',
    'string.max': 'Password length must me below 8 characters',
    'string.empty': 'Password should not be empty',

  }),
});

export { loginSchema };
