
class PlaylistsHandler {
  constructor(service, { PlaylistsValidator, AddSongToPlaylistsValidator }, collaborationsService) {
    this._service = service;
    this._validator = {
      PlaylistsValidator,
      AddSongToPlaylistsValidator,
    };

    this._collaborationsService = collaborationsService;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this);
    this.putPlaylistByIdHandler = this.putPlaylistByIdHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.addSongToPlaylistHandler = this.addSongToPlaylistHandler.bind(this);
    this.getSongsInPlaylistHandler = this.getSongsInPlaylistHandler.bind(this);
    this.deleteSongInPlaylistHandler = this.deleteSongInPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.PlaylistsValidator.validatePlaylistPayload(request.payload);
    const { name = 'unnamed' } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async addSongToPlaylistHandler(request, h) {
    this._validator.AddSongToPlaylistsValidator.validateSongIdPayload(request.payload);
    const { id: playlist_id } = request.params
    const { songId: song_id } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlist_id, credentialId);
    await this._service.verifySongExists(song_id);
    await this._service.addSongToPlaylist({ playlist_id, song_id });

    await this._service.addPlaylistActivity({ playlist_id, user_id: credentialId, song_id, action: 'add' });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }
  async getSongsInPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._collaborationsService.verifyPlaylistExists(playlistId);
    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._service.getSongsInPlaylist(playlistId);

    return h.response({
      status: 'success',
      data: { playlist },
    }).code(200);
  }

  async getPlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._service.getPlaylistById(id);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async putPlaylistByIdHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(id, credentialId);

    await this._service.editPlaylistById(id, request.payload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
  async deleteSongInPlaylistHandler(request, h) {
    this._validator.AddSongToPlaylistsValidator.validateSongIdPayload(request.payload);
    const { id: playlist_id } = request.params;
    const { songId: song_id } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlist_id, credentialId);

    await this._service.deleteSongInPlaylistById(playlist_id, song_id);

    await this._service.addPlaylistActivity({ playlist_id, user_id: credentialId, song_id, action: 'delete' });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlist_id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlist_id, credentialId);

    const activities = await this._service.getPlaylistActivities(playlist_id);

    return {
      status: 'success',
      data: activities,
    };
  }
}

module.exports = PlaylistsHandler;