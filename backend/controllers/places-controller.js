const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const fs = require("fs");
const path = require("path");

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uId;

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    const err = new HttpError(
      "Could not fetch places of this user, please try again",
      500
    );
    return next(err);
  }

  res.json({ places: places.map(place => place.toObject({getters: true})) });
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pId;
  let place;

  try {
    place = await Place.findById(placeId).populate({
      path: "creator",
      select: "-password -email",
    });
  } catch (error) {
    const err = new HttpError(
      "Opps, something went wrong, please try again",
      500
    );
    return next(err);
  }

  if (!place) {
    const err = new HttpError("Place was not found!", 404);
    return next(err);
  }
  return res.json({ place: place.toObject({ getters: true }) });
};

const createPlace = async (req, res, next) => {
  const { title, description, address, creator, location } = req.body;
  
  const newPlace = new Place({
    title,
    description,
    location: JSON.parse(location),
    address,
    image: req.file.path,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    const err = new HttpError(
      "Opps, something went wrong, please try again",
      500
    );
    return next(err);
  }

  if (!user) {
    const err = new HttpError("Creator was not found with provided id!", 404);
    return next(err);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    await newPlace.save({ session: sess });
    user.places.push(newPlace);
    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }

  res.status(201).json(newPlace);
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
    return next(err);
  }

  if(place.creator !== req.userData.id){
    const err = new HttpError("You are not allowed to edit this place!", 401);
    return next(err);
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

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pId;

  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    const err = new HttpError(
      "Opps, something went wrong, please try again",
      500
    );
    return next(err);
  }

  if (!place) {
    const err = new HttpError("Place not found", 404);
    return next(err);
  }

  if(place.creator !== req.userData.id){
    const err = new HttpError("You are not allowed to delete this place!", 401);
    return next(err);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();
    // Delete the place
    await Place.deleteOne({ _id: placeId }, { session: sess });

    place.creator.places.pull(placeId);
    await place.creator.save({ session: sess });

    await sess.commitTransaction();
    sess.endSession();
  } catch (error) {
    console.log(error);
    const err = new HttpError(
      "Opps, could not delete this place, please try again",
      500
    );
    return next(err);
  }

  fs.unlink(path.join(place.image), (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Place was deleted" });
};

module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};
