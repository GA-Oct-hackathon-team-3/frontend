import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import styles from '../styles/Filters.module.css';

import { BsArrowLeft } from "react-icons/bs";

const Settings = () => {
    const navigate = useNavigate();

    const logOutHandler = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        navigate("/login");
      };


    return (
    <>
    <Header />
    <div className={styles["mainContainer"]}>
      <div className={styles["container"]}>
            <div className={styles["heading-container"]}>
                <p style={{fontSize:"1.5rem"}} onClick={() => navigate('/profile')}>
                  <BsArrowLeft />
                </p>
                <h1>Settings</h1>
            </div>
        <div className={styles["row-container"]}>
          <div className={styles.row} onClick={() => navigate('/privacy-policy')}>
            <h2>Privacy Policy</h2>
          </div>
            </div>
        <div className={styles["row-container"]}>
          <div className={styles.row} onClick={() => navigate('/delete-account')}>
            <h2>Delete Account</h2>
          </div>
        </div>
        <div className={styles["row-container"]}>
          <div className={styles.row} onClick={() => navigate('/update-password')}>
            <h2>Update Password</h2>
          </div>
        </div>
      </div>
        <button className={styles["logout"]} onClick={logOutHandler}>Logout</button>
    </div>
  </>
    )
}

export default Settings;