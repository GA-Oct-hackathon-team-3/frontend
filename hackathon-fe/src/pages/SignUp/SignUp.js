import { useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

import styles from "./SignUp.module.css";

const LoginSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const submitHandler = async (evt) => {
    evt.preventDefault();
    console.log(formData);    
  };

  return (
    <section className={styles["signup-container"]}>
      <div>
        <Link to="/"><BsArrowLeft/></Link>
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
            name="phoneNumber"
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
            <select
              id="gender"
              name="gender"
              onChange={handleChange}
            >
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
