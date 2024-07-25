import { useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Comment = ({ delay }) => {
  const { users, posts, comments, token, logout, user } =
    useContext(AppContext);
  const { id } = useParams();
  const [text, setText] = useState("");

  const navigate = useNavigate();

  const movePage = (url) => {
    navigate(url);
  };

  function handleChange(e) {
    setText(e.target.value);
  }
  function handleSubmit() {
    fetch("https://blog-api-production-1313.up.railway.app/comments/" + id, {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({
        text: text,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        authorization: "Bearer " + (token ? token.toString() : ""),
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          movePage("/posts/" + id);
        } else {
          throw new Error(Object.entries(response));
        }
      })
      .catch((error) => console.error(error));
  }

  return (
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
        <div className="form">
          <label htmlFor="newcomment">New Comment:</label>
          <textarea id="newcomment" onChange={handleChange}></textarea>
          <button type="submit" className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </body>
  );
};

export default Comment;
