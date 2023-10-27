import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as profilesService from "../../utilities/profiles-service";

const ProtectedPage = ({ children }) => {
  const [isValidToken, setIsValidToken] = useState(null);
  const navigate = useNavigate();

  const checkValidUser = async () => {
    const userData = await profilesService.getProfile();
    if (!userData) {
      localStorage.removeItem("token");
      setIsValidToken(false);
    } else {
      console.log("valid user");
      console.log(children);
      setIsValidToken(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsValidToken(false);
      return;
    }
    checkValidUser();
  }, []);

  if (isValidToken === null) {
    // You can render a loading spinner here
    return <div>Loading...</div>;
  }

  return isValidToken ? children : navigate("/");
};

export default ProtectedPage;
