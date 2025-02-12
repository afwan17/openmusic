/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');
/* eslint-enable import/no-extraneous-dependencies */

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { AlbumPayloadSchema };
