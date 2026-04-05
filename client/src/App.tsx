import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./features/auth/pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
