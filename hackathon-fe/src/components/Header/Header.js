import React from 'react'
import styles from "../../styles/Header.module.css";

import HeaderImg from "../../assets/headerImg.png";
const Header = () => {
  return (
    <header className={styles.app_header} style={{width: '100vw'}}>
        <img src={HeaderImg} alt="Presently"  className={styles["headerLogo"]} />
    </header>
  )
}

export default Header
