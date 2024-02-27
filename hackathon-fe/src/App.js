import { Routes, Route } from "react-router-dom";

import { RecommendationProvider } from './contexts/RecommendationContext';

import ProtectedPage from "./components/ProtectedPage";
import LandingPage from "./pages/Landing/Landing";
import SignUpPage from "./pages/SignUp/SignUp";
import LoginPage from "./pages/Login/Login";
import UpdateProfilePage from "./pages/Profile/UpdateProfile";
import ProfilePage from "./pages/Profile/Profile";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import FriendPage from "./pages/FriendPage/FriendPage";
import CalendarPage from './pages/Calendar';
import RemindersPage from './pages/Reminders';
import FiltersPage from "./pages/FiltersPage/FiltersPage";
import CreateFriendPage from "./pages/CreateFriendPage/CreateFriendPage";
import TagAdderPage from "./pages/TagAdder/TagAdder";
import UpdateFriendPage from "./pages/UpdateFriendPage/UpdateFriendPage";
import DeleteUserPage from './pages/Account/DeleteUserPage';
import PrivacyPolicyPage from './pages/PrivacyPolicy/PrivacyPolicyPage';
import SettingsPage from './pages/Settings';
import VerifyEmailPage from './pages/VerifyEmail';
import ForgotPasswordPage from './pages/ForgotPassword';
import UpdatePasswordPage from "./pages/Account/UpdatePassword";
import { AuthContextProvider } from "./contexts/AuthProvider";

function App() {
  return (
    <div className="App" style={{ height: '100vh' }}>
        <AuthContextProvider>
      <RecommendationProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/settings" element={<SettingsPage /> } />
          <Route path="/verify-email" element={<VerifyEmailPage /> } />
          <Route path="/reset-password" element={<ForgotPasswordPage /> } />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <ProfilePage />
              </ProtectedPage>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedPage>
                <UpdateProfilePage />
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
            path="/calendar"
            element={
              <ProtectedPage>
                <CalendarPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedPage>
                <RemindersPage />
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
          <Route
            path="/delete-account"
            element={
              <ProtectedPage>
                <DeleteUserPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/update-password"
            element={
              <ProtectedPage>
                <UpdatePasswordPage />
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
