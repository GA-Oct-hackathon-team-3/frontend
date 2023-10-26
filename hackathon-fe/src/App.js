import { Routes, Route } from "react-router-dom";

import Footer from "./components/Footer/Footer";

import LandingPage from "./pages/Landing/Landing";
import SignUpPage from "./pages/SignUp/SignUp";
import LoginPage from "./pages/Login/Login";
import ProfilePage from "./pages/Profile/Profile";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import FriendPage from "./pages/FriendPage/FriendPage";
import FiltersPage from "./pages/FiltersPage/FiltersPage";
import CreateFriendPage from "./pages/CreateFriendPage/CreateFriendPage";
import UpdateFriendPage from "./pages/UpdateFriendPage/UpdateFriendPage";

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/friend/:id" element={<FriendPage />} />
        <Route path="/friend/:id/edit" element={<UpdateFriendPage />} />
        <Route path="/filters" element={<FiltersPage />} />
        <Route path="/addfriend" element={<CreateFriendPage />}/>
        {/* <Route path="/addtags" element={}/> */}
      </Routes>
      {/* <Footer /> */}

    </div>
  );
}

export default App;
