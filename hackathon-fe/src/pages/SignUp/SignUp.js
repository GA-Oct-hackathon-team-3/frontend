import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import * as usersService from "../../utilities/users-service";
import Header from "../../components/Header/Header";

import styles from "./SignUp.module.css";

const LoginSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    email: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("Create an Account");

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const submitHandler = async (evt) => {
    evt.preventDefault();
    try {
      const userData = await usersService.register(formData);
      navigate("/friends");
    } catch (error) {
      setMessage(
        "Either an account has already been created with this email, or there is a network error. Please try again."
      );
      console.log(error);
    }
  };

  return (
    <>
      <Header />
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
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" onChange={handleChange} />
          </div>
          <br />
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label htmlFor="phone-number">Phone Number</label>
            <input
              type="number"
              id="phone-number"
              name="tel"
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <div>
              <label>Date of Birth</label>
              <input type="date" id="date" name="dob" onChange={handleChange} />
            </div>
            <br />
            <div>
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <br />
          <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              onChange={handleChange}
            />
          </div>
          {/* <div>
          <label htmlFor="profile-image">Photo Upload</label>
          <input type="file" id="profile-image"  name="photoUrl" />
        </div> */}
          <br />
          <button>Create account</button>
        </form>
      </section>
    </>
  );
};

export default LoginSignUp;
