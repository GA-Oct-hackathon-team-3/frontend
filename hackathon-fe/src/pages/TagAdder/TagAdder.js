import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as friendsService from "../../utilities/friends-service";
import * as tagService from "../../utilities/tags-service";

import singerImg from "../../assets/addTagsIcons/singerTagImg.png";
import bikerImg from "../../assets/addTagsIcons/bikerTagImg.png";
import gardenerImg from "../../assets/addTagsIcons/gardenerTagImg.png";

import styles from "../../styles/TagAdder.module.css";
import Header from "../../components/Header/Header";

function TagAdder() {
  const [tags, setTags] = useState([]);
  const { id } = useParams();
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [pathname, setPathname] = useState("");
  const hasFunctionRun = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchFriend = async () => {
      const friend = await friendsService.showFriend(id);
      setSelectedTags(friend.tags);
    };
    const fetchTags = async () => {
      const tagsData = await tagService.getTags();
      setAllTags(tagsData);
    };

    if (!hasFunctionRun.current) {
      fetchTags();
      hasFunctionRun.current = true;
    }
    fetchFriend();
  }, [tags]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputEnter = async () => {
    if (inputValue && !tags.includes(inputValue)) {
      await tagService.addTag(id, { title: inputValue });
      setTags([...tags, inputValue]);
      setSelectedTags([...selectedTags, inputValue]);
      setInputValue("");
    }
  };

  const submitHandler = () => {
    toast.info("Updating tags..", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });

    const pathData = {path: location.pathname}

    setTimeout(() => {
      navigate(`/friend/${id}`, {state: pathData});
    }, 2000)
  };

  const groupedData = allTags.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className={styles["tag-container"]}>
        <div className={styles["header"]}>
          <h1>Confirm Tags</h1>
          <p>
            What's your friend into? Adding tags helps Presently give more
            accurate gift suggestions.
          </p>
        </div>

        <div className={styles.hobbies}>
          <img src={singerImg} alt="Singing hobby" />
          <img src={bikerImg} alt="Biking hobby" />
          <img src={gardenerImg} alt="Gardening hobby" />
        </div>

        <input
          className={styles["tag-input"]}
          type="text"
          placeholder="Type to create custom tag"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInputEnter();
          }}
        />

        <div className={styles["add-tags-container"]}>
          <h3>Added Tags</h3>
          {selectedTags.map((tag) => (
            <button
              className={`${styles["tag-button"]} ${styles.selected}`}
              onClick={async () => {
                await tagService.removeTag(id, tag._id);
                setTags(tags.filter((tag) => tag.title !== tag.title));
              }}
              key={tag._id}
            >
              {tag.title}
            </button>
          ))}
        </div>

        <div>
          {Object.entries(groupedData)
            .filter(([type, tags]) => type !== "custom")
            .map(([type, tags]) => (
              <div key={type}>
                <h3>{type[0].toUpperCase() + type.slice(1)}</h3>
                {tags.map((tag) => (
                  <button
                    className={styles["tag-button"]}
                    onClick={async () => {
                      await tagService.addTag(id, tag);
                      setTags([...tags, tag.title]);
                    }}
                    key={tag.name}
                  >
                    {tag.title} +
                  </button>
                ))}
              </div>
            ))}
        </div>

        <button
          className={styles["complete-button"]}
          onClick={submitHandler}
        >
          Complete Profile
        </button>
      </div>
      <ToastContainer className={styles["toast-container"]} />
    </>
  );
}

export default TagAdder;
