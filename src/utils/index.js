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

module.exports = { mapDBToModel, mapDBToModelSongs };