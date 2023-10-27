import { Routes, Route } from "react-router-dom";

import Footer from "./components/Footer/Footer";

import ProtectedPage from "./components/ProtectedPage/ProtectedPage";
import LandingPage from "./pages/Landing/Landing";
import SignUpPage from "./pages/SignUp/SignUp";
import LoginPage from "./pages/Login/Login";
import ProfilePage from "./pages/Profile/Profile";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import FriendPage from "./pages/FriendPage/FriendPage";
import FiltersPage from "./pages/FiltersPage/FiltersPage";
import CreateFriendPage from "./pages/CreateFriendPage/CreateFriendPage";
import TagAdderPage from "./pages/TagAdder/TagAdder";
import UpdateFriendPage from "./pages/UpdateFriendPage/UpdateFriendPage";
import { RecommendationProvider } from "./components/RecommendationContext/RecommendationContext";

function App() {
  return (
    <div className="App">
      <RecommendationProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <ProfilePage />
              </ProtectedPage>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedPage>
                <FriendsPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/friend/:id"
            element={
              <ProtectedPage>
                <FriendPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/friend/:id/edit"
            element={
              <ProtectedPage>
                <UpdateFriendPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/filters"
            element={
              <ProtectedPage>
                <FiltersPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/addfriend"
            element={
              <ProtectedPage>
                <CreateFriendPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/friend/:id/tag"
            element={
              <ProtectedPage>
                <TagAdderPage />
              </ProtectedPage>
            }
          />
        </Routes>
      </RecommendationProvider>
      <Footer />
    </div>
  );
}

export default App;
