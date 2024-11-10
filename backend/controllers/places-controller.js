const uuid = require("uuid");
const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlacesByUserId = (req, res) => {
  const userId = req.params.uId;

  const places = DUMMY_PLACES.filter((place) => place.creator === userId);

  res.json({ places });
};

const getPlaceById = (req, res) => {
  const placeId = req.params.pId;

  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError("Place was not found!");
  }

  res.json({ place });
};

const createPlace = (req, res) => {
  const { title, description, location, address, creator } = req.body;

  const newPlace = {
    id: uuid.v4(),
    title,
    description,
    location,
    address,
    creator,
  };

  DUMMY_PLACES.push(newPlace);

  res.status(201).json(newPlace);
};

const updatePlace = (req, res) => {
  const { title, description } = req.body;
  const placeId = req.params.pId;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res) => {
  const placeId = req.params.pId;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).send("Place deleted");
};

module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};
