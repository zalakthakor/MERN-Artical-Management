import logo from "./logo.svg";
import "./App.css";
import NavBar from "./Components/NavBar/NavBar";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import Signin from "./Components/Signin/Signin";

import Home from "./Components/Home/Home";
import Articals from "./Components/Articals/Artical1";
import Edit from "./Components/Articals/Edit";
import Users from "./Components/Users/Users";
import Edituser from "./Components/Users/Edituser";
import Comment from "./Components/Articals/Comment";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar></NavBar>
        <Routes>
          <Route exact path="home" element={<Home />} />
          <Route exact path="/signin" element={<Signin />} />

          <Route exact path="/artical" element={<Articals />} />
          <Route exact path="/edit/:id" element={<Edit />} />
          <Route exact path="/comment/:id" element={<Comment />} />

          <Route exact path="/user" element={<Users />} />
          <Route exact path="/edituser/:id" element={<Edituser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
