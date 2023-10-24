import dummydata from "../../dummydata";
import ShowFriend from "../ShowFriend/ShowFriend";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";

import styles from "./BirthdayFriends.module.css";

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

const BirthdayFriends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(DATA);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      console.log(query, "THIS IS THE QUERY");
      setFilteredData(
        DATA.filter((item) =>
          item.first_name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredData(DATA);
    }
  };

  function daysUntilBirthday(bday) {
    console.log(bday, "this is the bday");
    const array = bday.split("-");
    const birthday = new Date(array[0], array[1], array[2]);
    const currentDate = new Date(); // e.g., today's date
    // Extract month and day from the birthday date
    const month = birthday.getMonth();
    const day = birthday.getDate();

    // Set the current year's birthday
    let nextBirthday = new Date(currentDate.getFullYear(), month, day);

    // If the birthday has already occurred this year, set the next year's date
    if (currentDate > nextBirthday) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const differenceInMilliseconds = nextBirthday - currentDate;

    // Convert milliseconds to days
    const days = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    return days;
  }

  const Item = ({ first_name, last_name, birthday, id }) => {
    const history = useNavigate();

    return (
      <button
        onClick={() =>
          navigate(`/friend/${Number(id)}`, { state: { id: Number(id) } })
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
                  {first_name} {last_name}
                </span>
                <span className={styles["birthday"]}>{birthday}</span>
              </div>
            </div>
          </div>
          <div className={styles["card"]}>
            <div className={styles["content"]}>
              <span className={styles["label"]}>Days Left</span>
              <span className={styles["days"]}>
                {daysUntilBirthday(birthday)}
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
        {filteredData.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default BirthdayFriends;
