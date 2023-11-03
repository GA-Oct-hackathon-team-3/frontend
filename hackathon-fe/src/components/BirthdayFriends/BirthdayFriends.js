import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import * as friendsService from "../../utilities/friends-service";
import {
  daysUntilBirthday,
  getCurrentMonth,
  getNumericMonthFromBirthday,
  hasBirthdayPassed,
  getCurrentDate,
} from "../../utilities/helpers";

import styles from "./BirthdayFriends.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import noFriendsImg from "../../assets/noFriendsImg.png";
import WomanCelebratingImg from "../../assets/womanCelebrating.png";
import manCelebratingImg from "../../assets/manCelebrating.png";
import pointingHandImg from "../../assets/pointingHandImg.png";

const BirthdayFriends = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const itemCardColors = [
    "#AF95E7",
    "#FE6797",
    "#EDB600",
    "#418BFA",
    "#FA7F39",
    "#53CF85",
    "#8cb2c9",
    "#19bd2c",
    "#9cd7d4",
    "#de8d65",
    "#f47d5f",
    "#2367a1",
    "#cf5f53",
    "#ca97df",
    "#a7adea",
  ];

  const todaysDate = getCurrentDate();
  const currentMonth = getCurrentMonth() + 1;
  let birthdaysToday = false;
  let weekConditionMet = false;
  let monthConditionMet = false;
  let laterOnConditionMet = false; /* this variable is to check if a friend's bday is this week or month, lines around 211 & 230 */

  function getRandomColor() {
    return itemCardColors[Math.floor(Math.random() * 15)];
  }

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await friendsService.retrieveFriends();
        if (friendsData.length) {
          friendsData.sort(
            (a, b) => daysUntilBirthday(a.dob) - daysUntilBirthday(b.dob)
          );
        }
        if (friendsData && friendsData.length) {
          friendsData.forEach((f) => (f["cardColor"] = getRandomColor()));

          friendsData.forEach((f) => {
            if (daysUntilBirthday(f.dob) <= 7) {
              f["birthday-time"] = "thisWeek";
            } else if (
              currentMonth === getNumericMonthFromBirthday(f.dob) &&
              !hasBirthdayPassed(f.dob)
            ) {
              f["birthday-time"] = "thisMonth";
            }
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

  const Item = ({ friend, name, dob, id, photo, cardColor }) => {
    const [isViewSavedGifts, setIsViewedSavedGifts] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const canvasRef = useRef(null);

    const viewSavedGiftsHandler = async (e) => {
      e.stopPropagation();
      console.log(friend);
      const favorites = await friendsService.getFavorites(id);
      setFavorites(favorites);
      setIsViewedSavedGifts((preVal) => !preVal);
    };

    const buildGiftLink = (friend, gift) => {
      if (/present/i.test(gift.giftType)) {
        return `https://www.amazon.com/s?k=${gift.title}`;
      } else if (/donation/i.test(gift.giftType)) {
        return `https://www.google.com/search?q=${gift.title}`;
      } else if (/experience/i.test(gift.giftType)) {
        let query = `https://www.google.com/search?q=${gift.title}`;
        if (friend && friend.location) {
          query += `+near+${friend.location}`;
        }
        return query;
      }
    };
    return (
      <button
        onClick={() => navigate(`/friend/${id}`, { state: { id: id } })}
        className={styles["itemButton"]}
      >
        <div className={styles["item"]}>
          {daysUntilBirthday(friend.dob) === 0 && <Confetti height="90" width="320" numberOfPieces="65" colors={itemCardColors} style={{ margin: "8px auto 0" }} ref={canvasRef} />}

          <div>
            {photo ? (
              <img src={photo} alt={name} />
            ) : (
              <FontAwesomeIcon
                icon={faBirthdayCake}
                size="xl"
                style={{ height: 60, width: 60 }}
                color={cardColor}
              />
            )}
            <div>
              <p>{name}</p>
              <p>{dob}</p>
            </div>

            <div className={styles["card"]}>
              <p className={styles["days"]} style={{ color: cardColor }}>
                {daysUntilBirthday(dob)}
              </p>
              <p className={styles["label"]}>Days Left</p>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: cardColor,
            borderBottomLeftRadius: isViewSavedGifts && "0",
            borderBottomRightRadius: isViewSavedGifts && "0",
          }}
          onClick={viewSavedGiftsHandler}
        >
          View Saved Gifts{" "}
          <sub className={styles.dropdown}>
            {!isViewSavedGifts ? (
              <RiArrowDropDownLine />
            ) : (
              <RiArrowDropUpLine />
            )}
          </sub>
        </div>
        <div className={isViewSavedGifts ? styles.open : ""}>
          {isViewSavedGifts &&
            favorites.map((fav, idx) => {
              return (
                <Link
                  to={buildGiftLink(friend, fav)}
                  target="_blank"
                  key={idx}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={fav.image} alt={fav.title} />
                  <p>{fav.title}</p>
                </Link>
              );
            })}
          {isViewSavedGifts && favorites.length === 0 && (
            <p>No Favorites At This Time.</p>
          )}
        </div>
      </button>
    );
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
            {!!filteredData.length && filteredData.map((friend, idx) => {
              if (friend.dob.slice(5) === todaysDate) {
                birthdaysToday = true;
                return <p key={idx}>Today Is {friend.name}'s Birthday!</p>;
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
                      <Item
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
                      <Item
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
                      <Item
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

export default BirthdayFriends;
