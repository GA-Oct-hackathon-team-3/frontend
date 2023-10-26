import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TagAdder.css";
import * as friendsService from "../../utilities/friends-service";
import * as tagService from "../../utilities/tags-service";

import {
  daysUntilBirthday,
  splitDOB,
  calculateAge
} from "../../utilities/helpers";

function TagAdder() {
  const [tags, setTags] = useState([
    "Movie Buff",
    "Minimal",
    "Quirky",
    "Grunge",
    "Reading",
    "Outdoor Activities",
    "Arts and Crafts",
    "Socializing"
  ]);
  const { id } = useParams();
  const [friend, setFriend] = useState(null);
  const [dobObject, setDobObject] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [allTags, setAllTags] = useState([]);
  const hasFunctionRun = useRef(false);

  useEffect(() => {
    const fetchFriend = async () => {
      const friend = await friendsService.showFriend(id);
      console.log("useEffect triggered, friend data:", friend);
      setFriend(friend);
      setSelectedTags(friend.tags);
      setDobObject(splitDOB(friend.dob));
    };
    const fetchTags = async () => {
      const tagsData = await tagService.getTags();
      console.log("all tags: ", tagsData);
      setAllTags(tagsData);
    };

    if (!hasFunctionRun.current) {
      fetchTags();
      console.log("fetching tags");
      hasFunctionRun.current = true;
    }
    fetchFriend();
  }, [tags]);

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

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

  const groupedData = allTags.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {});

  return (
    <div className="tag-container">
      <div className="header">
        <h1>PRESENTly</h1>
        <h2>Add Tags</h2>
        <p>
          What's your friend into? Adding tags helps Presently give more
          accurate gift suggestions.
        </p>
      </div>
      <div className="tag-input-section">
        <input
          type="text"
          placeholder="Type to create custom tag"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleInputEnter();
          }}
        />
      </div>
      <div className="tag-section">
        <h3>Added Tags</h3>
        {selectedTags.map((tag) => (
          <button
            className={"tag-button"}
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
              <h3>{type}</h3>
              {tags.map((tag) => (
                <button
                  className={"tag-button"}
                  onClick={async () => {
                    await tagService.addTag(id, tag);
                    setTags([...tags, tag.title]);
                  }}
                  key={tag.name}
                >
                  {tag.title}
                </button>
              ))}
            </div>
          ))}
      </div>

      {/* <div className="tag-section">
        <h3>Popular Tags</h3>
        {tags.slice(0, 3).map((tag) => (
          <button
            className={`tag-button ${
              selectedTags.includes(tag) ? "selected" : ""
            }`}
            onClick={() => handleTagClick(tag)}
            key={tag}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="tag-section">
        <h3>Aesthetic</h3>
        {tags.slice(3, 6).map((tag) => (
          <button
            className={`tag-button ${
              selectedTags.includes(tag) ? "selected" : ""
            }`}
            onClick={() => handleTagClick(tag)}
            key={tag}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="tag-section">
        <h3>Hobbies</h3>
        {tags.slice(6, 8).map((tag) => (
          <button
            className={`tag-button ${
              selectedTags.includes(tag) ? "selected" : ""
            }`}
            onClick={() => handleTagClick(tag)}
            key={tag}
          >
            {tag}
          </button>
        ))}
      </div> */}
      <button
        className="complete-button"
        onClick={async () => {
          console.log("complete button clicked");
        }}
      >
        Complete Profile
      </button>
    </div>
  );
}

export default TagAdder;