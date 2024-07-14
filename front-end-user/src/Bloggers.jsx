import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Bloggers = ({ delay }) => {
  const { users, posts, comments } = useContext(AppContext);

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
        <div className="minigrid">
          {users.map((ele) => {
            return (
              <Link to={ele.username}>
                <div className="mini" key={ele._id}>
                  <h3>{ele.username}</h3>
                  <h5>
                    Posts:{" "}
                    {posts
                      .filter((post) => post.user._id === ele._id)
                      .reduce((count) => count + 1, 0)}
                  </h5>
                  <h5>
                    Comments:{" "}
                    {comments
                      .filter((comment) => comment.user._id === ele._id)
                      .reduce((count) => count + 1, 0)}
                  </h5>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    )) || <h1>Loading...</h1>
  );
};

export default Bloggers;
