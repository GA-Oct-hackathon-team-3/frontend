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
  const [inputValue, setInputValue] = useState('');
  const [defaultTags, setDefaultTags] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);

  useEffect(() => {
    const fetchFriend = async () => {
      const friend = await friendsService.showFriend(id);
      setTags(friend.tags);
    };
    const fetchTags = async () => {
      const tagsData = await tagService.getTags();
      setDefaultTags(tagsData);
    };

    fetchFriend();
    fetchTags();
  }, [id]);

  const fetchSuggestions = async (value) => {
    if (value === '' || value.length < 3)
      return setSuggestedTags([]); // requires search term of 3 => characters
    else {
      const suggestions = await tagService.getSuggestions(value);
      setSuggestedTags(suggestions);
    }
  };

  const tagExists = (tags, newTag) => {
    // to check if tag exists, handles cases where tag is object or string
    return tags.some((tag) => {
      if (typeof tag === 'string') return tag === newTag;
      else if (typeof tag === 'object' && tag.title)
        return tag.title === newTag.title;
      return false;
    });
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
    if (inputValue && !tagExists(tags, inputValue)) {
      setTags((prevTags) => [...prevTags, inputValue]); // adds string tag
      setInputValue('');
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    if (!tagExists(tags, suggestion)) {
      setTags((prevTags) => [...prevTags, suggestion]); // adds tag object
      setInputValue('');
      setSuggestedTags([]);
    }
  };

  const handleAddDefaultTag = (tag) => {
    if (!tagExists(tags, tag)) setTags((prevTags) => [...prevTags, tag]); // adds tag object
  };

  const handleRemoveTag = (tag) => {
    setTags((prevTags) =>
      prevTags.filter((prevTag) => !tagExists([prevTag], tag))
    );
  };

  const submitHandler = async () => {
    toast.info('Updating tags..', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1000,
    });

    const pathData = { path: location.pathname };

    const response = await tagService.updateTags(id, tags);
    if (response.message === 'Tags updated successfully') {
      setTimeout(() => {
        navigate(`/friend/${id}`, { state: pathData });
      }, 2000);
    }
  };

  return (
    <>
      <Header />
      <div className={styles['tag-container']}>
        <div className={styles['content-container']}>
          <div className={styles['header']}>
            <h1>Confirm Tags</h1>
            <p>
              What's your friend into? Adding tags helps Presently give more
              accurate gift suggestions.
            </p>
          </div>

          <div className={styles['hobbies']}>
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

          <div className={styles['existing-tags']}>
            <h3>Suggested Tags</h3>
            <div className={styles['tag-section']}>
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
                : ''}
            </div>

            <h3>Added Tags</h3>
            <div className={styles['tag-section']}>
              {tags.map((tag) => (
                <button
                  className={`${styles['tag-button']} ${styles.selected}`}
                  onClick={() => {
                    handleRemoveTag(tag);
                  }}
                  key={typeof tag === 'object' ? tag.title : tag}
                >
                  {typeof tag === 'object' ? tag.title : tag}
                </button>
              ))}
            </div>

            {defaultTags.map((group, key) => (
              <div key={group.section}>
                <h3>{group.section}</h3>
                <div className={styles['tag-section']}>
                  {group.tags.map((tag) => (
                    <button
                      className={styles['tag-button']}
                      onClick={() => handleAddDefaultTag(tag)}
                      key={tag._id}
                    >
                      {tag.title} +
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className={styles['complete-button']} onClick={submitHandler}>
            Complete Profile
          </button>
        </div>
      </div>
      <ToastContainer className={styles['toast-container']} />
    </>
  );
}

export default TagAdder;
