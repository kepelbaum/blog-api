import { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Posts = () => {
  const { users, posts, comments, token, user, setToken, logout } =
    useContext(AppContext);
  const { id } = useParams();

  const navigate = useNavigate();

  const movePage = (url) => {
    navigate(url);
  };

  function handlePostDelete(e) {
    fetch(
      "https://blog-api-production-1313.up.railway.app/posts/" +
        e.target.getAttribute("val"),
      {
        mode: "cors",
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      },
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          console.log(response.message);
          movePage("/");
        } else {
          console.log(response);
        }
      })
      .catch((error) => console.error(error));
  }

  function handleDelete(e) {
    fetch(
      "https://blog-api-production-1313.up.railway.app/comments/" +
        e.target.getAttribute("val"),
      {
        mode: "cors",
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      },
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          console.log(response.message);
        } else {
          console.log(response);
        }
      })
      .catch((error) => console.error(error));
  }
  return (
    (posts && users && comments && user && (
      <div className="wrapper">
        <div className="header">
          <h3>Blog API</h3>
          <ul>
            <Link to={"/"}>
              <li>Posts</li>
            </Link>
            <Link to={"/settings"}>
              <li>Settings</li>
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
        <h2>{user.message && user.message}</h2>
        <div className="one">
          {posts
            .filter((ele) => ele._id === id && ele.user.username === user.name)
            .map((ele) => {
              return (
                <div className="huge" key={ele._id}>
                  <div className="row">
                    <h4 className="right">
                      {new Date(ele.date).toLocaleDateString()}{" "}
                      {new Date(ele.date).toLocaleTimeString()}
                    </h4>
                  </div>
                  <Link to={"/"}>
                    <h5 className="blue">{ele.user.username}</h5>
                  </Link>
                  <h3>{ele.title}</h3>
                  {ele.image_url && (
                    <img src={ele.image_url} width="500" height="500"></img>
                  )}
                  <p>{ele.text}</p>
                  <h4>
                    {ele.ifPublished
                      ? "Published (Visible)"
                      : "Not Published (Invisible)"}
                  </h4>
                  <Link to={"edit"}>
                    <button className="yellow">Edit</button>
                  </Link>
                  <button
                    className="redbutton"
                    val={ele._id}
                    onClick={handlePostDelete}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <h2>Comments:</h2>
          {comments
            .filter((ele) => ele.post === id && ele.user.username === user.name)
            .sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            })
            .map((ele) => {
              return (
                <div className="comwrap" key={ele.id}>
                  <div className="ccard">
                    <div className="row">
                      <h4 className="right">
                        {new Date(ele.date).toLocaleDateString()}{" "}
                        {new Date(ele.date).toLocaleTimeString()}
                      </h4>
                    </div>{" "}
                    <h5 className="blue">{ele.user.username}</h5>
                    <p>{ele.text}</p>
                  </div>
                  <button
                    className="redbutton"
                    val={ele._id}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
        </div>
        <div className="marginal"></div>
      </div>
    )) || <h1>Loading...</h1>
  );
};

export default Posts;
