import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

import * as remindersService from '../../utilities/reminders-service';
import * as friendsService from '../../utilities/friends-service';
import { getAgeAndSuffix } from '../../utilities/helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@mui/material';

import styles from '../../styles/Reminders.module.css';

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState({ current: [], past: [] });

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const reminderData = await remindersService.getReminders();
        if (reminderData && !reminderData.message)
          setNotifications(reminderData);
      } catch (error) {
        throw error;
      }
    };

    const readReminders = async () => {
      try {
        const ids = notifications.current.map((notif) => notif._id); // creates array of all unread notifications ids
        if (ids.length === 0) return; // if no unread reminders, return
        await remindersService.markAsRead(ids); // sends to backend to mark as read
      } catch (error) {
        throw error;
      }
    };

    // uses debounce to delay mark reminders as read after 3 seconds
    const delayedRead = debounce(() => readReminders(), 3000);

    fetchReminders();
    delayedRead();

    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  const NotificationItem = ({
    id,
    friendId,
    name,
    dob,
    daysUntilBirthday,
    photo,
    hasGift,
    setNotifications,
  }) => {
    const navigate = useNavigate();

    const handleCheckGift = async (id) => {
      const friendInput = { hasGift: !hasGift };

      try {
        const response = await friendsService.updateFriend(id, friendInput);

        if (response && response.message === 'Friend updated') {
          setNotifications((prev) => ({
            ...prev,
            current: prev.current.map((notif) =>
              notif.friend._id === id
                ? {
                    ...notif,
                    friend: { ...notif.friend, hasGift: !notif.friend.hasGift },
                  }
                : notif
            ),
            past: prev.past.map((notif) =>
              notif.friend._id === id
                ? {
                    ...notif,
                    friend: { ...notif.friend, hasGift: !notif.friend.hasGift },
                  }
                : notif
            ),
          }));
        }
      } catch (error) {
        throw error;
      }
    };

    const removeReminder = async (evt) => {
      evt.stopPropagation();
      try {
        const response = await remindersService.deleteReminder(id);
        if (response && response.message === 'Reminder deleted successfully') {
          setNotifications((prev) => ({
            ...prev,
            current: prev.current.filter((notif) => notif._id !== id),
            past: prev.past.filter((notif) => notif._id !== id),
          }));
        }
      } catch (error) {
        throw error;
      }
    };

    return (
      <div className={styles['notification-item']}>
        <div className={styles['notification-card']}>
          <img
            src={photo ? photo : 'https://i.imgur.com/hCwHtRc.png'}
            alt={name}
          />
          <div
            className={styles['notification-info']}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/friend/${friendId}`)}
          >
            <p>{name}'s</p>
            <p>{getAgeAndSuffix(dob)} birthday</p>
          </div>
          <div className={styles['notification-days']}>
            <p>{Math.abs(daysUntilBirthday)}</p>
            <p>{daysUntilBirthday >= 0 ? 'Days Left' : 'Days Ago'}</p>
          </div>
          <div className={styles['gift-group']}>
            <input type="checkbox" name="gift" id="gift" />
            <label
              htmlFor="gift"
              className={
                hasGift
                  ? styles['custom-checkbox-checked']
                  : styles['custom-checkbox']
              }
              onClick={() => handleCheckGift(friendId)}
            >
              {hasGift ? '\u2714' : ''}
            </label>
            <label htmlFor="gift">Gift?</label>
          </div>
          <FontAwesomeIcon
            icon={faTimesCircle}
            className={styles['notification-close']}
            color="#53CF85"
            onClick={removeReminder}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles['tab-section']}>
      {isLoading ? (
        <div style={{ margin: 'auto', marginTop: '20%' }}>
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <>
          <div className={styles['notification-section']}>
            <h3>Current</h3>
            {notifications.current &&
              notifications.current.map((item) => (
                <NotificationItem
                  key={item._id.toString()}
                  id={item._id.toString()}
                  friendId={item.friend._id}
                  name={item.friend.name}
                  dob={item.friend.dob}
                  daysUntilBirthday={item.friend.daysUntilBirthday}
                  photo={item.friend.photo}
                  hasGift={item.friend.hasGift}
                  setNotifications={setNotifications}
                />
              ))}
          </div>
          <div className={styles['notification-section']}>
            <h3>Past</h3>
            {notifications.past &&
              notifications.past.map((item) => (
                <NotificationItem
                  key={item._id.toString()}
                  id={item._id.toString()}
                  friendId={item.friend._id}
                  name={item.friend.name}
                  dob={item.friend.dob}
                  daysUntilBirthday={item.friend.daysUntilBirthday}
                  photo={item.friend.photo}
                  hasGift={item.friend.hasGift}
                  setNotifications={setNotifications}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
