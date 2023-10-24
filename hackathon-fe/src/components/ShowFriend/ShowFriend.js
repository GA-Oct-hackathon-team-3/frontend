import React from "react";
import { useParams } from "react-router-dom";
import styles from "./ShowFriend.module.css";

export const DATA = [
  { id: "1", first_name: "John Can", last_name: "Doe", birthday: "1990-05-15" },
  { id: "2", first_name: "Jane", last_name: "Smith", birthday: "1987-03-28" },
  {
    id: "3",
    first_name: "Alice",
    last_name: "Johnson",
    birthday: "1992-10-12",
  },
  { id: "4", first_name: "Bob", last_name: "Brown", birthday: "1985-06-22" },
  {
    id: "5",
    first_name: "Charlie",
    last_name: "Davis",
    birthday: "1995-02-02",
  },
];

const ShowFriend = ({ friend }) => {
  const { id } = useParams();

  const user = DATA.find((user) => user.id === id);

  console.log(user, "this is the user");

  return (
    <div className={styles["container"]}>
      <div className={styles["profile"]}>
        <img
          src="https://i.imgur.com/hCwHtRc.png"
          alt="Anthony Sudol"
          className={styles["profile-pic"]}
        />
        <h2>
          {user.first_name} {user.last_name}
        </h2>
        <p>Friend</p>
      </div>
      <div className={styles["birthday"]}>
        <div className={styles["description"]}>
          <p>3</p>
          <p>Jun</p>
        </div>
        <div className={styles["description"]}>
          <p>180 </p>
          <p>Days left</p>
        </div>
        <div className={styles["description"]}>
          <p>Age </p>
          <p>25</p>
        </div>
      </div>
      <button className={styles["edit-btn"]}>Edit</button>
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
