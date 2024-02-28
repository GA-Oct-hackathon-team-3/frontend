import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';

import * as friendsService from '../utilities/friends-service';
import * as tagService from '../utilities/tags-service';

import Header from '../components/Header';

import singerImg from '../assets/icons/tag/singerTagImg.png';
import bikerImg from '../assets/icons/tag/bikerTagImg.png';
import gardenerImg from '../assets/icons/tag/gardenerTagImg.png';

import { BsArrowLeft } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

import styles from '../styles/TagAdder.module.css';

function TagAdder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState([]); //
  const [inputValue, setInputValue] = useState('');
  const [defaultTags, setDefaultTags] = useState([]); // stores default tags not in custom category
  const [suggestedTags, setSuggestedTags] = useState([]); // tags suggested by backend after 3 chars of input
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const friend = await friendsService.showFriend(id);
        setTags(friend.tags);
      } catch (error) {
        throw error;
      }
    };

    const fetchTags = async () => {
      try {
        const tagsData = await tagService.getTags();
        setDefaultTags(tagsData);
        setTimeout(() => {
          setIsLoading(false);
        }, 1200);
      } catch (error) {
        throw error;
      }
    };

    fetchFriend();
    fetchTags();
  }, [id]);

  const fetchSuggestions = async (value) => {
    if (value === '' || value.length < 3)
      return setSuggestedTags([]); // requires search term of 3 => characters
    else {
      try {
        const suggestions = await tagService.getSuggestions(value);
        setSuggestedTags(suggestions);
      } catch (error) {
        throw error;
      }
    }
  };

  const tagExists = (tags, newTag) => {
    // to check if tag exists, handles cases where tag is object or string
    return tags.some((tag) => {
      if (typeof tag === 'string') return tag === newTag;
      else if (typeof tag === 'object' && tag.title)
        return tag.title === newTag.title;
      else return false;
    });
  };

  const handleInputChange = async (e) => {
    setInputValue(e.target.value);
    // uses debounce to delay calls to backend (makes sure user has stopped typing)...
    const delayedFetch = debounce(
      () => fetchSuggestions(e.target.value.trim()),
      300
    );
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
    try {
      setIsSubmitting(true);

      toast.info('Updating tags...', {
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
    } catch (error) {
      toast.error('Failed to submit. Please try again');
    } finally {
      setTimeout(() => {
          setIsSubmitting(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header />
      <div className={styles['tag-container']}>
        {isLoading ? (
          <div style={{ margin: 'auto' }}>
            <CircularProgress color="secondary" />
          </div>
        ) : (
          <div className={styles['content-container']}>
            <div className={styles['back-button']}>
              <p onClick={() => navigate(-1)}>
                <BsArrowLeft />
              </p>
            </div>
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
                        {suggestion.title} +
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

            <button
              className={styles['complete-button']}
              onClick={submitHandler}
              disabled={isSubmitting}
            >
              Complete Profile
            </button>
            <ToastContainer className={styles['toast-container']} />
          </div>
        )}
      </div>
    </>
  );
}

export default TagAdder;
