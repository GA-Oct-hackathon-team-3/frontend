import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

import * as usersService from '../../utilities/users-service';
import { validateMatch, validatePassword } from '../../utilities/helpers';

import { ToastContainer, toast } from 'react-toastify';
import styles from '../../styles/SignUp.module.css';

import Header from '../../components/Header/Header';

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordValidity, setPasswordValidity] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [requiredMessage, setRequiredMessage] = useState(''); // displays invalid form and error messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // handles constant password and match validation
  useEffect(() => {
    if (formData.newPassword) setPasswordValidity(validatePassword(formData.newPassword));
    setPasswordMatch( validateMatch(formData.newPassword, formData.confirmNewPassword));
  }, [formData.newPassword, formData.confirmNewPassword]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmNewPassword
    ) return false;
    else return true;
  };

  const handleFormMessage = (string) => {
    setIsSubmitting(false);
    return setRequiredMessage(string);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);

    // resets message
    setRequiredMessage('');

    // form validation prior to submit
    const valid = validateForm();
    if (!valid) return handleFormMessage('Required fields are marked with (*)');
    if (!passwordValidity) return handleFormMessage('Please enter a valid password');
    if (!passwordMatch) return handleFormMessage('Passwords must match');

    try {
      const response = await usersService.updatePassword(formData);
      if (response.message === 'Password changed') {
        toast.info('Updating password...', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });

        setTimeout(() => { navigate('/profile', { state: { path: location.pathname } }) }, 2000);
      }
      else return handleFormMessage('Either the old password was invalid, or there is a network error. Please try again.');
    } catch (error) {
      return handleFormMessage('Either the old password was invalid, or there is a network error. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <section className={styles['signup-container']}>
        <div className={styles['content-container']}>
          <div className={styles['back-button']}>
            <BsArrowLeft onClick={() => navigate('/settings')} />
          </div>
          <h1>Update Password</h1>
          <br />
          <form className={styles['form-container']} onSubmit={handleSubmit}>
            {requiredMessage ? requiredMessage : ''}
            <div className={styles['form-group']}>
              <label htmlFor="oldPassword" style={{ paddingTop: 10 }}>
                Old Password *
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
              />
            </div>
            <br />
            <div className={styles['form-group']}>
              <label htmlFor="newPassword">New Password *</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
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
              <label htmlFor="confirmNewPassword">Confirm New Password *</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
              {!passwordMatch && <p>Passwords do not match</p>}
            </div>
            <br />
            <button className={styles['signup-button']} disabled={isSubmitting}>
              Confirm
            </button>
          </form>
          <ToastContainer className={styles['toast-container']} />
        </div>
      </section>
    </>
  );
};


export default UpdatePasswordPage;