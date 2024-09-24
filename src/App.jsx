import { Route, Routes } from "react-router-dom";
import "./App.css";

import RegistroDocentes from "./Components/RegistroD/RegistroDocentes";
import Home from "./Pages/Home";
function App() {
  return (
    <div className="flex">
      <Routes>
        <Route
          path="/RegistroDocentes"
          element={<RegistroDocentes></RegistroDocentes>}
        />
        <Route path="/" element={<Home></Home>} />
      </Routes>
    </div>
  );
}

export default App;
