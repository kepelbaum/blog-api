import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx";

const Login = ({ delay }) => {
  const navigate = useNavigate();
  const { users, posts, comments, loggedin, setLoggedin } =
    useContext(AppContext);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
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

  function movePage() {
    navigate("/");
  }

  function handleSubmit() {
    fetch("https://blog-api-production-1313.up.railway.app/sign-up", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({
        username: name,
        password: pass,
        confirm: conf,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.result) {
          setErrors(null);
          movePage();
        } else {
          setErrors(response);
        }
      })
      .catch((error) => console.error(error));
  }

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
          {errors &&
            errors.map((ele) => {
              return <h2>{ele.msg}</h2>;
            })}
          <div className="form">
            <label htmlFor="username">Username (lowercase)</label>
            <input type="text" id="username" onChange={handleUser}></input>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={handlePass}></input>
            <label htmlFor="confirm">Confirm Password</label>
            <input type="password" id="confirm" onChange={handleConf}></input>
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    )) || <h1>Loading...</h1>
  );
};

export default Login;
