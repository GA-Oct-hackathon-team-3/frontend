import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import * as usersService from "../../utilities/users-service";
// import { AuthContext } from "../../pages/App/App";

import styles from "./Login.module.css";

import loginImg from "../../assets/loginImg.png";

const Login = () => {
  // const { user, setUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
  }

  async function handleLogin(evt) {
    evt.preventDefault();
    try {
      console.log("Login form submitted");
      console.log(credentials);
      const user = await usersService.login(credentials);
      //setUser(user);
      console.log("Login successful");
    } catch {
      setErrorMsg("Login failed, try again");
    }
  }

  return (
    <section className={styles["login-container"]}>
      <div>
        <Link to="/">
          <BsArrowLeft />
        </Link>
        <h1>Log In</h1>
      </div>

      <br />

      <img src={loginImg} alt="Birthday cake" />

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    </section>
  );
};

export default Login;
