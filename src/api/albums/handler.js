
class AlbumsHandler {
  constructor(service, { AlbumsValidator, UploadsValidator }, storageService) {
    this._service = service;
    this._validator = {
      AlbumsValidator,
      UploadsValidator
    };

    this._storageService = storageService


    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.uploadAlbumCoverHandler = this.uploadAlbumCoverHandler.bind(this);
  }

  async uploadAlbumCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.UploadsValidator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);

    await this._service.updateAlbumCover(id, filename);
    const response = h.response({
      status: 'success',
      message: 'Sampul album berhasil diunggah',
    });
    response.code(201);
    return response;
  }
  async postAlbumHandler(request, h) {
    this._validator.AlbumsValidator.validateAlbumPayload(request.payload);
    const { name = 'unnamed', year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.AlbumsValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album has been update',
    };
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album has been deleted',
    };
  }
}

module.exports = AlbumsHandler;