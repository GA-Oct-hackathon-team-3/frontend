import React from 'react'
import styles from './Header.module.css'

const Header = () => {
  return (
    <div>
        <NavLink to="/" className={styles.header}>LOGO</NavLink>
    </div>
  )
}

export default Header
