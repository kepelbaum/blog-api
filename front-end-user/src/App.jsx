import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import "./App.css";

function App({ delay }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      fetch("https://localhost:3000/users", { mode: "cors" })
        .then((response) => response.json())
        .then((response) => setData(response))
        .catch((error) => console.error(error));
    }, delay);
  }, [delay]);

  return (
    (data && (
      <div>
        <ul>
          <li>Hello World!</li>
        </ul>
      </div>
    )) || <h1>Loading...</h1>
  );
}

export default App;
