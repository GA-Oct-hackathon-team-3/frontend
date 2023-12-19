import { useState, useEffect } from 'react';

import { getProfile, updateUserProfile } from '../../utilities/profiles-service';
import { retrieveFriends, updateFriendNotification } from '../../utilities/friends-service';
import { formatDate } from '../../utilities/helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

const Manage = () => {
  const [friends, setFriends] = useState([]); // use to reset filter
  const [filteredFriends, setFilteredFriends] = useState([]); // use to render
  const [updatedFriends, setUpdatedFriends] = useState({}); // accumulates changes to includeInNotifications per friend, using _id: boolean
  const [query, setQuery] = useState(''); // search query to filter friends in friend preferences

  const [frequency, setFrequency] = useState([]); // notificationSchedule preferences

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profileInfo = await getProfile(); // fetch profile
      if (profileInfo && profileInfo.profile) {
        setFrequency(profileInfo.profile.notificationSchedule); // initialize user's current preferences
      }
    };

    const fetchFriends = async () => {
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
    };

    fetchUserProfile();
    fetchFriends();
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
  };

  const handleSelectFriend = (id, includeInNotifications) => {
    // if if is a key in object, set to opposite value, otherwise set to !includeNotifications
    const updatedNotificationValue = updatedFriends.hasOwnProperty(id) ? !updatedFriends[id] : !includeInNotifications;

    // maintains object of key with ids of friends were who updated, and the boolean value to which includeInNotifications should be updated to
    // ids for submission to backend, value to update render
    setUpdatedFriends((prev) => {
        if (updatedNotificationValue === includeInNotifications) { // if the value to update is equal to original value (i.e if toggled twice)...
            const { [id]: omit, ...rest } = prev; // remove id key from state to prevent submission of id to backend
            return rest;
        }

        return {
            ...prev,
            [id]: updatedNotificationValue
        }
    });
  };

  const handleFrequencySubmit = async (evt) => {
    evt.preventDefault();
    if (frequency) {
        const userData = {
            notificationSchedule: [...frequency]
        }
        const response = await updateUserProfile(userData);
    }
  };

  const handleFriendSubmit = async (evt) => {
    evt.preventDefault();

    console.log(updatedFriends)
    const friendIds = Object.keys(updatedFriends);
    const response = await updateFriendNotification(friendIds);
    if (response.message === 'Updated friend notification preference successfully'); setUpdatedFriends({});
  };

  // reusable render of checkbox for freqnecy preferences section
  const renderFrequencyCheckbox = (value, label) => (
    <>
      <input
        type="checkbox"
        name={label}
        checked={frequency.includes(value)}
        onChange={() => handleCheckbox(value)}
      />
      <label htmlFor={label}>{label}</label>
    </>
  );

  return (
    <div>
      <div>
        <h3>Frequency Preferences</h3>
        <p>
          Select the number of days in advance you want to receive a
          notification. Please choose at least one option.
        </p>

        <form onSubmit={handleFrequencySubmit}>
          {renderFrequencyCheckbox(30, 'One Month')}
          {renderFrequencyCheckbox(7, 'One Week')}
          {renderFrequencyCheckbox(0, 'Day of')}

          <input type="submit" value="Update Frequency" />
        </form>
      </div>

      <div>
        <input
          value={query}
          onChange={(evt) => handleSearch(evt.target.value)}
          placeholder="Search by name..."
        />
        <h3>Friend Preferences</h3>
        <p>
          Select the friends for whom you want to enable/disable notifications:
        </p>
        <div>
          {filteredFriends &&
            filteredFriends.map((friend) => {
              return (
                <div>
                  <img
                    src={
                      friend.photo
                        ? friend.photo
                        : 'https://i.imgur.com/hCwHtRc.png'
                    }
                    alt={friend.name}
                  />
                  <p>{friend.name} |</p>
                  <p>{formatDate(friend.dob)}</p>
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
                        <FontAwesomeIcon icon={faToggleOn} color="#53CF85" />
                      ) : (
                        <FontAwesomeIcon icon={faToggleOff} color="#AF95E7" />
                      )
                    }
                  </div>
                </div>
              );
            })}

          <button onClick={(evt) => handleFriendSubmit(evt)}>
            Update Friend Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Manage;
