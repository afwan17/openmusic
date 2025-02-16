/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');
/* eslint-enable import/no-extraneous-dependencies */

const AddSongToPlaylistPayloadSchema = Joi.object({
  "songId": Joi.string().required(),
});

module.exports = { AddSongToPlaylistPayloadSchema };
