import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ShowFriend.module.css";
import { Card } from "@mui/material";
import * as friendsService from "../../utilities/friends-service";
import {
  daysUntilBirthday,
  splitDOB,
  calculateAge
} from "../../utilities/helpers";

const ShowFriend = () => {


  const [friend, setFriend] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [dobObject, setDobObject] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriend = async () => {
      const friend = await friendsService.showFriend(id);
      console.log(friend);
      setFriend(friend);
      setDobObject(splitDOB(friend.dob));
    }
    const fetchFavorites = async () => {
      const favorites = await friendsService.getFavorites(id);
      console.log(favorites);
      setFavorites(favorites);
    }
    fetchFriend();
    fetchFavorites();
  }, [id]);
  const handleTabClick = tabName => {
    setActiveTab(tabName);
  }

  const giftPreferences = friend && friend.giftPreferences;


  return (
    <div className={styles["container"]}>
      <button type="button" onClick={() => navigate("/friends")}>
        <a>X</a>
      </button>
      <div className={styles["profile"]}>
        <img
          src={friend && friend.photo ? friend.photo : "https://i.imgur.com/hCwHtRc.png"}
          alt="Anthony Sudol"
          className={styles["profile-pic"]}
        />

        <h2>
          {friend && friend.name}
        </h2>

        <p>Friend</p>
      </div>
      <div className={styles["birthday"]}>
        <div className={styles["description"]}>
          <p>{dobObject && dobObject.day}</p>
          <p>{dobObject && dobObject.month}</p>

        </div>
        <div className={styles["border"]}>
          <p></p><p></p>
        </div>
        <div className={styles["description"]}>
          <p>{friend && daysUntilBirthday(friend.dob)}</p>
          <p>days left</p>

        </div>
        <div className={styles["border"]}>
          <p></p><p></p>
        </div>
        <div className={styles["description"]}>
          <p>Age </p>
          <p>{friend && calculateAge(friend.dob)}</p>
        </div>
      </div>
      <div className={styles["edit-container"]}>
        <button className={styles["edit-btn"]}>Edit</button>
      </div>
      <div className={styles["tab-container"]}>
        <span
          onClick={() => handleTabClick("profile")}
          className={activeTab === "profile" ? styles["active-tab"] : ""}
        >
          Profile
        </span>
        <span
          onClick={() => handleTabClick("explore")}
          className={activeTab === "explore" ? styles["active-tab"] : ""}
        >
          Explore Gifts
        </span>
      </div>
      {activeTab === "profile" && <>
        <Card className={styles["card"]}>
          <div className={styles["gift-preference"]}>
            <h3>Gift Type</h3>
            <div className={styles["gift-types"]}>
              <div className={styles["gift-type-btn"] + ' ' + (giftPreferences && giftPreferences.includes("Experience") ? styles["active"] : '')}>
                <div className={styles["gift-type-btn__image--experiences"]}></div>
                <div className={styles["gift-type-btn__text"]}>Experiences</div>
              </div>
              <div className={styles["gift-type-btn"] + ' ' + (giftPreferences && giftPreferences.includes("Present") ? styles["active"] : '')}>
                <div className={styles["gift-type-btn__image--presents"]}></div>
                <div className={styles["gift-type-btn__text"]}>Presents</div>
              </div>
              <div className={styles["gift-type-btn"] + ' ' + (giftPreferences && giftPreferences.includes("Donation") ? styles["active"] : '')}>
                <div className={styles["gift-type-btn__image--donations"]}></div>
                <div className={styles["gift-type-btn__text"]}>Donations</div>
              </div>
            </div>
          </div>
        </Card>
        <Card className={styles["card"]}>
          <div className={styles["gift-preference"]}>
            <h3>Selected Tags</h3>
            <div className={styles["tags"]}>
              <button>Reading</button>
              <button>Outdoor Activities +</button>
              <button>Arts and Crafts +</button>
              <button>Socializing +</button>
            </div>
          </div>
        </Card>
        <Card className={styles["card"]}>
          <div className={styles["gift-recommendations"]}>
            <h3>Favorite Gifts</h3>
          </div>
        </Card>
      </>}
      {
        activeTab === "explore" &&
        <>
          <h3>this is explore gifts</h3>
        </>
      }
    </div>
  );
};

export default ShowFriend;
