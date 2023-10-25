import { Link } from "react-router-dom";

import styles from "./Landing.module.css";

import heroImg from "../../assets/heroImg.png";

const Landing = () => {
  return (
    <section className={styles["landing-container"]}>
      <img src={heroImg} alt="Birthday Introduction" />
      <h1>Remember the perfect gift, every time.</h1>
      <div>
        <p>Birthday Buddy is your new best friend to help in the hunt for the greatest gifts ever.</p>
        <p>Get reminders to help you keep track of upcoming birthdays and recommendations based on your loved one's interests and hobbies.</p>
      </div>
      <Link to="/signup" className={styles["get-started"]}>
        Get started
      </Link>
      <p>
        Already have an account? <Link to="/login" className={styles["log-in"]}>Log In</Link>
      </p>
    </section>
  );
};

export default Landing;
