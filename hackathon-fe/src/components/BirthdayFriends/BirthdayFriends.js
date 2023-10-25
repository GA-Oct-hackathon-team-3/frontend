import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import * as friendsService from "../../utilities/friends-service";
import { daysUntilBirthday } from "../../utilities/helpers";

import styles from "./BirthdayFriends.module.css";

const BirthdayFriends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsData = await friendsService.retrieveFriends();
                setAllFriends(friendsData);
                setFilteredData(friendsData);
            } catch (error) {
                console.error('Error fetching friends: ', error);
            }
        }
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
                { daysUntilBirthday(dob) }
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

