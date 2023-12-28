import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as usersService from '../utilities/users-service';

import Header from '../components/Header/Header';
import styles from '../styles/Filters.module.css';

import { BsArrowLeft } from "react-icons/bs";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ email: '' });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getResetEmail = async (evt) => {
        evt.preventDefault();
        if (!formData) return;
        const response = await usersService.getPasswordResetEmail(formData);
        console.log(response.message)
    }

    return (
    <>
    <Header />
    <div className={styles["mainContainer"]}>
      <div className={styles["container"]}>
      <div className={styles['back-button']}>
            <BsArrowLeft onClick={() => navigate('/login')} />
          </div>
            <h1>Reset Password</h1>
            <form onSubmit={getResetEmail}>
            <div className={styles['form-group']}>
              <label htmlFor="email" style={{ paddingTop: 10 }}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <button className={styles['signup-button']} disabled={isSubmitting}>
              Confirm
            </button>
            </form>
        </div>
    </div>
  </>
    )
}

export default ForgotPassword;