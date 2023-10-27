import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as profilesService from "../../utilities/profiles-service";

const ProtectedPage = ({ children }) => {
  console.log("ProtectedPage");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const checkValidUser = async () => {
    const userData = await profilesService.getProfile();
    if (!userData) {
      localStorage.removeItem("token");
      navigate("/");
    } else {
      console.log("valid user");
      return children;
    }
  };

  useEffect(() => {
    if (token) {
      checkValidUser();
    } else {
      console.log("no token");
      navigate("/");
    }
  }, []);
};

export default ProtectedPage;
