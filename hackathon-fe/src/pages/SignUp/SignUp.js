import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import * as usersService from "../../utilities/users-service";
import presentlyLogo from '.././/../assets/presentlyLogo.png';

import Header from "../../components/Header/Header";

import styles from "./SignUp.module.css";
import { Box, MenuItem, Select } from "@mui/material";

const LoginSignUp = () => {
  const [passwordValidity, setPasswordValidity] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [requiredMessage, setRequiredMessage] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    email: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("Create an Account");

  function handleFormMessage (string) {
    // handles scrolling to top to display various reasons for why form is not valid for submit
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    setRequiredMessage(string);
    return;
  }

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') validatePassword(value);
    // notifies of password match if change on either password field
    if (name === 'password' || name === 'confirmPassword') validateMatch(value); 
  };

  const submitHandler = async (evt) => {
    evt.preventDefault();

    // form validation before submit
    const valid = validateForm();
    if (!valid) return handleFormMessage('Required fields are marked with (*)');
    if (!passwordValidity) return handleFormMessage('Please enter a valid password');
    if (!passwordMatch) return handleFormMessage('Passwords must match');

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const userData = await usersService.register({...formData, timezone});
      navigate("/friends");
    } catch (error) {
      setMessage(
        "Either an account has already been created with this email, or there is a network error. Please try again."
      );
      console.log(error);
    }
  };

  function validateForm () {
    if (!formData.name || !formData.password || !formData.confirmPassword ||
        !formData.email || !formData.dob || !formData.gender) return false;
    else return true;
  }

  function validatePassword(password) {
    // Check if the password is at least 8 characters in length
    if (password.length < 8) {
      return false;
    }
  
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSpecialChar = false;
  
    // Iterate through each character in the password
    for (let i = 0; i < password.length; i++) {
      const char = password[i];
  
      // Check if the character is uppercase
      if (char >= 'A' && char <= 'Z') {
        hasUppercase = true;
      }
  
      // Check if the character is lowercase
      if (char >= 'a' && char <= 'z') {
        hasLowercase = true;
      }
  
      // Check if the character is a number
      if (char >= '0' && char <= '9') {
        hasNumber = true;
      }
  
      // Check if the character is a special character
      const specialCharacters = "!@#$%^&*()_+{}[]:;<>,.?~-";
      if (specialCharacters.includes(char)) {
        hasSpecialChar = true;
      }
    }


    if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar) setPasswordValidity(true);
    else setPasswordValidity(false);
  
    // returns validity of password
    return passwordValidity;
  }

  function validateMatch (confirmPassword) {
    const match = confirmPassword === formData.password;
    setPasswordMatch(match);
    return match;
  }

  return (
    <>
      <Header />
      <section className={styles["signup-container"]}>
        <div className={styles["back-button"]}>
          <Link to="/">
            <BsArrowLeft />
          </Link>
        </div>
          <h1>Sign Up</h1>
        <br />
        <form className={styles["form-container"]} onSubmit={submitHandler}>
            {requiredMessage ? requiredMessage : ''}
            <div className={styles["form-group"]}>
            <label htmlFor="name" style={{paddingTop: 10}}>Name *</label>
            <input type="text" id="name" name="name" onChange={handleChange} />
          </div>
          <br />
          <div className={styles["form-group"]}>
            <label htmlFor="password">Password * </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => setPasswordValidity(validatePassword(formData.password))}
            />
            {!passwordValidity && (
              <p>
                Password must contain at least 8 characters, 1 uppercase letter, 1
                lowercase letter, 1 number, & 1 special character.
              </p>
            )}
          </div>
          <br />
          <div className={styles["form-group"]}>
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => validateMatch(formData.confirmPassword)}
            />
            {!passwordMatch && (
              <p>
                Passwords do not match
              </p>
            )}
          </div>
          <br />
          <div className={styles["form-group"]}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <br />
          <div className={styles["form-group"]}>
            <label htmlFor="phone-number">Phone Number</label>
            <input
              type="number"
              id="phone-number"
              name="tel"
              onChange={handleChange}
            />
          </div>
          <br />
        <div className={styles["form-select-section"]}>
        <div className={styles["form-group"]}>
              <label>Date of Birth *</label>
              <input type="date" id="date" name="dob" onChange={handleChange} />
            </div>
            <br />
            <Box sx={{ minWidth: "120px" }} className={styles["form-group"]}>
              <label htmlFor="gender">Gender *</label>
              <Select
                id="gender"
                onChange={handleChange}
                className={styles["selector"]}
              >
                <MenuItem disabled></MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </Box>
          </div>
          <br />
          <div className={styles["form-group"]}>
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
          <button className={styles["signup-button"]}>Create Account</button>
        </form>
      </section>
    </>
  );
};

export default LoginSignUp;

