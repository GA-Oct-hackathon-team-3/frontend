import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as profilesService from "../../utilities/profiles-service";
import styles from './ProtectedPage.module.css';
import { CircularProgress } from "@mui/material";

const ProtectedPage = ({ children }) => {
  const [isValidToken, setIsValidToken] = useState(null);
  const navigate = useNavigate();

  const checkValidUser = async () => {
    const userData = await profilesService.getProfile();
    if (!userData) {
      localStorage.removeItem("token");
      setIsValidToken(false);
    } else {
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
    // Update with better loading indicator
    return <div className={styles["spinner-container"]}>
      <CircularProgress color="secondary" />
    </div>;
  }

  return isValidToken ? children : navigate("/");
};

export default ProtectedPage;
