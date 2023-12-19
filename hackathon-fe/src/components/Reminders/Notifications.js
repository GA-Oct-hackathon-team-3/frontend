import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getNotifications, markAsRead, deleteNotification } from '../../utilities/reminders-service';
import { getAgeAndSuffix } from '../../utilities/helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import styles from '../../styles/Reminders.module.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState({ current: [], past: [] });

  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationData = await getNotifications();
      if (notificationData && !notificationData.message)
        setNotifications(notificationData);
    };

    const readNotifications = async () => {
        const ids = notifications.current.map(notif => notif._id); // creates array of all unread notifications ids
        const response = await markAsRead(ids); // sends to backend to mark as read
    }

    fetchNotifications();

    setTimeout(() => { 
        // if no unread notifications, no call to backend
        if (notifications.current.length > 0) readNotifications();
    }, 3000); // runs 3 seconds after mount
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

    const removeReminder = async () => {
        const response = await deleteNotification(id);
        if (response && response.message === 'Notification deleted successfully') {
            setNotifications((prev) => ({
                ...prev,
                current: prev.current.filter(notif => notif._id !==id),
                past: prev.past.filter(notif => notif._id !==id),
            }));
        }
      }

    return (
      <div className={styles['notification-item']} onClick={() => navigate(`/friend/${friendId}`)}>
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
                color='#53CF85'
                onClick={removeReminder}
                />
        </div>
      </div>
    );
  };

  return (
    <div className={styles['tab-section']}>
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
    </div>
  );
};

export default Notifications;
