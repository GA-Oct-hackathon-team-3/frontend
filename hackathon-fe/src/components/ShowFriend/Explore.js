import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/ShowFriend.module.css';
import { IconButton, Typography, CircularProgress, Popover } from '@mui/material';

import FilterIcon from '../../assets/filter_icon.png';
import RefreshIcon from '../../assets/Blue_green_restart_icon.png';

import * as friendsService from '../../utilities/friends-service';
import { useRecommendation } from '../RecommendationContext/RecommendationContext';
import Gift from './Gift';

const Explore = ({ enableRecs, friend, friendLocation, giftPreferences, id, tags, toggleFavorite }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { cache, updateCache } = useRecommendation();

  const [recs, setRecs] = useState([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showError, setShowError] = useState(false);
  const [popOverText, setPopOverText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredGiftTypes, setFilteredGiftTypes] = useState(giftPreferences);
  const [filteredTags, setFilteredTags] = useState(tags);
  const [budget, setBudget] = useState(null);
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    const urlBudget = queryParams.get('budget');
    const urlTags = queryParams.get('tags') ? queryParams.get('tags').split(',') : [];
    const urlGiftTypes = queryParams.get('giftTypes') ? queryParams.get('giftTypes').split(',') : [];
    setFilteredGiftTypes((prev) => urlGiftTypes && urlGiftTypes.length ? urlGiftTypes : prev);
    setFilteredTags((prev) => (urlTags && urlTags.length ? urlTags : prev));
    setBudget((prev) => (urlBudget && urlBudget > 0 ? urlBudget : prev));
  }, [queryParams]);

  useEffect(() => {
    const getRecommendations = async () => {
      const requestBody = {
        giftTypes: filteredGiftTypes,
        tags: filteredTags,
      };
      if (budget) requestBody.budget = budget;
      setIsRecommending(true);
      try {
        const recom = await friendsService.getRecommendations(id, requestBody);
        setRefresh(false);
        setRecs(recom.recommendations);
        updateCache(id, recom.recommendations);
        setIsRecommending(false);
        setShowError(false);
      } catch (error) {
        setShowError(true);
        setIsRecommending(false);
        setRefresh(false);
      }
    };

    if (enableRecs && (!recs.length || refresh)) {
      if (!refresh) {
        if (cache[id] && cache[id].length) setRecs(cache[id]);
        else getRecommendations();
      } else {
        getRecommendations();
      }
    }
  }, 
    [enableRecs, filteredGiftTypes, filteredTags, recs.length, id, refresh, budget, giftPreferences, tags, cache, updateCache]
  );

  const handlePopOverOpen = (event, gift) => {
    setAnchorEl(event.currentTarget);
    setPopOverText(gift.reason);
  };

  const handlePopOverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={styles['personalized-recs--container']}>
        <div className={styles['personalized-recs--container--header']}>
          <Typography variant="h6">
            <div>Personalized Recommendations</div>
          </Typography>
          <IconButton
            className={styles['action-btn']}
            disabled={!enableRecs || isRecommending}
            onClick={() => setRefresh(true)}
          >
            <img alt="refresh" src={RefreshIcon} />
            <div>Refresh</div>
          </IconButton>
          <IconButton
            onClick={() => navigate('/filters', { state: { friend } })}
            className={styles['action-btn']}
            disabled={!enableRecs || isRecommending}
          >
            <img alt="filter" src={FilterIcon} />
            <div>Filter</div>
          </IconButton>
        </div>
        {!showError ? (
          <>
            {refresh || (!recs.length && tags.length) ? (
              <div className={styles['spinner-container']}>
                <CircularProgress color="secondary" />
              </div>
            ) : (
              <div className={styles['personalized-recs--grid']}>
                <Popover
                  id="mouse-over-popover"
                  sx={{
                    pointerEvents: 'none',
                  }}
                  open={!!anchorEl}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  onClose={handlePopOverClose}
                  disableRestoreFocus
                >
                  {popOverText}
                </Popover>
                {recs.map((rec, idx) => (
                  <div
                    key={idx}
                    className={styles['grid-item']}
                    onMouseEnter={(e) => handlePopOverOpen(e, rec)}
                    onMouseLeave={handlePopOverClose}
                  >
                    <Gift
                      gift={rec}
                      isFavorite={false}
                      location={friendLocation}
                      toggleFavorite={toggleFavorite}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className={styles['no-tags-text']}>
              <Typography>
                It appears our servers are too busy, try again in a few seconds
              </Typography>
            </div>
          </>
        )}
        {!enableRecs && (
          <>
            <div className={styles['no-tags-text']}>
              <Typography>
                Add tags to get personalized gift recommendations
              </Typography>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Explore;
