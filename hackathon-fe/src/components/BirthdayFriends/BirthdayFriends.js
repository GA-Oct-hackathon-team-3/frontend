import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import * as friendsService from "../../utilities/friends-service";
import { daysUntilBirthday } from "../../utilities/helpers";

import styles from "./BirthdayFriends.module.css";
import { Button } from "@mui/material";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import WomanCelebratingImg from "../../assets/womanCelebrating.png";
import manCelebratingImg from "../../assets/manCelebrating.png";

import AnthonyImg from "../../assets/anthonyImg.png";
import MollyImg from "../../assets/mollyImg.png";

const BirthdayFriends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const navigate = useNavigate();

  const dummyfriends = [
    {
      img: { AnthonyImg },
      name: "Anthony Sudol",
      dob: "14 April 1996",
      days: "0",
    },
    {
      img: { MollyImg },
      name: "Molly Rosenthal",
      dob: "10 October 1987",
      days: "330",
    },
    {
      img: { AnthonyImg },
      name: "Anthony Sudol",
      dob: "14 April 1996",
      days: "0",
    },
    {
      img: { MollyImg },
      name: "Molly Rosenthal",
      dob: "10 October 1987",
      days: "330",
    },
    {
      img: { AnthonyImg },
      name: "Anthony Sudol",
      dob: "14 April 1996",
      days: "0",
    },
    {
      img: { MollyImg },
      name: "Molly Rosenthal",
      dob: "10 October 1987",
      days: "330",
    },
  ];

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await friendsService.retrieveFriends();
        setAllFriends(friendsData);
        setFilteredData(friendsData);
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

  const Item = ({ name, dob, id, img }) => {
    const history = useNavigate();

    return (
      <button
        onClick={() => navigate(`/friend/${id}`, { state: { id: id } })}
        className={styles["itemButton"]}
      >
        <div className={styles["item"]}>
          <div>



            <img src={img.AnthonyImg || img.MollyImg} alt={name} />
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
          {/* {filteredData.length > 0 ? (
            filteredData.map((item) => ( */}
          {dummyfriends.length > 0 ? (
            dummyfriends.map((item) => (
              <Item key={item._id} {...item} id={item._id} />
            ))
          ) : (
            <div>No friends</div>
          )}
        </div>

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
