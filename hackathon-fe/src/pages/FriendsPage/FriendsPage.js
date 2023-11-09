import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import FriendItem from '../../components/BirthdayFriends/FriendItem';
import * as friendsService from '../../utilities/friends-service';
import { categorizeBirthday, presentlyCardColors, friendsFilter } from '../../utilities/helpers';

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
  const [filteredFriends, setFilteredFriends] = useState({ today: [], thisWeek: [], thisMonth: [], laterOn: [] }); // use to render
  const [categorizedFriends, setCategorizedFriends] = useState({ today: [], thisWeek: [], thisMonth: [], laterOn: [] }); // use to reset filter

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await friendsService.retrieveFriends();
        if (friendsData && friendsData.length) organizeFriendsList(friendsData);
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
        today: friendsFilter(categorizedFriends.today, query),
        thisWeek: friendsFilter(categorizedFriends.thisWeek, query),
        thisMonth: friendsFilter(categorizedFriends.thisMonth, query),
        laterOn: friendsFilter(categorizedFriends.laterOn, query),
      };

      setFilteredFriends(filteredResults);
    } else {
      // resets list to categorizedFriends if query is empty
      setFilteredFriends(categorizedFriends);
    }
  };

  const organizeFriendsList = (friendsData) => {
    const friendsList = {
      today: [],
      thisWeek: [],
      thisMonth: [],
      laterOn: [],
    };

    friendsData.forEach((f, idx) => {
      // assigns card colors
      const colorIndex = idx % presentlyCardColors.length;
      f['cardColor'] = presentlyCardColors[colorIndex];

      // categorizing birthday by today, thisWeek, thisMonth, and later based on daysUntilBirthday
      if (f.daysUntilBirthday === 0) friendsList.today.push(f);
      else if (f.daysUntilBirthday <= 31) {
        const result = categorizeBirthday(f.dob); // utilizes helper that processes whether bday is in same calendar week as today or just in same month
        if (result === 'thisWeek') friendsList.thisWeek.push(f);
        if (result === 'thisMonth') friendsList.thisMonth.push(f);
      } else friendsList.laterOn.push(f);
    });

    // sets state with fetch response organized into categories for easy render
    setCategorizedFriends(friendsList);
    setFilteredFriends(friendsList);
  };

  const renderSection = (friends, sectionTitle) => {
    // renders each section with the corresponding friends category data
    return (
      <div>
        <h3>{sectionTitle}</h3>
        {friends.length === 0 ? (
          <p>No Birthdays At This Time</p>
        ) : (
          friends.map((friend) => (
            <FriendItem
              key={friend._id}
              {...friend}
            />
          ))
        )}
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
            {categorizedFriends && categorizedFriends.today.length > 0 ? (
              categorizedFriends.today.map((friend, idx) => (
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