import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import * as usersService from "../../utilities/users-service";

import styles from "../../styles/Login.module.css";

import loginImg from "../../assets/loginImg.png";
import desktopLogin from '../../assets/desktopLogin.png';

import Header from "../../components/Header/Header";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [validationMessage, setValidationMessage] = useState('')

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
  }

  function validateForm () {
    if (!credentials.email || !credentials.password) return false;
    else return true;
  }

  async function handleLogin(evt) {
    evt.preventDefault();
    const valid = validateForm();
    if (!valid) {
        setValidationMessage('Required fields are marked with (*)');
        return;
    }
    try {
      const user = await usersService.login(credentials);
      if (user) navigate("/friends");
    } catch {
      setErrorMsg("Login failed, try again");
    }
  }

  return (
    <>
    <Header />
   
    <section className={styles["login-container"]}>
      <div className={styles["back-button"]}>
        <Link to="/">
          <BsArrowLeft />
        </Link>
      </div>
        <h1>Log In</h1>

      <br />

      <img src={loginImg} alt="Birthday cake" className={styles["mobile-login"]}/>
      <img src={desktopLogin} alt="Girl with present" className={styles["desktop-login"]}/>

      <form className={styles["form-container"]} onSubmit={handleLogin}>
        {validationMessage ? validationMessage : ''}
        <div className={styles["form-group"]}>
          <label htmlFor="email" style={{paddingTop: 10}}>Email *</label>
          <input
            type="email"
            name="email"
            id="email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <br/>
        <div className={styles["form-group"]}>
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <p style={{paddingTop: 10}}>Forgot Password?</p>
        </div>
          <button className={styles["login-button"]} type="submit">Login</button>
      </form>
    </section>

    </>
  );
};

export default Login;
