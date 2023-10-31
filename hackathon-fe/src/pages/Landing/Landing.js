import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";

import heroImg from "../../assets/heroImg.png";
import presentlyLogo from "../../assets/presentlyLogo.png";
import desktopIntro from "../../assets/desktopIntro.png";
import * as profilesService from "../../utilities/profiles-service";

const Landing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const checkValidUser = async () => {
    const userData = await profilesService.getProfile();
    navigate("/friends");
  };
  if (token) {
    checkValidUser();
  }

  return (
      <section className={styles["landing-container"]}>
      <img src={presentlyLogo} alt="presently app logo" className={styles["desktopLogo"]} />
      <img src={desktopIntro} alt="Birthday Introduction" className={styles["desktopIntro"]} />
      <img src={heroImg} alt="Birthday Introduction" className={styles["mobileLogo"]} />
      <h1>Remember the perfect gift, every time.</h1>
      <div>
        <p>
          Presently is your new best friend to help in the hunt for the greatest
          gifts ever.
        </p>
        <p>
          Get reminders to help you keep track of upcoming birthdays and
          recommendations based on your loved one's interests and hobbies.
        </p>
      </div>
      <Link to="/signup" className={styles["get-started"]}>
        Get started
      </Link>
      <p>
        Already have an account?{" "}
        <Link to="/login" className={styles["log-in"]}>
          Log In
        </Link>
      </p>
    </section>
  );
};

export default Landing;
