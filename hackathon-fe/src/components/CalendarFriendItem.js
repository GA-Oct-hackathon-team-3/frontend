import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBirthdayCake } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../utilities/helpers';

import styles from '../styles/Calendar.module.css';

const CalendarFriendItem = ({ id, dob, photo, name }) => {
  const navigate = useNavigate();
  // dob in string form but not yyyy-mm-dd format...
  // convert to Date object, then take ISOString and pass into formatDate helper for -- day monthString year -- format
  const birthday = formatDate(new Date(dob).toISOString().split('T')[0]);

  return (
    <div
      className={styles['birthday-item']}
      onClick={() => navigate(`/friend/${id}`)}
    >
      <div className={styles['item-card']}>
        {photo ? (
          <img src={photo} alt={name} />
        ) : (
          <FontAwesomeIcon
            icon={faBirthdayCake}
            size="xl"
            style={{ height: '3rem' }}
            color="red"
          />
        )}
        <div className={styles['item-card-info']}>
          <p>{name}</p>
          <p>{birthday}</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarFriendItem;
