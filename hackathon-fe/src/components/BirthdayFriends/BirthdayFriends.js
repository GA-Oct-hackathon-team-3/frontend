import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import * as friendsService from "../../utilities/friends-service";
import { daysUntilBirthday } from "../../utilities/helpers";

import styles from "./BirthdayFriends.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import WomanCelebratingImg from "../../assets/womanCelebrating.png";
import manCelebratingImg from "../../assets/manCelebrating.png";

const BirthdayFriends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await friendsService.retrieveFriends();
        setAllFriends(friendsData);
        setFilteredData(friendsData);
        console.log("Length", friendsData.length);
        if (typeof friendsData.length === "undefined") {
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

  const Item = ({ name, dob, id, photo }) => {
    const history = useNavigate();

    return (
      <button
        onClick={() => navigate(`/friend/${id}`, { state: { id: id } })}
        className={styles["itemButton"]}
      >
        <div className={styles["item"]}>
          <div>
            {photo ? (
              <img src={photo} alt={name} />
            ) : (
              <FontAwesomeIcon
                icon={faBirthdayCake}
                size="80px"
                style={{ height: 60, width: 60 }}
              />
            )}
            <div>
              <p>{name}</p>
              <p>{dob}</p>
            </div>

            <div className={styles["card"]}>
              <p className={styles["days"]}>{daysUntilBirthday(dob)}</p>
              <p className={styles["label"]}>Days Left</p>
            </div>
          </div>
        </div>
        <div>View Saved Gifts </div>
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
          <h2>Your reminders will show up here!</h2>
        </div>

        <div className={styles["list"]}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <Item key={item._id} {...item} id={item._id} />
            ))
          ) : (
            <div>No friends</div>
          )}
        </div>

        {onboardingStep === 1 && (
          <div className={styles["onboarding-overlay"]}>
            <div className={styles["onboarding-content"]}>
              <h2>Welcome to your Presently Dashboard!</h2>
              <ul>
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
            <div className={styles["onboarding-content"]}>
              <h2>Add a new friend profile to get personalized gift ideas.</h2>
              <button onClick={() => setOnboardingStep(0)}>Skip for now</button>
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
