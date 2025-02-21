const ClientError = require('../../exceptions/ClientError');

class UserAlbumLikesHandler {
  constructor(service) {
    this._service = service;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;
    await this._service.likeAlbum(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil disukai',
    });
    response.code(201);
    return response;
  }

  async deleteLikeHandler(request, h) {
    try {
      const { id: userId } = request.auth.credentials;
      const { id: albumId } = request.params;

      await this._service.unlikeAlbum(userId, albumId);

      return {
        status: 'success',
        message: 'Batal menyukai album',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  }

  async getLikesHandler(request, h) {
    try {
      const { id: albumId } = request.params;

      const { likes, source } = await this._service.getAlbumLikes(albumId);

      const response = h.response({
        status: 'success',
        data: { likes },
      });

      if (source === 'cache') {
        response.header('X-Data-Source', 'cache');
      }

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  }

}

module.exports = UserAlbumLikesHandler;
