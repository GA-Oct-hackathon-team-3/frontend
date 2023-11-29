import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import FriendItem from '../../components/BirthdayFriends/FriendItem';
import * as friendsService from '../../utilities/friends-service';
import { friendsFilter } from '../../utilities/helpers';

import styles from '../../styles/BirthdayFriends.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import noFriendsImg from '../../assets/noFriendsImg.png';
import WomanCelebratingImg from '../../assets/womanCelebrating.png';
import manCelebratingImg from '../../assets/manCelebrating.png';
import pointingHandImg from '../../assets/pointingHandImg.png';

const FriendsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // determining if user is coming from signup
  const queryParams = new URLSearchParams(location.search);
  const fromSignup = queryParams.get('fromSignup');

  const [searchQuery, setSearchQuery] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(0);

  // initializes friend state with category structure
  const [friends, setFriends] = useState({ today: [], thisWeek: [], thisMonth: [], laterOn: [] }); // use to reset filter
  const [filteredFriends, setFilteredFriends] = useState({ today: [], thisWeek: [], thisMonth: [], laterOn: [] }); // use to render

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await friendsService.retrieveFriends();
        if (friendsData) {
            setFriends(friendsData);
            setFilteredFriends(friendsData);
        }
        else setFilteredFriends(friendsData);
        if (fromSignup === 'true') setOnboardingStep(1); // only show onboarding if user is coming from signup
      } catch (error) {
        console.error('Error fetching friends: ', error);
      }
    };
    fetchFriends();
  }, [fromSignup]);

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

  const renderSection = (friends, sectionTitle) => {
    // renders each section with the corresponding friends category data
    if (friends.length === 0) return;
    return (
      <div>
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
        <input
          className={styles['search-bar']}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, date, month..."
        />

        <div className={styles.reminders}>
          <img src={manCelebratingImg} alt="Man celebrating" />
          <img src={WomanCelebratingImg} alt="Woman celebrating" />
          <div>
            {friends && friends.today.length > 0 ? (
              friends.today.map((friend, idx) => (
                <p key={idx} style={{ color: friend.cardColor }}>
                  It's {friend.name}'s Birthday Today!
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
                No birthdays to display – add a friend below to start gifting!
              </p>
            </div>
          )}
        </div>

        {fromSignup === 'true' && onboardingStep === 1 && (
          <div className={styles['onboarding-overlay']}>
            <div className={styles['onboarding-content']}>
              <h2>Welcome to your Presently Dashboard!</h2>
              <ul>
                Here you can:
                <li>See birthdays that are coming up soon</li>
                <li>
                  Search for a friend to view their profile or saved gifts
                </li>
              </ul>
              <button onClick={() => setOnboardingStep(2)}>Continue</button>
            </div>
          </div>
        )}

        {fromSignup === 'true' && onboardingStep === 2 && (
          <div className={styles['onboarding-overlay2']}>
            <div className={styles['onboarding-content2']}>
              <h2>Add a new friend profile to get personalized gift ideas.</h2>
              <p onClick={() => setOnboardingStep(0)}>Skip for now</p>
              <img src={pointingHandImg} alt="Pointing hand" />
            </div>
          </div>
        )}

        <button onClick={() => navigate('/addfriend')}>
          <span>+</span>
          Add Friend
        </button>
      </div>

      <Footer />
    </>
  );
};

export default FriendsPage;
