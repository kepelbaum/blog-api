import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import "./App.css";
import Posts from "./Posts.jsx";
import Post from "./Post.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Settings from "./Settings.jsx";
import Edit from "./Edit.jsx";
import New from "./New.jsx";

export const AppContext = createContext({
  users: [],
  posts: [],
  comments: [],
  user: "",
  setUser: () => {},
  token: "",
  setToken: () => {},
  logout: () => {},
});

function App({ delay }) {
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);
  const [comments, setComments] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    setTimeout(() => {
      fetch("https://blog-api-production-1313.up.railway.app/users", {
        mode: "cors",
      })
        .then((response) => response.json())
        .then((response) => setUsers(response))
        .catch((error) => console.error(error));
    });
  }, [users]);

  useEffect(() => {
    setTimeout(() => {
      fetch("https://blog-api-production-1313.up.railway.app/posts", {
        mode: "cors",
      })
        .then((response) => response.json())
        .then((response) => setPosts(response))
        .catch((error) => console.error(error));
    });
  }, [posts]);

  useEffect(() => {
    setTimeout(() => {
      fetch("https://blog-api-production-1313.up.railway.app/comments", {
        mode: "cors",
      })
        .then((response) => response.json())
        .then((response) => setComments(response))
        .catch((error) => console.error(error));
    });
  }, [comments]);

  useEffect(() => {
    setTimeout(() => {
      fetch("https://blog-api-production-1313.up.railway.app", {
        mode: "cors",
        headers: {
          authorization: "Bearer " + (token ? token.toString() : ""),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message) {
            setUser(response);
          } else {
            setUser(response.result);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        users,
        posts,
        comments,
        user,
        setUser,
        token,
        setToken,
        logout,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="posts/:id" element={<Post />} />
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<Signup />} />
          <Route path="settings" element={<Settings />} />
          <Route path="posts/:id/edit" element={<Edit />} />
          <Route path="create" element={<New />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
