import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Login = ({ delay }) => {
  const { users, posts, comments, loggedin, setLoggedin } =
    useContext(AppContext);

  return (
    (posts && users && comments && (
      <div className="wrapper">
        <div className="header">
          <h3>Blog API</h3>
          <ul>
            <Link to={"/"}>
              <li>Posts</li>
            </Link>
            <Link to={"/users"}>
              <li>Users</li>
            </Link>
            <Link to={"/login"}>
              <li>Login</li>
            </Link>
          </ul>
        </div>
        <div>
          <form method="POST" className="form">
            <label for="username">Username (lowercase)</label>
            <input type="text" id="username"></input>
            <label for="password">Password</label>
            <input type="password" id="password"></input>
            <label for="confirm">Confirm Password</label>
            <input type="password" id="confirm"></input>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    )) || <h1>Loading...</h1>
  );
};

export default Login;
