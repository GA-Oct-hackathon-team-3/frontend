import { useState, useEffect } from 'react';

import { getProfile } from '../../utilities/profiles-service';
import { retrieveFriends } from '../../utilities/friends-service';
import { formatDate } from '../../utilities/helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

const Manage = () => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState([]);
  const [frequency, setFrequency] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profileInfo = await getProfile();
      if (profileInfo && profileInfo.profile) {
        setFrequency(profileInfo.profile.notificationSchedule);
      }
    };

    const fetchFriends = async () => {
      const friendsData = await retrieveFriends();
      if (friendsData) {
        const flattenedFriendArray = friendsData.today.concat(
          friendsData.thisWeek,
          friendsData.thisMonth,
          friendsData.laterOn
        );
        setFriends(flattenedFriendArray);
        setFilteredFriends(flattenedFriendArray);
      }
    };

    fetchUserProfile();
    fetchFriends();
  }, []);

  const handleSearch = (query) => {
    setQuery(query);

    if (query) {
      setFilteredFriends(
        friends.filter((friend) =>
          friend.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else setFilteredFriends(friends);
  };

  const handleCheckbox = (days) => {
    setFrequency((prev) =>
      prev.includes(days)
        ? prev.filter((prevDays) => prevDays !== days)
        : [...prev, days]
    );
  };

  const handleFrequencySubmit = async (evt) => {
    evt.preventDefault();
  };

  const handleFriendSubmit = async (evt) => {
    evt.preventDefault();
  }

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

  const Item = ({
    id,
    name,
    dob,
    photo,
    includeInNotifications,
    setSelectedFriendIds,
  }) => {

    const handleSelectFriend = () => {
        setFilteredFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend._id === id ? { ...friend, includeInNotifications: !includeInNotifications } : friend
        )
      );
        setSelectedFriendIds((prev) =>
          prev.includes(id)
            ? prev.filter((prevId) => prevId !== id)
            : [...prev, id]
        );
      }
      

    return (
      <div>
        <img
          src={photo ? photo : 'https://i.imgur.com/hCwHtRc.png'}
          alt={name}
        />
        <p>{name} |</p>
        <p>{formatDate(dob)}</p>
        {includeInNotifications ? (
          <FontAwesomeIcon icon={faToggleOn} color="#53CF85" onClick={() => handleSelectFriend(id)} />
        ) : (
          <FontAwesomeIcon icon={faToggleOff} color="#AF95E7" onClick={() => handleSelectFriend(id)} />
        )}
      </div>
    );
  };

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
                    <Item
                      key={friend._id}
                      id={friend._id}
                      name={friend.name}
                      dob={friend.dob}
                      photo={friend.photo}
                      includeInNotifications={friend.includeInNotifications}
                      setSelectedFriendIds={setSelectedFriendIds}
                    />
                )
            })}

            <button onClick={(evt) => handleFriendSubmit(evt)}>Update Friend Preferences</button>
        </div>
      </div>
    </div>
  );
};

export default Manage;
