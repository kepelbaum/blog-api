import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Login = ({ delay }) => {
  const navigate = useNavigate();
  const { users, posts, comments, token, setToken, logout } =
    useContext(AppContext);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState(null);

  function handleUser(e) {
    setName(e.target.value);
  }

  function handlePass(e) {
    setPass(e.target.value);
  }

  function handleConf(e) {
    setConf(e.target.value);
  }

  function movePage(url) {
    navigate(url);
  }

  function handleSubmit() {
    fetch("https://blog-api-production-1313.up.railway.app/login", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({
        username: name,
        password: pass,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.result) {
          setErrors(response.result);
        } else {
          setToken(response.token);
          localStorage.setItem("token", response.token);
          movePage("/");
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    (!token && (
      <div className="wrapper big">
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
        <div>
          <h2>{errors}</h2>
          <div className="form">
            <label htmlFor="username">Username (lowercase)</label>
            <input type="text" id="username" onChange={handleUser}></input>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={handlePass}></input>
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          <div className="margin">
            <span>
              Don't have an account? Sign up{" "}
              <span className="visiblelink">
                <Link to={"/sign-up"}>here.</Link>
              </span>
            </span>
          </div>
        </div>
      </div>
    )) || <h1>You already logged in.</h1>
  );
};

export default Login;
