import { useNavigate } from 'react-router-dom';
import Gift from './Gift';

import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/ShowFriend.module.css';
import { Card, CardHeader, IconButton, CardContent, Typography } from '@mui/material';
import EditIcon from '../../assets/edit_icon.png';

const Profile = ({ favorites, friendLocation, giftPreferences, id, tags, toggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <>
      <Card className={styles['card']}>
        <CardHeader
          className={styles['card-header']}
          title="Gift Type"
          action={
            <IconButton onClick={() => navigate(`/friend/${id}/edit`)}>
              <img alt="edit" src={EditIcon} />
            </IconButton>
          }
        />
        <CardContent>
          <div className={styles['gift-preference']}>
            <div className={styles['gift-types']}>
              <div
                className={
                  styles['gift-type-btn'] +
                  ' ' +
                  (giftPreferences && giftPreferences.includes('Experience')
                    ? styles['active']
                    : '')
                }
              >
                <div
                  className={styles['gift-type-btn__image--experiences']}
                ></div>
                <div className={styles['gift-type-btn__text']}>Experiences</div>
              </div>
              <div
                className={
                  styles['gift-type-btn'] +
                  ' ' +
                  (giftPreferences && giftPreferences.includes('Present')
                    ? styles['active']
                    : '')
                }
              >
                <div className={styles['gift-type-btn__image--presents']}></div>
                <div className={styles['gift-type-btn__text']}>Presents</div>
              </div>
              <div
                className={
                  styles['gift-type-btn'] +
                  ' ' +
                  (giftPreferences && giftPreferences.includes('Donation')
                    ? styles['active']
                    : '')
                }
              >
                <div
                  className={styles['gift-type-btn__image--donations']}
                ></div>
                <div className={styles['gift-type-btn__text']}>Donations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={styles['card']}>
        <CardHeader
          className={styles['card-header']}
          title="Selected Tags"
          action={
            <IconButton onClick={() => navigate(`/friend/${id}/tag`)}>
              <img alt="edit" src={EditIcon} />
            </IconButton>
          }
        />
        <CardContent>
          <div className={styles['gift-preference']}>
            <div className={styles['tags']}>
              {tags &&
                tags.map((tag, idx) => (
                  <>
                    <button key={tag._id}>{tag.title}</button>
                  </>
                ))}
              {!tags ||
                (!tags.length && (
                  <>
                    <div>
                      Your friend doesn't have any tags. Click edit to add them.
                    </div>
                  </>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={styles['card']}>
        <CardHeader className={styles['card-header']} title="Favorite Gifts" />
        <CardContent>
          <div className={styles['gift-recommendations']}>
            {favorites && !!favorites.length && (
              <div className={styles['fav-grid']}>
                {favorites.map((fav, idx) => (
                  <div key={fav._id} className={styles['grid-item']}>
                    <Gift
                      gift={fav}
                      isFavorite={true}
                      key={idx}
                      location={friendLocation}
                      toggleFavorite={toggleFavorite}
                    />
                  </div>
                ))}
              </div>
            )}
            {!(favorites && !!favorites.length) && (
              <Typography>You have no favorites yet</Typography>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Profile;
