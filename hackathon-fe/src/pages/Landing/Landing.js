import { NavLink } from "react-router-dom";

import styles from "./Landing.module.css";

import heroImg from "../../assets/bday-hero-img.jpg";

const Landing = () => {
  return (
    <section className={styles["landing-container"]}>
      <img src={heroImg} alt="Birthday Introduction" />
      <div>
        <h1>Lorem ipsum dolor consectetur</h1>
        <p>
          lorem ipsum dolor consectetur lorem ipsum dolor consectetur lorem
          ipsum dolor consectetur,lorem ipsum dolor consectetur lorem ipsum
          dolor consectetur, lorem ipsum dolor consectetur.
        </p>
      </div>
      <NavLink to="/signup" className={styles.signup}>
        Sign Up
      </NavLink>
      <NavLink to="/login" className={styles.login}>
        Log In
      </NavLink>
    </section>
  );
};

export default Landing;
