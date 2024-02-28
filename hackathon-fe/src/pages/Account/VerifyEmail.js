import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as usersService from '../../utilities/users-service';

import Header from '../../components/Header';

import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

import styles from '../../styles/Common.module.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('et');
        const response = await usersService.verifyEmail(token);
        if (response.message === "User's email was verified successfully") {
          setIsVerified(true);
          setMessage('Email was verified successfully...');
          localStorage.setItem('needOnboard', JSON.stringify(true)); // to display onboard to user upon first login
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else toast.error(response.message);
      } catch (error) {
        toast.error('Failed to verify email. Please try again');
      } finally {
        setTimeout(() => {
          setIsVerifying(false);
        }, 5000);
      }
    };

    verifyUserEmail();
  }, [location.search, navigate]);

  const handleResend = async () => {
    try {
      setIsResending(true);
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('et');
      const response = await usersService.resendEmail(null, token); // accepts email, token
      if (response.message === 'Email resent successfully') {
        setMessage('Email resent successfully!');
      } else toast.error(response.message);
    } catch (error) {
      toast.error('Failed to resend email. Please try again');
    } finally {
      setTimeout(() => {
        setIsResending(false);
      }, 3000);
    }
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
          <ToastContainer className={styles['toast-container']} />
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
