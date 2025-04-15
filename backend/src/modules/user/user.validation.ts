import Joi from 'joi';
import { password, objectId } from '../validate/custom.validation';
import { NewCreatedUser } from './user.interfaces';
import { roles } from '../../config/roles';

const createUserBody: Record<keyof NewCreatedUser, any> = {
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

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      phoneNumber: Joi.string(),
      photoUrl: Joi.string(),
      role: Joi.string().valid(roles[0], roles[1]),
      shop: Joi.object({
        name: Joi.string(),
      }).optional(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
