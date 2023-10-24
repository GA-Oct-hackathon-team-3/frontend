import { useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import * as usersService from "../../utilities/users-service";

import styles from "./SignUp.module.css";

const LoginSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    password: ""
  });

  const [message, setMessage] = useState("Create an Account");

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const submitHandler = async (evt) => {
    evt.preventDefault();
    try {
      console.log(formData);
      const userData = await usersService.register(formData);
      console.log(userData);
      // setUser(userData)
    } catch (error) {
      setMessage(
        "Either an account has already been created with this email, or there is a network error. Please try again."
      );
      console.log(error);
    }
  };

  return (
    <section className={styles["signup-container"]}>
      <div>
        <Link to="/">
          <BsArrowLeft />
        </Link>
        <h1>Sign Up</h1>
      </div>
      <br />
      <form className={styles["form-container"]} onSubmit={submitHandler}>
        <div>
          <label htmlFor="name">Name*</label>
          <input type="text" id="name" name="name" onChange={handleChange} />
        </div>
        <br />
        <div>
          <label htmlFor="phone-number">Phone no.</label>
          <input
            type="number"
            id="phone-number"
            name="tel"
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" onChange={handleChange} />
        </div>
        <br />
        <div>
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              id="date"
              name="dateOfBirth"
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label htmlFor="gender">Gender*</label>
            <select id="gender" name="gender" onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        {/* <div>
          <label htmlFor="profile-image">Photo Upload</label>
          <input type="file" id="profile-image"  name="photoUrl" />
        </div> */}
        <br />
        <button>Submit</button>
      </form>
    </section>
  );
};

export default LoginSignUp;
