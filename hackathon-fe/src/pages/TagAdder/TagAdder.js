import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { debounce } from 'lodash';

import * as friendsService from '../../utilities/friends-service';
import * as tagService from '../../utilities/tags-service';

import singerImg from '../../assets/addTagsIcons/singerTagImg.png';
import bikerImg from '../../assets/addTagsIcons/bikerTagImg.png';
import gardenerImg from '../../assets/addTagsIcons/gardenerTagImg.png';

import styles from '../../styles/TagAdder.module.css';
import Header from '../../components/Header/Header';

function TagAdder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [defaultTags, setDefaultTags] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);

  useEffect(() => {
    const fetchFriend = async () => {
      const friend = await friendsService.showFriend(id);
      setSelectedTags(friend.tags);
    };
    const fetchTags = async () => {
      const tagsData = await tagService.getTags();
      setDefaultTags(tagsData);
    };

    fetchFriend();
    fetchTags();
  }, [id, tags]);

  const fetchSuggestions = async (value) => {
    if (value === '' || value.length < 3) return setSuggestedTags([]); // requires search term of 3 => characters
    else {
      const suggestions = await tagService.getSuggestions(value);
      setSuggestedTags(suggestions);
    }
  };

  const handleInputChange = async (e) => {
    setInputValue(e.target.value);
    const delayedFetch = debounce(
      () => fetchSuggestions(e.target.value.trim()),
      300
    ); // uses debounce to delay calls to backend (makes sure user has stopped typing)...
    delayedFetch(); // then makes call to backend
  };

  const handleInputEnter = async () => {
    if (inputValue && !tags.includes(inputValue)) {
      await tagService.addTag(id, { title: inputValue });
      setTags((prevTags) => [...prevTags, inputValue]);
      setSelectedTags((prevSelectedTags) => [...prevSelectedTags, inputValue]);
      setInputValue('');
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    await tagService.addTag(id, suggestion);
    setTags((prevTags) => [...prevTags, suggestion.title]);
    setInputValue('');
    setSuggestedTags([]);
  };

  const submitHandler = () => {
    toast.info('Updating tags..', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });

    const pathData = { path: location.pathname };

    setTimeout(() => {
      navigate(`/friend/${id}`, { state: pathData });
    }, 2000);
  };

  return (
    <>
      <Header />
      <div className={styles['tag-container']}>
        <div className={styles['header']}>
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
          className={styles['tag-input']}
          type="text"
          placeholder="Type to create custom tag"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleInputEnter();
          }}
        />

        <div className={styles['suggestions-container']}>
          <h3>Suggested Tags</h3>
          {suggestedTags.length > 0
            ? suggestedTags.map((suggestion) => (
                <button
                  className={styles['tag-button']}
                  onClick={() => handleSuggestionClick(suggestion)}
                  key={suggestion._id}
                >
                  {suggestion.title}
                </button>
              ))
            : 'No suggestions'}
        </div>

        <div className={styles['add-tags-container']}>
          <h3>Added Tags</h3>
          {selectedTags.map((tag) => (
            <button
              className={`${styles['tag-button']} ${styles.selected}`}
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
          {defaultTags.map((group, key) => (
            <div key={group.section}>
              <h3>{group.section[0].toUpperCase() + group.section.slice(1)}</h3>
              {group.tags.map((tag) => (
                <button
                  className={styles['tag-button']}
                  onClick={async () => {
                    await tagService.addTag(id, tag);
                    setTags([...tags, tag.title]);
                  }}
                  key={tag._id}
                >
                  {tag.title} +
                </button>
              ))}
            </div>
          ))}
        </div>

        <button className={styles['complete-button']} onClick={submitHandler}>
          Complete Profile
        </button>
      </div>
      <ToastContainer className={styles['toast-container']} />
    </>
  );
}

export default TagAdder;
