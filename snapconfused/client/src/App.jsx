import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Confessions from "./pages/Confessions/Confessions";
import Struggles from "./pages/Struggles/Struggles";
import HallOfShame from "./pages/HallOfShame/HallOfShame";
import Admin from "./pages/Admin/Admin";
import AdminLogin from "./pages/AdminLogin/AdminLogin";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/confessions"
          element={<Confessions />}
        />
        <Route
          path="/struggles"
          element={<Struggles />}
        />
        <Route
          path="/hall-of-shame"
          element={<HallOfShame />}
        />
        <Route
          path="/admin"
          element={<Admin />}
        />
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;