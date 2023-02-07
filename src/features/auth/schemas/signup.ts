import joi, { ObjectSchema }  from 'joi';

const signupSchema: ObjectSchema = joi.object().keys({
  username: joi.string().required().min(4).max(8).messages({
    'string.base': 'Username must be characters',
    'string.min': 'Length must be more than 4 characters',
    'string.max': 'Length must be less than 8 characters',
    'string.empty': 'Username must not be empty'
  }),
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
  avatarColor: joi.string().required().messages({
    'any.required': 'Avatar color is required'
  }),
  avatarImage: joi.string().required().messages({
    'any.required': 'Avatar color is required'
  })
});

export { signupSchema };
