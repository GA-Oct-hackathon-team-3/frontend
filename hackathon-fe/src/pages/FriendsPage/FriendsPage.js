import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import FriendItem from '../../components/BirthdayFriends/FriendItem';
import * as friendsService from "../../utilities/friends-service";
import { categorizeBirthday, presentlyCardColors } from "../../utilities/helpers";

import styles from "../../styles/BirthdayFriends.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import noFriendsImg from "../../assets/noFriendsImg.png";
import WomanCelebratingImg from "../../assets/womanCelebrating.png";
import manCelebratingImg from "../../assets/manCelebrating.png";
import pointingHandImg from "../../assets/pointingHandImg.png";

const FriendsPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [allFriends, setAllFriends] = useState([]);
    const [onboardingStep, setOnboardingStep] = useState(0);
  
    let birthdaysToday = false;
    let weekConditionMet = false;
    let monthConditionMet = false;
    let laterOnConditionMet = false;
  
    useEffect(() => {
      const fetchFriends = async () => {
        try {
          const friendsData = await friendsService.retrieveFriends();
          if (friendsData && friendsData.length) {
            friendsData.forEach((f, idx) => {
              // assigns card colors
              const colorIndex = idx % presentlyCardColors.length;
              f["cardColor"] = presentlyCardColors[colorIndex];
  
              // if next birthday is within 31 days, categorize as 'thisWeek' or 'thisMonth'
              if (f.daysUntilBirthday <= 31) f["birthday-time"] = categorizeBirthday(f.dob);
            });
          }
          setAllFriends(friendsData);
          setFilteredData(friendsData);
          if (!friendsData || typeof friendsData.length === "undefined") {
            setOnboardingStep(1); // Initiate onboarding if there are no friends
          }
        } catch (error) {
          console.error("Error fetching friends: ", error);
        }
      };
      fetchFriends();
    }, []);
  
    const handleSearch = (query) => {
      setSearchQuery(query);
  
      if (query) {
        // Filter the friends based on the search query
        const filteredResults = allFriends.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
  
        setFilteredData(filteredResults);
      } else {
        // If the query is empty, reset the list to the original friends data
        setFilteredData([...allFriends]);
      }
    };
  
    return (
      <>
        <Header />
        <div className={styles["friends-container"]}>
          <input
            className={styles["search-bar"]}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, date, month..."
          />
  
          <div className={styles.reminders}>
            <img src={manCelebratingImg} alt="Man celebrating" />
            <img src={WomanCelebratingImg} alt="Woman celebrating" />
            <div>
              {filteredData.length &&
                filteredData.map((friend, idx) => {
                  if (friend.daysUntilBirthday === 0) {
                    birthdaysToday = true;
                    return (
                      <p key={idx} style={{ color: friend.cardColor }}>
                        It's {friend.name}'s Birthday Today!
                      </p>
                    );
                  }
                })}
            </div>
            {!birthdaysToday && <h2>Your reminders will show up here!</h2>}
          </div>
  
          <div className={styles["list"]}>
            {filteredData.length > 0 ? (
              <>
                <h3>This Week</h3>
                {filteredData.length > 0 &&
                  filteredData.map((friend) => {
                    if (friend["birthday-time"] === "thisWeek") {
                      weekConditionMet = true;
                      return (
                        <FriendItem
                          key={friend._id}
                          {...friend}
                          id={friend._id}
                          friend={friend}
                        />
                      );
                    }
                  })}
                {!weekConditionMet && <p>No Birthdays At This Time</p>}
  
                <h3>This Month</h3>
                {filteredData.length > 0 &&
                  filteredData.map((friend) => {
                    if (friend["birthday-time"] === "thisMonth") {
                      monthConditionMet = true;
                      return (
                        <FriendItem
                          key={friend._id}
                          {...friend}
                          id={friend._id}
                          friend={friend}
                        />
                      );
                    }
                  })}
                {!monthConditionMet && <p>No Birthdays At This Time</p>}
  
                <h3>Later On</h3>
                {filteredData.length > 0 &&
                  filteredData.map((friend, idx) => {
                    if (
                      friend["birthday-time"] !== "thisWeek" &&
                      friend["birthday-time"] !== "thisMonth"
                    ) {
                      laterOnConditionMet = true;
                      return (
                        <FriendItem
                          key={friend._id}
                          {...friend}
                          id={friend._id}
                          friend={friend}
                        />
                      );
                    }
                  })}
                {!laterOnConditionMet && <p>No Birthdays At This Time</p>}
              </>
            ) : (
              <div className={styles["no-friends-yet"]}>
                <img src={noFriendsImg} alt="No friends added yet." />
                <p>
                  No birthdays to display–add a friend below to start gifting!
                </p>
              </div>
            )}
          </div>
  
          {onboardingStep === 1 && (
            <div className={styles["onboarding-overlay"]}>
              <div className={styles["onboarding-content"]}>
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
  
          {onboardingStep === 2 && (
            <div className={styles["onboarding-overlay2"]}>
              <div className={styles["onboarding-content2"]}>
                <h2>Add a new friend profile to get personalized gift ideas.</h2>
                <p onClick={() => setOnboardingStep(0)}>Skip for now</p>
                <img src={pointingHandImg} alt="Pointing hand" />
              </div>
            </div>
          )}
  
          <button onClick={() => navigate("/addfriend")}>
            <span>+</span>
            Add Friend
          </button>
        </div>
  
        <Footer />
      </>
    );
};

export default FriendsPage;
