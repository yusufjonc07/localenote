import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import { useHttpHook } from "../../shared/hooks/http-hook";

const Users = () => {
  const { sendRequest, HttpFeedback } = useHttpHook();
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await sendRequest(process.env.REACT_APP_API_URL + "users/");
        setUsers(res.users);
      } catch (error) {}
    };
    getUsers();
  }, [sendRequest]);

  return (
    <>
      <HttpFeedback />
      <UsersList items={users} />;
    </>
  );
};

export default Users;
