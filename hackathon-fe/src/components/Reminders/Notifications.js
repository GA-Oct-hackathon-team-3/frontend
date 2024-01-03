import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as remindersService from '../../utilities/reminders-service';
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
      const reminderData = await remindersService.getReminders();
      if (reminderData && !reminderData.message) setNotifications(reminderData);
    };

    const readReminders = async () => {
      const ids = notifications.current.map((notif) => notif._id); // creates array of all unread notifications ids
      const response = await remindersService.markAsRead(ids); // sends to backend to mark as read
    };

    fetchReminders();

    setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    setTimeout(() => {
      // if no unread notifications, no call to backend
      if (notifications.current.length > 0) readReminders();
    }, 2000); // runs 2 seconds after mount
  }, []);

  const NotificationItem = ({
    id,
    friendId,
    name,
    dob,
    daysUntilBirthday,
    photo,
    setNotifications,
  }) => {
    const navigate = useNavigate();

    const removeReminder = async (evt) => {
      evt.stopPropagation();
      const response = await remindersService.deleteReminder(id);
      if (response && response.message === 'Reminder deleted successfully') {
        setNotifications((prev) => ({
          ...prev,
          current: prev.current.filter((notif) => notif._id !== id),
          past: prev.past.filter((notif) => notif._id !== id),
        }));
      }
    };

    return (
      <div
        className={styles['notification-item']}
        onClick={() => navigate(`/friend/${friendId}`)}
      >
        <div className={styles['notification-card']}>
          <img
            src={photo ? photo : 'https://i.imgur.com/hCwHtRc.png'}
            alt={name}
          />
          <div className={styles['notification-info']}>
            <p>{name}'s</p>
            <p>{getAgeAndSuffix(dob)} birthday</p>
          </div>
          <div className={styles['notification-days']}>
            <p>{Math.abs(daysUntilBirthday)}</p>
            <p>{daysUntilBirthday >= 0 ? 'Days Left' : 'Days Ago'}</p>
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
