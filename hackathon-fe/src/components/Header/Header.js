import React from 'react'
import styles from "./Header.module.css";

import HeaderImg from "../../assets/headerImg.png";
const Header = () => {
//   console.log(HeaderImg)
  return (
    <header className={styles.app_header}>
        <img src={HeaderImg} alt="Presently" />
    </header>
  )
}

export default Header
