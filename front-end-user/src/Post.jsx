import { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Posts = ({ delay }) => {
  const { users, posts, comments, token, user, setToken, logout } =
    useContext(AppContext);
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
              {!token && (
                <Link to={"/login"}>
                  <li>Login</li>
                </Link>
              )}
              {token && (
                <Link to={"/"}>
                  <li onClick={logout}>Logout</li>
                </Link>
              )}
            </ul>
          </div>
          <h2>{user}</h2>
          <div className="one">
            {posts
              .filter((ele) => ele._id === id)
              .map((ele) => {
                return (
                  <div className="huge" key={ele._id}>
                    <div className="row">
                      <h4 className="right">
                        {new Date(ele.date).toLocaleDateString()}{" "}
                        {new Date(ele.date).toLocaleTimeString()}
                      </h4>
                    </div>
                    <Link to={"/users/" + ele.user.username}>
                      <h5 className="blue">{ele.user.username}</h5>
                    </Link>
                    <h3>{ele.title}</h3>
                    {ele.image_url && (
                      <img src={ele.image_url} width="500" height="500"></img>
                    )}
                    <p>{ele.text}</p>
                  </div>
                );
              })}
            {token && (
              <Link to={"/posts/" + id + "/create"}>
                <button>New Comment</button>
              </Link>
            )}
            <h2>Comments:</h2>
            {comments
              .filter((ele) => ele.post === id)
              .sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
              })
              .map((ele) => {
                return (
                  <div className="ccard" key={ele.id}>
                    <div className="row">
                      <h4 className="right">
                        {new Date(ele.date).toLocaleDateString()}{" "}
                        {new Date(ele.date).toLocaleTimeString()}
                      </h4>
                    </div>
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
