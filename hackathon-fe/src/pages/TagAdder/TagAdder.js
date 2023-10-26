import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TagAdder.css";
import * as friendsService from "../../utilities/friends-service";
import * as tagService from "../../utilities/tags-service";

function TagAdder() {
  const [tags, setTags] = useState([]);
  const { id } = useParams();
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [allTags, setAllTags] = useState([]);
  const hasFunctionRun = useRef(false);
  const navigate = useNavigate();

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
        <h2>Edit Tags</h2>
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
          onKeyDown={(e) => {
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
      <button
        className="complete-button"
        onClick={() => {
          navigate(`/friend/${id}`);
        }}
      >
        Complete Profile
      </button>
    </div>
  );
}

export default TagAdder;
