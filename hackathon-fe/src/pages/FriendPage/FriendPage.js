import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/ShowFriend.module.css';
import * as friendsService from '../../utilities/friends-service';
import { daysUntilBirthday, splitDOB, calculateAge } from '../../utilities/helpers';
import { BsArrowLeft } from 'react-icons/bs';

import EditIcon from '../../assets/edit_icon.png';

import Profile from '../../components/ShowFriend/Profile';
import Explore from '../../components/ShowFriend/Explore';

const FriendPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [friend, setFriend] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [dobObject, setDobObject] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [enableRecs, setEnableRecs] = useState(false);
  const [favError, setFavError] = useState('');
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    const fetchFriend = async () => {
      const friendData = await friendsService.showFriend(id);
      const uniqueTimestamp = Date.now();
      friendData.photo = `${
        friendData.photo ? friendData.photo : 'https://i.imgur.com/hCwHtRc.png'
      }?timestamp=${uniqueTimestamp}`;
      setFriend(friendData);
      setDobObject(splitDOB(friendData.dob));
      setFavorites(friendData.favoriteGifts);
      if (friendData.tags.length > 0) setEnableRecs(true);
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
    if (!hasShownToast && location.state) {
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
    const idx = favorites.findIndex((fav) => fav.title.toLowerCase() === recommendation.title.toLowerCase());
    if (idx > -1) {
      // remove from favorites
      try {
        const item = favorites[idx];
        const res = await friendsService.removeFromFavorites(id, item._id);
        if (res)
          setFavorites(favorites.slice(0, idx).concat(favorites.slice(idx + 1)));
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

  return (
    <div className={styles['container']}>
      <div className={styles['shadow']}></div>
      <div className={styles['profile']}>
        <img
          src={ friend && friend.photo ? friend.photo : 'https://i.imgur.com/hCwHtRc.png' }
          alt="Anthony Sudol"
          className={styles['profile-pic']}
        />
        <h2 style={{ position: 'relative' }}>{friend && friend.name}</h2>
        <p className={styles['back-btn']} onClick={() => navigate('/friends')}>
          <BsArrowLeft />
        </p>

        <p>Friend</p>
      </div>
      <div className={styles['birthday']}>
        <div className={styles['description']}>
          <p className={styles['text-brick']}>{dobObject && dobObject.day}</p>
          <p>{dobObject && dobObject.month}</p>
        </div>
        <div className={styles['border']}>
          <p></p>
          <p></p>
        </div>
        <div className={styles['description']}>
          <p className={styles['text-brick']}>
            {friend && daysUntilBirthday(friend.dob)}
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
          <img
            onClick={() => navigate(`/friend/${id}/edit`)}
            alt="edit"
            src={EditIcon}
          />
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
      <ToastContainer className={styles['toast-container']} hideProgressBar />
    </div>
  );
};

export default FriendPage;
