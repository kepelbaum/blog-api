import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import "./App.css";
import Posts from "./Posts.jsx";
import Bloggers from "./Bloggers.jsx";
import Blogger from "./Blogger.jsx";
import Post from "./Post.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

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
  const [token, setToken] = useState(null);
  const logout = () => {
    setToken(null);
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
            setUser(response.message);
          } else {
            setUser(response.result);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [token]);

  return (
    <AppContext.Provider
      value={{ users, posts, comments, user, setUser, token, setToken, logout }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="users" element={<Bloggers />} />
          <Route path="users/:id" element={<Blogger />} />
          <Route path="posts/:id" element={<Post />} />
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;

{
  /* <ul>
          {data.map((ele) => {
            return (
              <div>
                <li>{ele.text}</li>
              </div>
            );
          })}
        </ul> */
}
