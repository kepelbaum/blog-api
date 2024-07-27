import { useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Edit = () => {
  const { users, posts, comments, token, logout, user } =
    useContext(AppContext);
  const { id } = useParams();
  const [text, setText] = useState(null);
  const [title, setTitle] = useState(null);
  const [url, setURL] = useState(null);
  const [ifPubChanged, setPubChanged] = useState(false); //whether ifPublished has been changed
  const [errors, setErrors] = useState(null);
  const [ifUrlChanged, setUrlChanged] = useState(false);

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
    setUrlChanged(true);
    setURL(e.target.value);
  }

  function handleCheck(e) {
    if (ifPubChanged) {
      setPubChanged(false);
    } else {
      setPubChanged(true);
    }
  }

  function handleSubmit(e) {
    let oldText = e.target.getAttribute("initText");
    let oldTitle = e.target.getAttribute("initTitle");
    let oldUrl = e.target.getAttribute("initUrl");
    let oldPub = e.target.getAttribute("initPub");
    if (ifPubChanged) {
      if (oldPub === "true") {
        oldPub = "false";
      } else {
        oldPub = "true";
      }
    }
    if (url === "" && ifUrlChanged) {
      oldUrl = null;
    }
    fetch("https://blog-api-production-1313.up.railway.app/posts/" + id, {
      mode: "cors",
      method: "PUT",
      body: JSON.stringify({
        text: text ? text : oldText,
        ifPublished: oldPub === "true" ? true : false,
        image_url: url ? url : oldUrl,
        title: title ? title : oldTitle,
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
          setErrors(response);
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    user &&
    posts &&
    comments && (
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
        {posts
          .filter((ele) => ele._id === id && ele.user.username === user.name)
          .map((ele) => {
            return (
              <div className="form" key={ele.id}>
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  defaultValue={ele.title}
                  id="title"
                  onChange={handleTitle}
                ></input>
                <label htmlFor="imageurl">Image URL (optional):</label>
                <input
                  type="text"
                  defaultValue={ele.image_url}
                  id="imageurl"
                  onChange={handleURL}
                ></input>
                <label htmlFor="check">Make private (y/n):</label>
                {(ele.ifPublished || (!ele.ifPublished && ifPubChanged)) && (
                  <input
                    type="checkbox"
                    id="check"
                    onChange={handleCheck}
                  ></input>
                )}
                {!ele.ifPublished && !ifPubChanged && (
                  <input
                    type="checkbox"
                    id="check"
                    onChange={handleCheck}
                    checked
                  ></input>
                )}
                <label htmlFor="text">Message Body:</label>
                <textarea
                  id="text"
                  defaultValue={ele.text}
                  onChange={handleChange}
                ></textarea>
                <button
                  type="submit"
                  className="submit"
                  onClick={handleSubmit}
                  initText={ele.text}
                  initTitle={ele.title}
                  initUrl={ele.image_url}
                  initPub={ele.ifPublished.toString()}
                >
                  Submit
                </button>
              </div>
            );
          })}
      </div>
    )
  );
};

export default Edit;
