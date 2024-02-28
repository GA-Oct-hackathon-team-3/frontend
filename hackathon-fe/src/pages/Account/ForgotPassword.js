import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import * as usersService from '../../utilities/users-service';
import { validateMatch, validatePassword } from '../../utilities/helpers';

import Header from '../../components/Header';

import { ToastContainer, toast } from 'react-toastify';
import styles from '../../styles/Common.module.css';

import { BsArrowLeft } from 'react-icons/bs';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('et');
  const [passwordValidity, setPasswordValidity] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [requiredMessage, setRequiredMessage] = useState(''); // displays invalid form and error messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailData, setEmailData] = useState({ email: '' });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  // handles constant password and match validation
  useEffect(() => {
    if (passwordData.newPassword)
      setPasswordValidity(validatePassword(passwordData.newPassword));
    setPasswordMatch(
      validateMatch(passwordData.newPassword, passwordData.confirmNewPassword)
    );
  }, [passwordData.newPassword, passwordData.confirmNewPassword]);

  const handleChange = (evt, setState) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormMessage = (string) => {
    setIsSubmitting(false);
    return setRequiredMessage(string);
  };

  const getResetEmail = async (evt) => {
    try {
      evt.preventDefault();
      setIsSubmitting(true);
      if (!emailData) return;
      const response = await usersService.getPasswordResetEmail(emailData);
      if (response.message === 'Password reset email sent successfully') {
        toast.info('Email sent... Please check your inbox', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error('Failed to reset email. Please try again');
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
  };

  const submitResetPassword = async (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);

    setRequiredMessage('');

    if (!passwordData.newPassword || !passwordData.confirmNewPassword)
      return handleFormMessage('Required fields are marked with a (*)');
    if (!passwordValidity)
      return handleFormMessage('Please enter a valid password');
    if (!passwordMatch) return handleFormMessage('Passwords must match');

    try {
      const response = await usersService.resetPassword(passwordData, token);
      if (response.message === "User's password reset successfully") {
        toast.info('Updating password...', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });

        setTimeout(() => {
          navigate('/login', { state: { path: location.pathname } });
        }, 2000);
      } else
        return handleFormMessage(
          'Either the old password was invalid, or there is a network error. Please try again.'
        );
    } catch (error) {
      return handleFormMessage(
        'Either the old password was invalid, or there is a network error. Please try again.'
      );
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header />
      <div className={styles['mainContainer']}>
        <div className={styles['container']}>
          <div className={styles['back-button']}>
            <BsArrowLeft onClick={() => navigate('/login')} />
          </div>
          <h1>Reset Password</h1>
          {!!token ? (
            <>
              <form onSubmit={submitResetPassword}>
                {requiredMessage ? requiredMessage : ''}
                <div className={styles['form-group']}>
                  <label htmlFor="newPassword">New Password *</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={(evt) => handleChange(evt, setPasswordData)}
                  />
                  {!passwordValidity && (
                    <p>
                      Password must contain at least 8 characters, 1 uppercase
                      letter, 1 lowercase letter, 1 number, & 1 special
                      character.
                    </p>
                  )}
                </div>
                <br />
                <div className={styles['form-group']}>
                  <label htmlFor="confirmNewPassword">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={(evt) => handleChange(evt, setPasswordData)}
                  />
                  {!passwordMatch && <p>Passwords do not match</p>}
                </div>
                <button
                  className={styles['signup-button']}
                  disabled={isSubmitting}
                >
                  Confirm
                </button>
              </form>
            </>
          ) : (
            <>
              <form onSubmit={getResetEmail}>
                {requiredMessage ? requiredMessage : ''}
                <div className={styles['form-group']}>
                  <label htmlFor="email" style={{ paddingTop: 10 }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={emailData.email}
                    onChange={(evt) => handleChange(evt, setEmailData)}
                  />
                </div>
                <button
                  className={styles['signup-button']}
                  disabled={isSubmitting}
                >
                  Confirm
                </button>
              </form>
            </>
          )}
          <ToastContainer className={styles['toast-container']} />
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
