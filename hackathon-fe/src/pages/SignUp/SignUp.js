import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as usersService from '../../utilities/users-service';
import { validatePassword, validateMatch } from '../../utilities/helpers';

import Header from '../../components/Header';

import { BsArrowLeft } from 'react-icons/bs';
import { Box, MenuItem, Select } from '@mui/material';

import styles from '../../styles/SignUp.module.css';

const LoginSignUp = () => {
  const navigate = useNavigate();

  const [passwordValidity, setPasswordValidity] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [requiredMessage, setRequiredMessage] = useState(''); // displays invalid form and error messages
  const [emailMessage, setEmailMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAwaitingVerification, setIsAwaitingVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tel: '',
    email: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  // handles constant password and match validation
  useEffect(() => {
    if (formData.password)
      setPasswordValidity(validatePassword(formData.password));
    setPasswordMatch(
      validateMatch(formData.password, formData.confirmPassword)
    );
  }, [formData.password, formData.confirmPassword]);

  const handleFormMessage = (string) => {
    setIsSubmitting(false);

    // handles scrolling to top to display message with various reasons for why form is not valid for submit
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return setRequiredMessage(string);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);

    // resets message
    setRequiredMessage('');

    // form validation before submit
    const valid = validateForm();
    if (!valid) return handleFormMessage('Required fields are marked with (*)');
    if (!passwordValidity)
      return handleFormMessage('Please enter a valid password');
    if (!passwordMatch) return handleFormMessage('Passwords must match');

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await usersService.register({
        ...{ ...formData, timezone },
        timezone,
      });
      if (
        response.message ===
        'User successfully created and verification email sent sucessfully'
      ) {
        setIsAwaitingVerification(true);
      } else
        return handleFormMessage(
          'Either an account has already been created with this email, or there is a network error. Please try again.'
        );
    } catch (error) {
      return handleFormMessage(
        'Either an account has already been created with this email, or there is a network error. Please try again.'
      );
    }
  };

  function validateForm() {
    if (
      !formData.name ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.email ||
      !formData.dob ||
      !formData.gender
    )
      return false;
    else return true;
  }

  const handleResend = async () => {
    try {
      setIsResending(true);
      const response = await usersService.resendEmail(formData.email, null); // accepts email, token
      if (response.message === 'Email resent successfully') {
        setEmailMessage('Email resent successfully!');
      } else setEmailMessage(response.message);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Header />
      <section className={styles['signup-container']}>
        {isAwaitingVerification ? (
          <div style={{ margin: 'auto', marginTop: '8rem' }}>
            <h1>Verification email sent.</h1>
            <h1>Please check your inbox</h1>
            {!isResending && (
              <button
                className={styles['signup-button']}
                onClick={handleResend}
              >
                Resend Email
              </button>
            )}
            {emailMessage && emailMessage}
          </div>
        ) : (
          <div className={styles['content-container']}>
            <div className={styles['back-button']}>
              <BsArrowLeft onClick={() => navigate('/')} />
            </div>
            <h1>Sign Up</h1>
            <br />
            <form className={styles['form-container']} onSubmit={submitHandler}>
              {requiredMessage ? requiredMessage : ''}
              <div className={styles['form-group']}>
                <label htmlFor="name" style={{ paddingTop: 10 }}>
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <br />
              <div className={styles['form-group']}>
                <label htmlFor="password">Password * </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {!passwordValidity && (
                  <p>
                    Password must contain at least 8 characters, 1 uppercase
                    letter, 1 lowercase letter, 1 number, & 1 special character.
                  </p>
                )}
              </div>
              <br />
              <div className={styles['form-group']}>
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {!passwordMatch && <p>Passwords do not match</p>}
              </div>
              <br />
              <div className={styles['form-group']}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <br />
              <div className={styles['form-group']}>
                <label htmlFor="phone-number">Phone Number</label>
                <input
                  type="number"
                  id="phone-number"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                />
              </div>
              <br />
              <div className={styles['form-select-section']}>
                <div className={styles['form-group']}>
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    id="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                <br />
                <Box className={styles['form-group']}>
                  <label htmlFor="gender">Gender *</label>
                  <Select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={styles['selector']}
                  >
                    <MenuItem disabled></MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </Box>
              </div>
              <br />
              <div className={styles['form-group']}>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  onChange={handleChange}
                />
              </div>
              <br />
              <button
                className={styles['signup-button']}
                disabled={isSubmitting}
              >
                Create Account
              </button>
            </form>
          </div>
        )}
      </section>
    </>
  );
};

export default LoginSignUp;
