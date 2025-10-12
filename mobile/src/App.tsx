import React from "react";
import "./App.css";
import { MainScreen } from "./screens/MainScreen";

import "./src/services/firebase"; // Firebase 초기화

function App() {
  return (
    <div className="App">
      <MainScreen />
    </div>
  );
}

export default App;
