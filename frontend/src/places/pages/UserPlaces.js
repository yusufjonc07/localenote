import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';


const UserPlaces = () => {
  const userId = useParams().userId;

  const [loadedPlaces, setPlaces] = useState([]);

  const getPlaces = async () => {
    const response = await fetch(`http://localhost:5001/api/places/user/${userId}`);
    const responseData = await response.json();
    setPlaces(responseData.places);
  };

  useEffect(()=>{
    getPlaces()
  }, [])


  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
