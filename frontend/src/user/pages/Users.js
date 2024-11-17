import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await fetch("http://localhost:5001/api/users/");
    const responseData = await response.json();
    setUsers(responseData.users);
  };

  useEffect(()=>{
    getUsers()
  }, [])

  return <UsersList items={users} />;
};

export default Users;
