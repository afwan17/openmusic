/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');
/* eslint-enable import/no-extraneous-dependencies */

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string()
});

module.exports = { SongPayloadSchema };
