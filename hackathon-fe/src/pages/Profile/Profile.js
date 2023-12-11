import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import * as profilesService from '../../utilities/profiles-service';
import { splitDOB, calculateAge } from '../../utilities/helpers';

import EditIcon from '../../assets/icons/global/editIcon.png';
import gear from '../../assets/icons/profile/gear.png';

import { BsArrowLeft } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import {
  Card,
  CardHeader,
  IconButton,
  CardContent,
  CircularProgress,
} from '@mui/material';

import styles from '../../styles/ShowFriend.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [dobObject, setDobObject] = useState(null);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileInfo = await profilesService.getProfile();
      if (profileInfo.profile.photo) {
        const uniqueTimestamp = Date.now();
        profileInfo.profile.photo = profileInfo.profile.photo
          ? `${profileInfo.profile.photo}?timestamp=${uniqueTimestamp}`
          : 'https://i.imgur.com/hCwHtRc.png';
      }
      setUserProfile(profileInfo.profile);
      setDobObject(splitDOB(profileInfo.profile.dob));
      setTimeout(() => {
        setIsLoading(false);
      }, 1200);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    let stateData;
    if (!hasShownToast && location.state && location.state.path) {
      stateData = location.state;
      if (
        (userProfile && stateData.path === '/profile/edit') ||
        (userProfile && stateData.path === '/update-password')
      ) {
        toast.success('Profile updated!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        setHasShownToast(true);
      }
    }
  }, [userProfile, location.state, hasShownToast]); // this useEffect call determines when to show toast notification

  return (
    <div className={styles['container']}>
      {isLoading ? (
        <div style={{ margin: 'auto' }}>
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <div className={styles['content-container']}>
          <div className={styles['shadow']}></div>
          <p
            className={styles['back-btn']}
            onClick={() => navigate('/friends')}
          >
            <BsArrowLeft />
          </p>
          <div
            className={styles['settings']}
            onClick={() => navigate('/settings')}
          >
            <img src={gear} alt="settings" />
            Settings
          </div>
          <div className={styles['profile-header']}>
            <div className={styles['profile']}>
              <img
                src={
                  userProfile && userProfile.photo
                    ? userProfile.photo
                    : 'https://i.imgur.com/hCwHtRc.png'
                }
                alt={userProfile && userProfile.name}
                className={styles['profile-pic']}
              />
              <h2 style={{ position: 'relative' }}>
                {userProfile && userProfile.name}
              </h2>
            </div>
            <div className={styles['birthday']}>
              <div className={styles['description']}>
                <p className={styles['text-brick']}>
                  {dobObject && dobObject.day}
                </p>
                <p>{dobObject && dobObject.month}</p>
              </div>
              <div className={styles['border']}>
                <p></p>
                <p></p>
              </div>
              <div className={styles['description']}>
                <p className={styles['text-brick']}>
                  {userProfile && userProfile.daysUntilBirthday}
                </p>
                <p>Days left</p>
              </div>
              <div className={styles['border']}>
                <p></p>
                <p></p>
              </div>
              <div className={styles['description']}>
                <p className={styles['text-brick']}>
                  {userProfile && calculateAge(userProfile.dob)}
                </p>
                <p>Age </p>
              </div>
              <div>
                <IconButton onClick={() => navigate(`/profile/edit`)}>
                  <img alt="edit" src={EditIcon} />
                </IconButton>
              </div>
            </div>
          </div>
          <div className={styles['tab-container']}>
            <span className={styles['active-tab']}>Profile</span>
          </div>
          <div className={styles['active-container']}>
            <Card className={styles['card']}>
              <CardHeader
                className={styles['card-header']}
                title="Bio"
                action={
                  <IconButton onClick={() => navigate(`/profile/edit`)}>
                    <img alt="edit" src={EditIcon} />
                  </IconButton>
                }
              />
              <CardContent>
                <div className={styles['gift-preference']}>
                  <div className={styles['bio']}>
                    {userProfile && userProfile.bio}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={styles['card']}>
              <CardHeader
                className={styles['card-header']}
                title="Interests"
                action={
                  <IconButton onClick={() => navigate(`/profile/edit`)}>
                    <img alt="edit" src={EditIcon} />
                  </IconButton>
                }
              />
              <CardContent>
                <div className={styles['gift-preference']}>
                  <div className={styles['tags']}>
                    {userProfile &&
                      userProfile.interests.map((interest, idx) => (
                        <button key={idx}>{interest}</button>
                      ))}
                    {userProfile && !userProfile.interests.length && (
                      <>
                        <div>See your interests here</div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <ToastContainer
            className={styles['toast-container']}
            hideProgressBar
          />
        </div>
      )}
    </div>
  );
};

export default Profile;