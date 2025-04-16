import Joi from 'joi';
import { roles } from '../../config/roles';
import { NewRegisteredUser } from '../user/user.interfaces';
import { password } from '../validate/custom.validation';

const registerBody: Record<keyof NewRegisteredUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  role: Joi.string().valid(roles[0], roles[1]).default(roles[1]),
  shop: Joi.object({
    name: Joi.string().required(),
  }).optional(),
  customerClass: Joi.string().optional(),
  amountPaid: Joi.number().default(0),
};

export const register = {
  body: Joi.object().keys(registerBody),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export const getCurrentUser = {};

export const updateProfile = {
  body: Joi.object()
    .keys({
      name: Joi.string(),
      phoneNumber: Joi.string(),
      photoUrl: Joi.string(),
      shop: Joi.object({
        name: Joi.string(),
      }).optional(),
    })
    .min(1),
};