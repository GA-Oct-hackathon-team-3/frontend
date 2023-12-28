import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as usersService from '../utilities/users-service';

import Header from '../components/Header/Header';

import { CircularProgress } from '@mui/material';

import styles from '../styles/Filters.module.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyUserEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('et');
      const response = await usersService.verifyEmail(token);
      if (response.message === "User's email was verified successfully") {
        setIsVerified(true);
        setMessage('Email was verified successfully...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else setErrorMessage(response.message);
    };

    verifyUserEmail();
    setTimeout(() => {
      setIsVerifying(false);
    }, 5000);
  }, []);

  const handleResend = async (evt) => {
    setIsResending(true);
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('et');
    const response = await usersService.resendEmail(null, token); // accepts email, token
    if (response.message === 'Email resent successfully') {
      setMessage('Email resent successfully!');
    } else setErrorMessage(response.message);
    setTimeout(() => {
      setIsResending(false);
    }, 3000);
  };

  return (
    <>
      <Header />
      <div className={styles['mainContainer']}>
        <div className={styles['container']}>
          <div style={{ paddingTop: '6rem' }}>
            <div className={styles['loading-container']}>
              {isVerifying && (
                <>
                  <h1>Verifying Email...</h1>
                  <br />
                  <CircularProgress color="secondary" />
                </>
              )}
            </div>
            {!isVerifying && errorMessage && <h1>{errorMessage}</h1>}
            {isVerified && message && <h1>{message}</h1>}

            <div className={styles['loading-container']}>
              {!isVerifying && !isResending && !message && (
                <button className={styles['resend']} onClick={handleResend}>
                  Resend Email
                </button>
              )}
            </div>

            <div className={styles['loading-container']}>
              {!isVerifying && isResending && (
                <>
                  <h1>Resending Email...</h1>
                  <br />
                  <CircularProgress color="secondary" />
                </>
              )}
              {!isResending && !isVerified && message && <h1>{message}</h1>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
