import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import * as friendsService from "../../utilities/friends-service";

import styles from "./BirthdayFriends.module.css";

const BirthdayFriends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friends = await friendsService.retrieveFriends();
                setFilteredData(friends);
            } catch (error) {
                console.error('Error fetching friends: ', error);
            }
        }
        fetchFriends();
    }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      console.log(query, "THIS IS THE QUERY");
      setFilteredData(
        filteredData.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredData(filteredData);
    }
  };

  function daysUntilBirthday(dob) {
    const birthday = new Date(dob);
    const currentDate = new Date();

    const nextBirthday = new Date(currentDate.getFullYear(), birthday.getMonth(), birthday.getDate());

    // If the next birthday is before the current date, set it to next year
    if (nextBirthday < currentDate) {
    nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }

    // Calculate the time difference in milliseconds
    const timeDifference = nextBirthday - currentDate;

    // Convert milliseconds to days
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return days;
  }

  const Item = ({ name, dob, id }) => {
    const history = useNavigate();

    return (
      <button
        onClick={() =>
          navigate(`/friend/${id}`, { state: { id: id } })
        }
        className={styles["itemButton"]}
      >
        <div className={styles["item"]}>
          <div className={styles["itemTextContainer"]}>
            <div className={styles["row"]}>
              {/* FontAwesome might have a different implementation for web, adjust accordingly */}
              <FontAwesomeIcon icon={faBirthdayCake} size="6x" />
              <div className={styles["column"]}>
                <span className={styles["name"]}>
                  {name}
                </span>
                <span className={styles["birthday"]}>{dob}</span>
              </div>
            </div>
          </div>
          <div className={styles["card"]}>
            <div className={styles["content"]}>
              <span className={styles["label"]}>Days Left</span>
              <span className={styles["days"]}>
                {daysUntilBirthday(dob)}
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className={styles["container"]}>
      <input
        className={styles["searchBar"]}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      <div>
        <span className={styles["upcomingLabel"]}>Upcoming</span>
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
    </div>
  );
};

export default BirthdayFriends;

