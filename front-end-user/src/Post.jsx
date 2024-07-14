import { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Posts = ({ delay }) => {
  const { users, posts, comments } = useContext(AppContext);
  const { id } = useParams();

  return (
    (posts && users && comments && (
      <body>
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
          <div className="one">
            {posts
              .filter((ele) => ele._id === id)
              .map((ele) => {
                return (
                  <div className="huge" key={ele._id}>
                    <Link to={"/users/" + ele.user.username}>
                      <h5 className="blue">{ele.user.username}</h5>
                    </Link>
                    <h3>{ele.title}</h3>
                    <img src={ele.image_url} width="500" height="500"></img>
                    <p>{ele.text}</p>
                  </div>
                );
              })}
            <h2>Comments:</h2>
            {comments
              .filter((ele) => ele.post === id)
              .map((ele) => {
                return (
                  <div className="ccard" key={ele.id}>
                    <Link to={"/users/" + ele.user.username}>
                      {" "}
                      <h5 className="blue">{ele.user.username}</h5>
                    </Link>
                    <p>{ele.text}</p>
                  </div>
                );
              })}
          </div>
          <div className="marginal"></div>
        </div>
      </body>
    )) || <h1>Loading...</h1>
  );
};

export default Posts;
