const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator, collaborationsService }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator, collaborationsService);
    server.route(routes(playlistsHandler));
  },
};
