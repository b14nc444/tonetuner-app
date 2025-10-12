import React from "react";
import "./App.css";
import { MainScreen } from "./screens/MainScreen";

// 웹에서는 Crashlytics 미지원 (네이티브 전용)

function App() {
  return (
    <div className="App">
      <MainScreen />
    </div>
  );
}

export default App;
