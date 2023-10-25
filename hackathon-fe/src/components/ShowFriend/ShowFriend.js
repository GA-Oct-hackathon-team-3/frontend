import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ShowFriend.module.css";
import * as friendsService from "../../utilities/friends-service";
import { daysUntilBirthday, splitDOB, calculateAge } from "../../utilities/helpers";

const ShowFriend = () => {

    const [ friend, setFriend ] = useState(null);
    const [ dobObject, setDobObject ] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchFriend = async () => {
        const friend = await friendsService.showFriend(id);
        setFriend(friend);
        setDobObject(splitDOB(friend.dob));
  }
  fetchFriend();
},[])

  return (
    <div className={styles["container"]}>
      <div className={styles["profile"]}>
        <img
          src="https://i.imgur.com/hCwHtRc.png"
          alt="Anthony Sudol"
          className={styles["profile-pic"]}
        />
        <h2>
            { friend && friend.name }
        </h2>
        <p>Friend</p>
      </div>
      <div className={styles["birthday"]}>
        <div className={styles["description"]}>
            <p>{ dobObject && dobObject.day }</p>
            <p>{ dobObject && dobObject.month }</p>
        </div>
        <div className={styles["description"]}>
            <p>{ friend && daysUntilBirthday(friend.dob) }</p>
            <p>days left</p>
        </div>
        <div className={styles["description"]}>
          <p>Age </p>
          <p>{ friend && calculateAge(friend.dob) }</p>
        </div>
      </div>
      <div className={styles["edit-container"]}>
        <button className={styles["edit-btn"]}>Edit</button>
      </div>
      <div className={styles["gift-preference"]}>
        <h3>Gift Preference</h3>
      </div>
      <div className={styles["gif-preference"]}>
        <h3>Tags</h3>
        <div className={styles["tags"]}>
          <button>Reading</button>
          <button>Outdoor Activities +</button>
          <button>Arts and Crafts +</button>
          <button>Socializing +</button>
        </div>
      </div>
      <div className={styles["gift-recommendations"]}>
        <h3>Gift Recommendations</h3>
      </div>
    </div>
  );
};

export default ShowFriend;
