import React from "react";
import { NavLink } from "react-router-dom";
import Profile from "../../assets/icons/profile.png";
import Home from "../../assets/icons/home.png";
import Calender from "../../assets/icons/calender.png";
import Alert from "../../assets/icons/alert.png";
import Gift from "../../assets/icons/gift.png";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles["footer-container"]}>
      <NavLink className={styles.link} to="/friends">
        <div className={styles.icon}>
          <img src={Home} alt="" />
          <p>Home</p>
        </div>
      </NavLink>
      <NavLink className={styles.link} to="/">
        <div className={styles.icon}>
          <img src={Alert} alt="" />
          <p>Reminder</p>
        </div>
      </NavLink>
      <NavLink className={styles.link} to="/">
        <div className={styles.icon}>
          <img src={Calender} alt="" />
          <p>Calender</p>
        </div>
      </NavLink>
      <NavLink className={styles.link} to="/">
        <div className={styles.icon}>
          <img className={styles.gift} src={Gift} alt="" />
          <p>Gifts</p>
        </div>
      </NavLink>
      <NavLink className={styles.link} to="/profile">
        <div className={styles.icon}>
          <img src={Profile} alt="" />
          <p>Profile</p>
        </div>
      </NavLink>
    </footer>
  );
};

export default Footer;
