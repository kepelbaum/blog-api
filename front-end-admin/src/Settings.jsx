import { useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Comment = ({ delay }) => {
  const { users, posts, comments, token, logout, user } =
    useContext(AppContext);
  const { id } = useParams();
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const movePage = (url) => {
    navigate(url);
  };

  function handlePass(e) {
    setPass(e.target.value);
  }
  function handleConf(e) {
    setConf(e.target.value);
  }
  function handleSubmit() {
    fetch("https://blog-api-production-1313.up.railway.app/users/" + user.id, {
      mode: "cors",
      method: "PUT",
      body: JSON.stringify({
        password: pass,
        confirm: conf,
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
    (user.id && (
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
          <h1>Change Password</h1>
          <label htmlFor="password">Enter new password:</label>
          <input id="password" type="password" onChange={handlePass}></input>
          <label htmlFor="confirm">Confirm new password:</label>
          <input id="confirm" type="password" onChange={handleConf}></input>
          <button type="submit" className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    )) || (
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
        <h2>You have not signed in.</h2>
      </div>
    )
  );
};

export default Comment;
