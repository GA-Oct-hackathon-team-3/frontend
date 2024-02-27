import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import * as friendsService from '../../utilities/friends-service';
import * as profilesService from '../../utilities/profiles-service';
import { friendsFilter } from '../../utilities/helpers';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FriendItem from '../../components/FriendItem';

import noFriendsImg from '../../assets/icons/friendsList/noFriendsImg.png';
import WomanCelebratingImg from '../../assets/icons/friendsList/womanCelebrating.png';
import manCelebratingImg from '../../assets/icons/friendsList/manCelebrating.png';
import pointingHandImg from '../../assets/images/onboarding/pointingHandImg.png';

import { CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

import styles from '../../styles/BirthdayFriends.module.css';

const FriendsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [hasShownToast, setHasShownToast] = useState(false);

  // initializes friend state with category structure
  const [friends, setFriends] = useState({
    today: [],
    thisWeek: [],
    thisMonth: [],
    laterOn: [],
  }); // use to reset filter
  const [filteredFriends, setFilteredFriends] = useState({
    today: [],
    thisWeek: [],
    thisMonth: [],
    laterOn: [],
  }); // use to render

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await friendsService.retrieveFriends();
        if (friendsData && !friendsData.message) {
          setFriends(friendsData);
          setFilteredFriends(friendsData);
        } else setFilteredFriends(null);
      } catch (error) {
        console.error('Error fetching friends: ', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1200);
      }
    };
    const isNewUser = localStorage.getItem('needOnboard');
    if (isNewUser && JSON.parse(isNewUser)) {
      // if needOnboard exists (set after successful email verification), and if true
      setOnboardingStep(1); // start onboarding steps
      localStorage.removeItem('needOnboard');
    }
    fetchFriends();
  }, []);

  useEffect(() => {
    let stateData;
    if (!hasShownToast && location.state && location.state.path) {
      stateData = location.state;
      if (stateData.path && stateData.path.includes('/friend')) {
        toast.success('Friend deleted', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        setHasShownToast(true);
      }
    }
  }, [location.state, hasShownToast]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query) {
      // Filter the friends based on the search query using friendsFilter helper
      const filteredResults = {
        today: friendsFilter(friends.today, query),
        thisWeek: friendsFilter(friends.thisWeek, query),
        thisMonth: friendsFilter(friends.thisMonth, query),
        laterOn: friendsFilter(friends.laterOn, query),
      };
      setFilteredFriends(filteredResults);
    } else {
      // resets list to categorizedFriends if query is empty
      setFilteredFriends(friends);
    }
  };

  const enableEmailsAndClose = async () => {
    await profilesService.updateUserProfile({ emailNotifications: true }, null);
    setOnboardingStep(0);
  };

  const renderSection = (friends, sectionTitle) => {
    // renders each section with the corresponding friends category data
    if (friends.length === 0) return;
    return (
      <div className={styles['section']}>
        <h3>{sectionTitle}</h3>
        {friends.map((friend) => (
          <FriendItem
            key={friend._id}
            {...friend}
            id={friend._id}
            friend={friend}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles['friends-container']}>
        {isLoading ? (
          <div style={{ margin: 'auto' }}>
            <CircularProgress color="secondary" />
          </div>
        ) : (
          <div className={styles['content-container']}>
            <input
              className={styles['search-bar']}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name..."
            />

            <div className={styles['reminders']}>
              <img src={manCelebratingImg} alt="Man celebrating" />
              <img src={WomanCelebratingImg} alt="Woman celebrating" />
              <div>
                {friends && friends.today.length > 0 ? (
                  friends.today.map((friend, idx) => (
                    <p key={idx} style={{ color: friend.cardColor }}>
                      It's {friend.name}'s birthday today!
                    </p>
                  ))
                ) : (
                  <h2>Your reminders will show up here!</h2>
                )}
              </div>
            </div>

            <div className={styles['list']}>
              {filteredFriends ? (
                <>
                  {renderSection(filteredFriends.today, 'Today')}
                  {renderSection(filteredFriends.thisWeek, 'This Week')}
                  {renderSection(filteredFriends.thisMonth, 'This Month')}
                  {renderSection(filteredFriends.laterOn, 'Later On')}
                </>
              ) : (
                <div className={styles['no-friends-yet']}>
                  <img src={noFriendsImg} alt="No friends added yet." />
                  <p>
                    No birthdays to display... add a friend to start gifting!
                  </p>
                </div>
              )}
            </div>

            {onboardingStep === 1 && (
              <div className={styles['onboarding-overlay-step-one']}>
                <div className={styles['content']}>
                  <h2>Welcome to your Presently Dashboard!</h2>
                  <ul>
                    Here you can...
                    <li>See birthdays that are coming up soon</li>
                    <li>
                      Search for a friend to view their profile or saved gifts
                    </li>
                  </ul>
                  <button onClick={() => setOnboardingStep(2)}>Continue</button>
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className={styles['onboarding-overlay-step-two']}>
                <div className={styles['content']}>
                  <h2>
                    Add a new friend profile to get personalized gift ideas.
                  </h2>
                  <button onClick={() => setOnboardingStep(3)}>Continue</button>
                  <img src={pointingHandImg} alt="Pointing hand" />
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className={styles['onboarding-overlay-step-two']}>
                <div className={styles['content']}>
                  <h3>Receive email notifications of upcoming birthdays?</h3>
                  <button onClick={enableEmailsAndClose}>Enable</button>
                  <p onClick={() => setOnboardingStep(0)}>Skip for now</p>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/addfriend')}
              className={styles['add-friend']}
            >
              <span>+</span>
              Add Friend
            </button>
          </div>
        )}
        <ToastContainer className={styles['toast-container']} hideProgressBar />
      </div>
      <Footer />
    </>
  );
};

export default FriendsPage;
