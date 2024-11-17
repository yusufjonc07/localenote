import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpHook } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const userId = useParams().userId;
  const [loadedPlaces, setPlaces] = useState([]);
  const { sendRequest, HttpFeedback } = useHttpHook();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await sendRequest(
          `http://localhost:5001/api/places/user/${userId}`
        );
        setPlaces(res.places);
      } catch (error) {}
    };
    fetchPlaces();
  }, [userId, sendRequest]);

  const placeDeleteHandler = (placeId) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== placeId)
    );
  };

  return (
    <>
      <HttpFeedback />
      <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
    </>
  );
};

export default UserPlaces;
