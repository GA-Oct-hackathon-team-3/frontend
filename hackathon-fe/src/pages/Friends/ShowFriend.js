import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import * as friendsService from '../../utilities/friends-service';
import { splitDOB, calculateAge } from '../../utilities/helpers';

import Profile from '../../components/ShowFriend/Profile';
import Explore from '../../components/ShowFriend/Explore';

import EditIcon from '../../assets/icons/global/editIcon.png';

import { BsArrowLeft } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { IconButton, CircularProgress } from '@mui/material';

import styles from '../../styles/ShowFriend.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

const ShowFriend = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [friend, setFriend] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [dobObject, setDobObject] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [enableRecs, setEnableRecs] = useState(false);
  const [favError, setFavError] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmDelete, setConfirmDelete] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const friendData = await friendsService.showFriend(id);
        const uniqueTimestamp = Date.now();
        friendData.photo = `${
          friendData.photo
            ? friendData.photo
            : 'https://i.imgur.com/hCwHtRc.png'
        }?timestamp=${uniqueTimestamp}`;
        setFriend(friendData);
        setDobObject(splitDOB(friendData.dob));
        setFavorites(friendData.favoriteGifts);
        if (friendData.tags.length > 0) setEnableRecs(true);
      } catch (error) {
        throw error;
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1200);
      }
    };
    fetchFriend();
  }, [id]);

  useEffect(() => {
    // checking state passed from filter's page, and then changing tab to explore on mount
    if (location.state && location.state.tab === 'explore')
      setActiveTab('explore');
  }, [location.state]);

  useEffect(() => {
    let stateData;
    if (!hasShownToast && location.state && location.state.path) {
      stateData = location.state;
      if (
        (friend && stateData.path === `/friend/${friend._id}/tag`) ||
        (friend && stateData.path === `/friend/${friend._id}/edit`)
      ) {
        toast.success('Friend up to date!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        setHasShownToast(true);
      }
    }
  }, [friend, location.state, hasShownToast]); // this useEffect call determines when to show toast notification

  const toggleFavorite = async (recommendation, e) => {
    e.preventDefault();
    const idx = favorites.findIndex(
      (fav) => fav.title.toLowerCase() === recommendation.title.toLowerCase()
    );
    if (idx > -1) {
      // remove from favorites
      try {
        const item = favorites[idx];
        const res = await friendsService.removeFromFavorites(id, item._id);
        if (res)
          setFavorites(
            favorites.slice(0, idx).concat(favorites.slice(idx + 1))
          );
      } catch (error) {
        setFavError(error.message);
      }
    } else {
      // add to favorites
      try {
        const res = await friendsService.addToFavorites(id, recommendation);
        setFavorites([...favorites, res.recommendation]);
      } catch (error) {
        setFavError(error.message);
      }
    }
  };

  const handleDelete = async (evt) => {
    evt.preventDefault();
    try {
      const response = await friendsService.deleteFriend(id);
      if (response.message === 'Friend deleted successfully') {
        toast.info('Deleting friend...', {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: false,
          autoClose: 1000,
        });

        setTimeout(() => {
          navigate('/friends', { state: { path: location.pathname } });
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to delete friend. Please try again');
    }
  };

  return (
    <div className={styles['container']}>
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
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
          <div className={styles['settings']}>
            <div
              className={styles['dropdown']}
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <p>{isDropdownOpen ? 'Close' : 'Manage'}</p>
              <FontAwesomeIcon
                icon={isDropdownOpen ? faAngleUp : faAngleDown}
              />
            </div>

            {isDropdownOpen && (
              <div
                className={`${styles['drawer']} ${
                  isDropdownOpen && styles['open']
                }`}
                onClick={() => setConfirmDelete(true)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                <p>Delete</p>
              </div>
            )}
          </div>
          <div className={styles['profile-header']}>
            <div className={styles['profile']}>
              <img
                src={
                  friend && friend.photo
                    ? friend.photo
                    : 'https://i.imgur.com/hCwHtRc.png'
                }
                alt={friend && friend.name}
                className={styles['profile-pic']}
              />
              <h2 style={{ position: 'relative' }}>{friend && friend.name}</h2>
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
                  {friend && friend.daysUntilBirthday}
                </p>
                <p>Days left</p>
              </div>
              <div className={styles['border']}>
                <p></p>
                <p></p>
              </div>
              <div className={styles['description']}>
                <p className={styles['text-brick']}>
                  {friend && calculateAge(friend.dob)}
                </p>
                <p>Age </p>
              </div>
              <div>
                <div>
                  <IconButton onClick={() => navigate(`/friend/${id}/edit`)}>
                    <img alt="edit" src={EditIcon} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['tab-container']}>
            <span
              onClick={() => {
                setActiveTab('profile');
                navigate(`/friend/${id}`, { replace: true }); // when tab is switched to profile, removes params from url
              }}
              className={activeTab === 'profile' ? styles['active-tab'] : ''}
            >
              Profile
            </span>
            <span
              onClick={() => setActiveTab('explore')}
              className={activeTab === 'explore' ? styles['active-tab'] : ''}
            >
              Explore Gifts
            </span>
          </div>
          <div className={styles['active-container']}>
            {friend && activeTab === 'profile' && (
              <Profile
                favError={favError}
                favorites={favorites}
                friendLocation={friend.location}
                giftPreferences={friend.giftPreferences}
                id={id}
                tags={friend.tags}
                toggleFavorite={toggleFavorite}
              />
            )}
            {friend && activeTab === 'explore' && (
              <Explore
                enableRecs={enableRecs}
                favorites={favorites}
                friend={friend}
                friendLocation={friend.location}
                giftPreferences={friend.giftPreferences}
                id={id}
                tags={friend.tags}
                toggleFavorite={toggleFavorite}
              />
            )}
          </div>

          {showConfirmDelete && (
            <div className={styles['confirm-delete-overlay']}>
              <div className={styles['content']}>
                <p>
                  Are you sure you want to delete{' '}
                  <span style={{ textTransform: 'capitalize' }}>
                    {friend.name}
                  </span>
                  ? <br /> <br /> This action cannot be undone.
                </p>

                <div className={styles['btn-container']}>
                  <button onClick={handleDelete}>Yes</button>
                  <button onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <ToastContainer
            className={styles['toast-container']}
            hideProgressBar
          />
        </div>
      )}
    </div>
  );
};

export default ShowFriend;
