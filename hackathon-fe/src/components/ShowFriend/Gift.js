import { useState } from 'react';
import { Link } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/ShowFriend.module.css';
import { IconButton } from '@mui/material';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { IconContext } from 'react-icons/lib';

const Gift = ({ gift, isFavorite, location, toggleFavorite }) => {
  const [fillHeart, setFillHeart] = useState(isFavorite); // to toggle between empty or filled heart

  const buildGiftLink = (gift) => {
    if (/present/i.test(gift.giftType)) {
      return `https://www.amazon.com/s?k=${gift.title}`;
    } else if (/donation/i.test(gift.giftType)) {
      return `https://www.google.com/search?q=${gift.title}`;
    } else if (/experience/i.test(gift.giftType)) {
      let query = `https://www.google.com/search?q=${gift.title}`;
      if (location) query += `+near+${location}`; // uses friend location
      return query;
    }
  };

  return (
    <Link to={buildGiftLink(gift)} target="_blank" rel="noopener noreferrer">
      <div className={styles['product-pic']}>
        <img
          className={styles['product-pic']}
          src={gift.image ? gift.image : gift.imgSrc}
          alt={gift.title}
        />
        <div className={styles['product-heart']}>
          <IconButton
            onClick={(e) => {
              toggleFavorite(gift, e);
              setFillHeart(!fillHeart);
            }}
          >
            {fillHeart ? (
              <IconContext.Provider value={{ color: '#FA7F39' }}>
                <BsHeartFill />
              </IconContext.Provider>
            ) : (
              <BsHeart />
            )}
          </IconButton>
        </div>
      </div>

      <div className={styles['product-name']}>{gift.title}</div>
      <div className={styles['product-price']}>~{gift.estimatedCost}</div>
    </Link>
  );
};

export default Gift;
