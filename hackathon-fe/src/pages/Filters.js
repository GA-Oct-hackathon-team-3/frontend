import { useEffect, useState } from "react";
import styles from "../styles/Filters.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Slider from "@mui/material/Slider";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { BsArrowLeft } from "react-icons/bs";

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
  const navigate = useNavigate();
  const location = useLocation();

  const friend = location.state?.friend;

  const [show, setShow] = useState(null);
  const [budget, setBudget] = useState(100);
  const [giftPreferences, setGiftPreferences] = useState(friend.giftPreferences);
  const [tags, setTags] = useState(friend.tags);


  useEffect(() => {
    setGiftPreferences(friend.giftPreferences);
  }, []);

  const handleClick = (string) => {
    if (show === string) {
      setShow(null);
      return;
    }
    setShow(string);
  };

  function valuetext(value) {
    return `$${value}`;
  }

  const valueLabelFormat = value => {
    return `$ ${value}`;
  }

  const handlePrefClick = (e) => {
    const idx = giftPreferences.findIndex(el => el.toLowerCase() === e.toLowerCase());
    if (idx > -1) {
      setGiftPreferences(giftPreferences.slice(0, idx).concat(giftPreferences.slice(idx + 1)));
    } else {
      setGiftPreferences([...giftPreferences, e]);
    }
  }

  const handleTagClick = e => {
    const idx = tags.findIndex(el => el.title === e);
    if (idx > -1) {
      setTags(tags.slice(0, idx).concat(tags.slice(idx + 1)));
    } else {
      setTags([...tags, { title: e }]);
    }
  }

  const clearFilters = () => {
    setTags(friend.tags);
    setGiftPreferences(friend.giftPreferences);
  }

  const onSave = () => {
    const queryParams = new URLSearchParams({
      budget: budget,
      tags: tags.map(tag => tag.title).join(','), // Assuming tags is an array
      giftTypes: giftPreferences.join(',') // Assuming giftPreferences is an array
    });
    navigate(`/friend/${friend._id}?${queryParams}`, { state: { tab: 'explore' } }); // adds tab state to auto switch to explore
  }

  const onBack = () =>{
    clearFilters();
    navigate(`/friend/${friend._id}`);
  }


  return (
    <>
      <Header />
      <div className={styles["mainContainer"]}>
        <div className={styles["container"]}>
              <div className={styles["heading-container"]}>
                  <p style={{fontSize:"1.5rem"}} onClick={onBack}>
                    <BsArrowLeft />
                  </p>
                  <h1>Filters</h1>
              </div>
          <div className={styles["row-container"]}>
            <div className={styles.row}>
              <h2>Budget</h2>
              <FontAwesomeIcon
                onClick={() => handleClick("budget")}
                icon={show === "budget" ? faMinus : faPlus}
                size="2x"
                style={{ cursor: "pointer" }}
              />
            </div>
            {show === "budget" && (
              <div className={styles["slider-container"]}>
                <p>${budget && budget}</p>
                <Slider
                  aria-label="Small steps"
                  defaultValue={budget}
                  getAriaValueText={valuetext}
                  step={10}
                  onChange={(_, e) => setBudget(e)}
                  value={budget}
                  marks={marks}
                  min={0}
                  max={1000}
                  valueLabelDisplay="auto"
                  className={styles["slider"]}
                  valueLabelFormat={valueLabelFormat}
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
                style={{ cursor: "pointer" }}
              />
            </div>
            {show === "tags" && (
              <div className={styles["tags"]}>
                {!!friend.tags.length && friend.tags.map((tag, idx) =>
                  <button
                    key={idx}
                    className={styles["tag-button"] + ' ' + (tags.findIndex(t => t.title === tag.title) > -1 ? styles['active'] : '')}
                    onClick={() => handleTagClick(tag.title)}>
                    {tag.title}
                  </button>
                )}


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
                style={{ cursor: "pointer" }}
              />
            </div>
            {show === "gifttype" && (
              <div className={styles["tags"]}>
                <button
                  value="experience"
                  onClick={() => handlePrefClick('experience')}
                  className={styles["tag-button"] + ' ' + (giftPreferences.findIndex(pref => pref.toLowerCase() === "experience") > -1 ? styles["active"] : '')}>
                  Experience
                </button>
                <button
                  value="present"
                  onClick={() => handlePrefClick('present')}
                  className={styles["tag-button"] + ' ' + (giftPreferences.findIndex(pref => pref.toLowerCase() === "present") > -1 ? styles["active"] : '')}>
                  Present
                </button>
                <button
                  value="donation"
                  onClick={() => handlePrefClick('donation')}
                  className={styles["tag-button"] + ' ' + (giftPreferences.findIndex(pref => pref.toLowerCase() === "donation") > -1 ? styles["active"] : '')}>
                  Donation
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={styles["btn-container"]}>
          <button className={styles["clear-btn"]} onClick={clearFilters}>Clear</button>
          <button className={styles["save-btn"]} onClick={onSave}>Save</button>
        </div>
      </div>
    </>
  );
};

export default Filters;