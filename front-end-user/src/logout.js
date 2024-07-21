import { useState, useContext } from "react";
import { AppContext } from "./App.jsx";

export default function logout() {
  const { token, setToken } = useContext(AppContext);
  setToken(null);
}
