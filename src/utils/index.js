/* eslint-disable camelcase */


const mapDBToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});
const mapDBToModelSongs = ({
  id,
  title,
  performer,
  year,
  genre,
  duration
}) => ({
  id,
  title,
  performer,
  year,
  genre,
  duration
});
const mapDBToModelPlaylist = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

module.exports = { mapDBToModel, mapDBToModelSongs, mapDBToModelPlaylist };