import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchFriend = async () => {
      const friend = await friendsService.showFriend(id);
      console.log(friend);
      setFriend(friend);
      setDobObject(splitDOB(friend.dob));
    };
    fetchFriend();
  }, []);

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputEnter = () => {
    if (inputValue && !tags.includes(inputValue)) {
      tagService.addTag(id, { title: inputValue });
      setTags([...tags, inputValue]);
      setSelectedTags([...selectedTags, inputValue]);
      setInputValue("");
    }
  };

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
      </div>
      <button className="complete-button">Complete Profile</button>
    </div>
  );
}

export default TagAdder;
