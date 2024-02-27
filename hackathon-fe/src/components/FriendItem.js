import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import Confetti from "react-confetti";
import styles from "../styles/BirthdayFriends.module.css";
import { formatDate, presentlyCardColors, buildGiftLink } from '../utilities/helpers';

const FriendItem = ({ friend, name, dob, id, photo, daysUntilBirthday, cardColor, favoriteGifts }) => {
    const navigate = useNavigate();
    const [isViewSavedGifts, setIsViewedSavedGifts] = useState(false);
    const canvasRef = useRef(null);

    const viewSavedGiftsHandler = (e) => {
      e.stopPropagation();
      setIsViewedSavedGifts((preVal) => !preVal);
    };

    return (
      <button
        onClick={() => navigate(`/friend/${id}`)}
        className={styles["item-button"]}
      >
        <div className={styles["item"]}>
            <div className={styles['confetti']}>
          {daysUntilBirthday === 0 && (
            <Confetti
              height="90"
              width="300"
              numberOfPieces="65"
              colors={presentlyCardColors}
              ref={canvasRef}
            />
          )}
            </div>

          <div className={styles["item-card"]}>
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
            <div className={styles["item-card-info"]}>
              <p>{name}</p>
              <p>{formatDate(dob)}</p>
            </div>

            <div className={styles["item-card-days"]}>
              <p className={styles["days"]} style={{ color: cardColor }}>
                {daysUntilBirthday}
              </p>
              <p className={styles["label"]}>Days Left</p>
            </div>
          </div>
        </div>
        <div className={styles["gift-dropdown"]}
          style={{
            backgroundColor: cardColor,
            borderBottomLeftRadius: isViewSavedGifts && "0",
            borderBottomRightRadius: isViewSavedGifts && "0",
          }}
          onClick={viewSavedGiftsHandler}
        >
            <span>
          View Saved Gifts{" "}
            </span>
          <sub className={styles["dropdown-button"]}>
            {!isViewSavedGifts ? (
              <RiArrowDropDownLine />
            ) : (
              <RiArrowDropUpLine />
            )}
          </sub>
        </div>
        <div className={`${styles["saved-gifts"]} ${isViewSavedGifts && styles["open"]}`}>
          {isViewSavedGifts && favoriteGifts && favoriteGifts.map((fav, idx) => {
              return (
                <Link
                  to={buildGiftLink(fav, friend.location)}
                  target="_blank"
                  key={idx}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={fav.image} alt={fav.title} />
                  <p>{fav.title}</p>
                </Link>
              );
            })}
          {isViewSavedGifts && favoriteGifts.length === 0 && (
            <p>No favorite gifts at this time.</p>
          )}
        </div>
      </button>
    );
  };

  export default FriendItem;