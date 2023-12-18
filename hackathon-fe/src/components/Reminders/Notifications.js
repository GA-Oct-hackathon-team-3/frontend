import { useState, useEffect } from 'react';

import { getNotifications } from '../../utilities/reminders-service';
import { getAgeAndSuffix } from '../../utilities/helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import styles from '../../styles/Reminders.module.css'

const Notifications = () => {
  const [notifications, setNotifications] = useState({ current: [], past: [] });

  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationData = await getNotifications();
      if (notificationData && !notificationData.message)
        setNotifications(notificationData);
    };

    fetchNotifications();
  }, []);

  const NotificationItem = ({
    id,
    name,
    dob,
    daysUntilBirthday,
    photo,
    setNotifications,
  }) => {
    return (
      <div className={styles['notification-item']}>
        <div className={styles['notification-card']}>
          <img
            src={photo ? photo : 'https://i.imgur.com/hCwHtRc.png'}
            alt={name}
            className={styles['']}
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
                />
                </div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles['notification-section']}>
        <h3>Current</h3>
        {notifications.current &&
          notifications.current.map((item) => (
            <NotificationItem
              key={item._id.toString()}
              id={item._id.toString()}
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
