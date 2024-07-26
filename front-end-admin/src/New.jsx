import { useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const New = () => {
  const { users, posts, comments, token, logout, user } =
    useContext(AppContext);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [pub, setPub] = useState(true);
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const movePage = (url) => {
    navigate(url);
  };

  function handleChange(e) {
    setText(e.target.value);
  }

  function handleTitle(e) {
    setTitle(e.target.value);
  }

  function handleURL(e) {
    setURL(e.target.value);
  }

  function handleCheck() {
    if (pub) {
      setPub(false);
    } else {
      setPub(true);
    }
  }

  function handleSubmit() {
    fetch("https://blog-api-production-1313.up.railway.app/posts", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({
        text: text,
        ifPublished: pub,
        image_url: url,
        title: title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        authorization: "Bearer " + (token ? token.toString() : ""),
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          movePage("/");
        } else {
          setErrors(response);
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
        <h2>{user.message}</h2>
        {errors &&
          errors.map((ele) => {
            return <h2>{ele.msg}</h2>;
          })}
        <div className="form">
          <label htmlFor="title">Title:</label>
          <input id="title" onChange={handleTitle}></input>
          <label htmlFor="imageurl">Image URL (optional):</label>
          <input id="imageurl" onChange={handleURL}></input>
          <label htmlFor="check">Make private (y/n):</label>
          <input type="checkbox" id="check" onChange={handleCheck}></input>
          <label htmlFor="text">Message Body:</label>
          <textarea id="text" onChange={handleChange}></textarea>
          <button type="submit" className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </body>
  );
};

export default New;
