import { Routes, Route } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthProvider";
import { RecommendationProvider } from './contexts/RecommendationContext';

import ProtectedPage from "./components/ProtectedPage";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UpdateProfile from "./pages/Profile/UpdateProfile";
import Profile from "./pages/Profile/Profile";
import AllFriends from "./pages/Friends/AllFriends";
import ShowFriend from "./pages/Friends/ShowFriend";
import Calendar from './pages/Calendar';
import Reminders from './pages/Reminders';
import Filters from "./pages/Filters";
import CreateFriend from "./pages/Friends/CreateFriend";
import TagAdder from "./pages/TagAdder";
import UpdateFriend from "./pages/Friends/UpdateFriend";
import DeleteUser from './pages/Account/DeleteUser';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Settings from './pages/Account/Settings';
import VerifyEmail from './pages/Account/VerifyEmail';
import ForgotPassword from './pages/Account/ForgotPassword';
import UpdatePassword from "./pages/Account/UpdatePassword";


function App() {
  return (
    <div className="App" style={{ height: '100vh' }}>
        <AuthContextProvider>
      <RecommendationProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/settings" element={<Settings /> } />
          <Route path="/verify-email" element={<VerifyEmail /> } />
          <Route path="/reset-password" element={<ForgotPassword /> } />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedPage>
                <UpdateProfile />
              </ProtectedPage>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedPage>
                <AllFriends />
              </ProtectedPage>
            }
          />
          <Route
            path="/friend/:id"
            element={
              <ProtectedPage>
                <ShowFriend />
              </ProtectedPage>
            }
          />
          <Route
            path="/friend/:id/edit"
            element={
              <ProtectedPage>
                <UpdateFriend />
              </ProtectedPage>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedPage>
                <Calendar />
              </ProtectedPage>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedPage>
                <Reminders />
              </ProtectedPage>
            }
          />
          <Route
            path="/filters"
            element={
              <ProtectedPage>
                <Filters />
              </ProtectedPage>
            }
          />
          <Route
            path="/addfriend"
            element={
              <ProtectedPage>
                <CreateFriend />
              </ProtectedPage>
            }
          />
          <Route
            path="/friend/:id/tag"
            element={
              <ProtectedPage>
                <TagAdder />
              </ProtectedPage>
            }
          />
          <Route
            path="/delete-account"
            element={
              <ProtectedPage>
                <DeleteUser />
              </ProtectedPage>
            }
          />
          <Route
            path="/update-password"
            element={
              <ProtectedPage>
                <UpdatePassword />
              </ProtectedPage>
            }
          />
        </Routes>
      </RecommendationProvider>
        </AuthContextProvider>
    </div>
  );
}

export default App;
