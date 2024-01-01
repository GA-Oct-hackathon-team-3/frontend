import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import * as profilesService from '../utilities/profiles-service';
import Header from '../components/Header/Header';

import { BsArrowLeft } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinus,
  faPlus,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';

import styles from '../styles/Filters.module.css';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const { emailNotifications } = locationState;

  const [show, setShow] = useState('');
  const [emailNotificationsState, setEmailNotificationsState] =
    useState(emailNotifications);

  const logOutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleClick = (section) => {
    if (show === section) return setShow('');
    else setShow(section);
  };

  const handleToggle = async () => {
    const profileInput = {
      emailNotifications: !emailNotificationsState,
    };
    const response = await profilesService.updateUserProfile(
      profileInput,
      null
    );
    if (response.message === 'User profile updated')
      setEmailNotificationsState(!emailNotificationsState);
  };

  return (
    <>
      <Header />
      <div className={styles['mainContainer']}>
        <div className={styles['container']}>
          <div className={styles['heading-container']}>
            <p
              style={{ fontSize: '1.5rem' }}
              onClick={() => navigate('/profile')}
            >
              <BsArrowLeft />
            </p>
            <h1>Settings</h1>
          </div>
          <div className={styles['row-container']}>
            <div
              className={styles.row}
              onClick={() => navigate('/privacy-policy')}
            >
              <h2 style={{ cursor: 'pointer' }}>Privacy Policy</h2>
            </div>
          </div>
          <div className={styles['row-container']}>
            <div
              className={styles.row}
              onClick={() => navigate('/delete-account')}
            >
              <h2 style={{ cursor: 'pointer' }}>Delete Account</h2>
            </div>
          </div>
          <div className={styles['row-container']}>
            <div
              className={styles.row}
              onClick={() => navigate('/update-password')}
            >
              <h2 style={{ cursor: 'pointer' }}>Update Password</h2>
            </div>
          </div>
          <div className={styles['row-container']}>
            <div className={styles.row}>
              <h2>Preferences</h2>
              <FontAwesomeIcon
                onClick={() => handleClick('preferences')}
                icon={show === 'preferences' ? faMinus : faPlus}
                size="2x"
                style={{ cursor: 'pointer' }}
              />
            </div>
            {show === 'preferences' && (
              <div className={styles.row}>
                <h3>Enable / Disable Email Notiications</h3>
                <div onClick={handleToggle}>
                  {emailNotificationsState ? (
                    <FontAwesomeIcon
                      icon={faToggleOn}
                      color="#53CF85"
                      size="2xl"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faToggleOff}
                      color="#AF95E7"
                      size="2xl"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <button className={styles['logout']} onClick={logOutHandler}>
          Logout
        </button>
      </div>
    </>
  );
};

export default Settings;
