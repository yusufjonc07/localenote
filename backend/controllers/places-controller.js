const uuid = require("uuid");
const HttpError = require("../models/http-error");
const Place = require("../models/place");

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

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uId;

  let places;

  try {
    places = await Place.find({creator: userId});
  } catch (error) {
    const err = new HttpError(
      "Could not fetch places of this user, please try again",
      500
    );
    return next(err);
  }

  if(!places || places.length === 0){
    const err = new HttpError(
      `There are no places by ${userId}`,
      404
    );
    return next(err);
  }

  res.json({ places });
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pId;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError(
      "Opps, something went wrong, please try again",
      500
    );
    return next(err);
  }

  if (!place) {
    const err = new HttpError("Place was not found!", 404);
    return next(err)
  }
  return res.json({place: place.toObject({getters: true}) });
};

const createPlace = async (req, res, next) => {
  const { title, description, location, address, creator } = req.body;

  const newPlace = new Place({
    title,
    description,
    location,
    address,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    creator,
  });

  try {
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
};

const updatePlace = async (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pId;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError(
      "Opps, something went wrong, please try again",
      500
    );
    return next(err);
  }

  if (!place) {
    const err = new HttpError("Place was not found!", 404);
    return next(err)
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    const err = new HttpError(
      "Opps, something went wrong, please try again",
      500
    );
    return next(err);
  }

  res.status(200).json({ place: place.toObject({getters: true}) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pId;

  let result;
  try {
    result = await Place.deleteOne({_id: placeId});
  } catch (error) {
    const err = new HttpError(
      "Opps, could not delete this place, please try again",
      500
    );
    return next(err);
  }

  if(result.deletedCount === 0){
    const err = new HttpError(
      "Place was not found",
      404
    );
    return next(err)
  }

  res.status(200).json({ message: "Place was deleted"});
};

module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};
