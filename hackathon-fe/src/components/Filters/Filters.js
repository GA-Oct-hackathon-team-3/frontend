import React, { useState } from "react";
import styles from "./Filters.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 0,
    label: "$0",
  },
  {
    value: 250,
    label: "$250",
  },
  {
    value: 500,
    label: "$500",
  },
  {
    value: 750,
    label: "$750",
  },
  {
    value: 1000,
    label: "$1000",
  },
];

const Filters = () => {
  const [show, setShow] = useState(null);

  const handleClick = (string) => {
    if (show === string) {
      setShow(null);
      return;
    }
    setShow(string);
  };

  function valuetext(value) {
    console.log(value);
    return `${value}°C`;
  }

  return (
    <div className={styles["mainContainer"]}>
      <div className={styles["container"]}>
        <div className={styles["row-container"]}>
          <div className={styles.row}>
            <h2>Budget</h2>
            <FontAwesomeIcon
              onClick={() => handleClick("budget")}
              icon={show === "budget" ? faMinus : faPlus}
              size="2x"
            />
          </div>
          {show === "budget" && (
            <div className={styles["slider-container"]}>
              <Slider
                aria-label="Small steps"
                defaultValue={20}
                getAriaValueText={valuetext}
                step={1}
                marks={marks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                className={styles["slider"]}
              />
            </div>
          )}
        </div>
        <div className={styles["row-container"]}>
          <div className={styles.row}>
            <h2>Tags</h2>
            <FontAwesomeIcon
              onClick={() => handleClick("tags")}
              icon={show === "tags" ? faMinus : faPlus}
              size="2x"
            />
          </div>
          {show === "tags" && (
            <div className={styles["tags"]}>
              <button className={styles["tag-button"]}>Reading</button>
              <button className={styles["tag-button"]}>
                Outdoor Activities
              </button>
              <button className={styles["tag-button"]}>Arts and Crafts</button>
              <button className={styles["tag-button"]}>Socializing</button>
            </div>
          )}
        </div>
        <div className={styles["row-container"]}>
          <div className={styles.row}>
            <h2>Gift Type</h2>
            <FontAwesomeIcon
              onClick={() => handleClick("gifttype")}
              icon={show === "gifttype" ? faMinus : faPlus}
              size="2x"
            />
          </div>
          {show === "gifttype" && (
            <div className={styles["tags"]}>
              <button className={styles["tag-button"]}>Experience</button>
              <button className={styles["tag-button"]}>Present</button>
              <button className={styles["tag-button"]}>Donation</button>
            </div>
          )}
        </div>
      </div>
      <div className={styles["btn-container"]}>
        <button className={styles["clear-btn"]}>Clear</button>
        <button className={styles["save-btn"]}>Save</button>
      </div>
    </div>
  );
};

export default Filters;
