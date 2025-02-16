/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');
/* eslint-enable import/no-extraneous-dependencies */

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema };
