import joi, { ObjectSchema }  from 'joi';

// when a user want to change password
const emailSchema: ObjectSchema = joi.object().keys({
  email: joi.string().required().email().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Email must be valid',
    'string.empty': 'Email should not be empty'
  }),
});

const passwordSchema: ObjectSchema = joi.object().keys({
  password: joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Password length must me over 4 characters',
    'string.max': 'Password length must me below 8 characters',
    'string.empty': 'Password should not be empty',

  }),

  confirmPassword: joi.string().required().valid(joi.ref('password')).messages({
    'any.only': 'Password must match',
    'any.required':'Confirmation password should not be empty',
  }),
});

export { emailSchema, passwordSchema };
