import React from "react";
import { AiFillHome, AiFillGift } from "react-icons/ai";
import { BiBell } from "react-icons/bi";
import { SlCalender } from "react-icons/sl";
import { BsPersonFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles["footer-container"]}>
      <NavLink className={styles.link} to="/">
        <div className={styles.icon}>
          <AiFillHome />
          <p>Home</p>
        </div>
      </NavLink>
      <NavLink className={styles.link} to="/">
        <div className={styles.icon}>
          <BiBell />
          <p>Reminder</p>
        </div>
      </NavLink>
      <NavLink className={styles.link} to="/">
        <div className={styles.icon}>
          <SlCalender />
          <p>Calender</p>
        </div>
      </NavLink>
      <NavLink className={styles.link} to="/">
        <div className={styles.icon}>
          <AiFillGift />
          <p>Gifts</p>
        </div>
      </NavLink>
      <NavLink className={styles.link} to="/">
        <div className={styles.icon}>
          <BsPersonFill />
          <p>Profile</p>
        </div>
      </NavLink>
    </footer>
  );
};

export default Footer;
