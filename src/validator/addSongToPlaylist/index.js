const InvariantError = require('../../exceptions/InvariantError');
const { AddSongToPlaylistPayloadSchema } = require('./schema')

const AddSongToPlaylistsValidator = {
  validateSongIdPayload: (payload) => {
    const validationResult = AddSongToPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AddSongToPlaylistsValidator;

