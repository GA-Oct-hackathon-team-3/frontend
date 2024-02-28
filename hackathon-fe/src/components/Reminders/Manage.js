import { useState, useEffect } from 'react';

import {
  getProfile,
  updateUserProfile,
} from '../../utilities/profiles-service';
import {
  retrieveFriends,
  updateFriendNotification,
} from '../../utilities/friends-service';
import { formatDate } from '../../utilities/helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@mui/material';

import styles from '../../styles/Reminders.module.css';

const Manage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]); // use to reset filter
  const [filteredFriends, setFilteredFriends] = useState([]); // use to render
  const [updatedFriends, setUpdatedFriends] = useState({}); // accumulates changes to includeInNotifications per friend, using _id: boolean
  const [query, setQuery] = useState(''); // search query to filter friends in friend preferences
  const [frequency, setFrequency] = useState([]); // notificationSchedule preferences

  const fetchUserProfile = async () => {
    try {
      const profileInfo = await getProfile(); // fetch profile
      if (profileInfo && profileInfo.profile) {
        setFrequency(profileInfo.profile.notificationSchedule); // initialize user's current preferences
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchFriends = async () => {
    try {
      const friendsData = await retrieveFriends(); // fetch friends
      if (friendsData) {
        // friends comes in { today: [], thisWeek: [], thisMonth: [], laterOn: [] } structure
        // use concat to flatten into single array
        const flattenedFriendArray = friendsData.today.concat(
          friendsData.thisWeek,
          friendsData.thisMonth,
          friendsData.laterOn
        );
        setFriends(flattenedFriendArray); // maintains all friends (to revert changes from query)
        setFilteredFriends(flattenedFriendArray); // displays data (is updated with query)
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchFriends();

    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  const handleSearch = (query) => {
    setQuery(query);

    if (query) {
      // if query, filter and return filtered results
      setFilteredFriends(
        friends.filter((friend) =>
          friend.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else setFilteredFriends(friends); // else revert to original
  };

  const handleCheckbox = (days) => {
    // updates notification schedule
    setFrequency((prev) =>
      prev.includes(days)
        ? prev.filter((prevDays) => prevDays !== days)
        : [...prev, days]
    );
    // call submit right after to reduce number of forms on page
    handleFrequencySubmit();
  };

  const handleSelectFriend = (id, includeInNotifications) => {
    // if if is a key in object, set to opposite value, otherwise set to !includeNotifications
    const updatedNotificationValue = updatedFriends.hasOwnProperty(id)
      ? !updatedFriends[id]
      : !includeInNotifications;

    // maintains object of key with ids of friends were who updated, and the boolean value to which includeInNotifications should be updated to
    // ids for submission to backend, value to update render
    setUpdatedFriends((prev) => {
      if (updatedNotificationValue === includeInNotifications) {
        // if the value to update is equal to original value (i.e if toggled twice)...
        const { [id]: omit, ...rest } = prev; // remove id key from state to prevent submission of id to backend
        return rest;
      }

      return {
        ...prev,
        [id]: updatedNotificationValue,
      };
    });
  };

  const handleFrequencySubmit = async () => {
    if (frequency && frequency.length > 0) {
      const userData = {
        notificationSchedule: [...frequency],
      };
      try {
        const response = await updateUserProfile(userData);
        if (response && response.message === 'User profile updated') {
          setIsLoading(true); // set loading to true to simulate loading
          setTimeout(() => {
            // time out to set to false and render page
            setIsLoading(false);
          }, 600);
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handleEnableDisableAll = async (evt, action) => {
    evt.preventDefault();
    // accumulates ids of friends with current value of OFF
    const friendIds = friends.reduce((ids, friend) => {
      let checkValue;
      // if action is enable, needs to only accumulate ids for which includeInNotifications is false
      if (action === 'enable') checkValue = false;
      // else if the action is disable, and need to accumulate ids for which includeInNotifations is true
      else if (action === 'disable') checkValue = true;

      // compare value and push ids
      if (friend.includeInNotifications === checkValue) ids.push(friend._id);
      return ids;
    }, []);

    // if no changes, return
    if (friendIds.length === 0) return;

    try {
      // sends ids to backend to toggle
      const response = await updateFriendNotification(friendIds);
      if (
        response &&
        response.message ===
          'Updated friend notification preference successfully'
      ) {
        setUpdatedFriends({}); // resets state
        fetchFriends(); // re-fetches friends to retrieve updated friend data
      }
    } catch (error) {
      throw error;
    }
  };

  const handleFriendSubmit = async (evt) => {
    evt.preventDefault();
    // updatedFriends structure = [ { friend_id: new includeInNotifications value }, { friend_id: new includeInNotifications value } ]
    const friendIds = Object.keys(updatedFriends); // use Object.keys to extract ids of friends whose values were changed

    try {
      // send to backend to toggle
      const response = await updateFriendNotification(friendIds);
      if (
        response &&
        response.message ===
          'Updated friend notification preference successfully'
      ) {
        setUpdatedFriends({}); // resets state
        fetchFriends(); // re-fetches friends to retrieve updated friend data
        setIsLoading(true); // set loading to true as data is retrieved
      }
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        // time out to set to false and render page
        setIsLoading(false);
      }, 1200);
    }
  };

  // reusable render of checkbox for freqnecy preferences section
  const renderFrequencyCheckbox = (value, label) => (
    <div className={styles['form-group']}>
      <input
        type="checkbox"
        name={label}
        id={label}
        checked={frequency.includes(value)}
        onChange={() => handleCheckbox(value)}
      />
      <label
        htmlFor={label}
        className={
          frequency.includes(value)
            ? styles['custom-checkbox-checked']
            : styles['custom-checkbox']
        }
      >
        {frequency.includes(value) ? '\u2714' : ''}
      </label>
      <label htmlFor={label}>{label}</label>
    </div>
  );

  return (
    <div className={styles['tab-section']}>
      {isLoading ? (
        <div style={{ margin: 'auto', marginTop: '20%' }}>
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <>
          <div className={styles['preference-section']}>
            <h3>Frequency Preferences</h3>
            <p>
              Select the number of days in advance you want to receive a
              notification. Please choose at least one option.
            </p>

            <form className={styles['preference-form']}>
              {renderFrequencyCheckbox(30, 'One Month')}
              {renderFrequencyCheckbox(7, 'One Week')}
              {renderFrequencyCheckbox(0, 'Day of')}
            </form>
          </div>

          <div className={styles['preference-section']}>
            <h3>Friend Preferences</h3>
            <p>
              Enable or disable notifications for each friend and confirm below:
            </p>
            <div className={styles['friend-section-header']}>
              <input
                value={query}
                onChange={(evt) => handleSearch(evt.target.value)}
                placeholder="Search by name..."
                className={styles['search-bar']}
              />
              <div>
                <button
                  onClick={(evt) => handleEnableDisableAll(evt, 'enable')}
                >
                  Enable All
                </button>{' '}
                |{' '}
                <button
                  onClick={(evt) => handleEnableDisableAll(evt, 'disable')}
                >
                  Disable All
                </button>
              </div>
            </div>
            <div className={styles['friend-section']}>
              {filteredFriends &&
                filteredFriends.map((friend) => {
                  return (
                    <div key={friend._id} className={styles['friend-item']}>
                      <img
                        src={
                          friend.photo
                            ? friend.photo
                            : 'https://i.imgur.com/hCwHtRc.png'
                        }
                        alt={friend.name}
                      />
                      <div className={styles['friend-info']}>
                        <p style={{ fontWeight: 'bold' }}>{friend.name}</p>
                        <p>|</p>
                        <p>{formatDate(friend.dob)}</p>
                      </div>
                      <div
                        onClick={() =>
                          handleSelectFriend(
                            friend._id,
                            friend.includeInNotifications
                          )
                        }
                      >
                        {
                          // if friend is in updatedFriends, display new value, else display includeInNotifications value
                          updatedFriends[friend._id] ??
                          friend.includeInNotifications ? (
                            <FontAwesomeIcon
                              icon={faToggleOn}
                              color="#53CF85"
                              className={styles['friend-toggle']}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faToggleOff}
                              color="#AF95E7"
                              className={styles['friend-toggle']}
                            />
                          )
                        }
                      </div>
                    </div>
                  );
                })}

              <button
                onClick={(evt) => handleFriendSubmit(evt)}
                className={styles['update-button']}
              >
                Confirm Friend Preferences
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Manage;
