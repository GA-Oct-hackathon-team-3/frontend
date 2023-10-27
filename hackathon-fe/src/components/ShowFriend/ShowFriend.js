import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import styles from "./ShowFriend.module.css";
import {
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Typography,
  CircularProgress,
  Popover
} from "@mui/material";
import * as friendsService from "../../utilities/friends-service";
import {
  daysUntilBirthday,
  splitDOB,
  calculateAge
} from "../../utilities/helpers";
import {
  BsArrowCounterclockwise,
  BsArrowLeft,
  BsFilter,
  BsHeart,
  BsHeartFill
} from "react-icons/bs";
import { useRecommendation } from "../RecommendationContext/RecommendationContext";

import EditIcon from '../../assets/edit_icon.png';
import FilterIcon from '../../assets/filter_icon.png';
import RefreshIcon from '../../assets/Blue_green_restart_icon.png';
import { IconContext } from "react-icons/lib";

const ShowFriend = () => {
  const [friend, setFriend] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [dobObject, setDobObject] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [enableRecs, setEnableRecs] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [filteredGiftTypes, setFilteredGiftTypes] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [budget, setBudget] = useState(null);
  const [recs, setRecs] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showError, setShowError] = useState(false);
  const [favError, setFavError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [popOverText, setPopOverText] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { cache, updateCache } = useRecommendation();

  const { id } = useParams();
  const navigate = useNavigate();

  // Extract parameters from URL
  const urlBudget = queryParams.get('budget');
  const urlTags = queryParams.get('tags') ? queryParams.get('tags').split(',') : [];
  const urlGiftTypes = queryParams.get('giftTypes') ? queryParams.get('giftTypes').split(',') : [];

  useEffect(() => {
    // If URL parameters exist, switch to "explore" tab, else default to "profile"
    if (urlBudget || urlTags.length > 0 || urlGiftTypes.length > 0) {
      setActiveTab("explore");
    } else {
      setActiveTab("profile");
    }
  }, []); // This effect should only run once, so the dependency array is empty

  useEffect(() => {
    const fetchFriend = async () => {
      const friendData = await friendsService.showFriend(id);
      const uniqueTimestamp = Date.now();
      friendData.photo = `${friendData.photo ? friendData.photo : "https://i.imgur.com/hCwHtRc.png"
        }?timestamp=${uniqueTimestamp}`;
      setFriend(friendData);
      setDobObject(splitDOB(friendData.dob));
    };
    const fetchFavorites = async () => {
      const favorites = await friendsService.getFavorites(id);
      setFavorites(favorites);
    };
    fetchFriend();
    fetchFavorites();
  }, [id]);

  useEffect(() => {
    if (friend && friend.tags && friend.tags.length) {
      setEnableRecs(true);
    } else {
      setEnableRecs(false);
    }
    if (friend) {
      urlGiftTypes && urlGiftTypes.length ? setFilteredGiftTypes(urlGiftTypes) : setFilteredGiftTypes(friend.giftPreferences);
      urlTags && urlTags.length ? setFilteredTags(urlTags) : setFilteredTags(friend.tags.map(tag => tag.title));
      urlBudget && urlBudget > 0 ? setBudget(urlBudget) : setBudget(null);
    }
  }, [friend]);

  useEffect(() => {
    const getRecommendations = async () => {
      const requestBody = {
        giftTypes: filteredGiftTypes,
        tags: filteredTags
      };
      if (budget) {
        requestBody.budget = budget
      }
      console.log(requestBody);
      setIsRecommending(true);
      try {
        const recom = await friendsService.getRecommendations(id, requestBody);
        setRefresh(false);
        console.log(recom);
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

    if (enableRecs && activeTab === "explore" && (!recs.length || refresh)) {
      if (!refresh) {
        if (cache[id] && cache[id].length) {
          setRecs(cache[id]);
        } else {
          getRecommendations();
        }
      } else {
        getRecommendations();
      }
    }
  }, [activeTab, enableRecs, recs.length, id, refresh, budget, filteredGiftTypes, filteredTags, cache, updateCache]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if(tabName==="explore") setAnchorEl(null);
  };

  const handleEditProfile = () => {
    navigate(`/friend/${id}/edit`);
  };

  const handleEditTags = () => {
    // alert("Edit friend tags");
    navigate(`/friend/${id}/tag`);
  };

  const handleEditFavorites = () => {
    alert("Edit favorites");
  };

  const buildGiftLink = (gift) => {
    if (/present/i.test(gift.giftType)) {
      return `https://www.amazon.com/s?k=${gift.title}`;
    } else if (/donation/i.test(gift.giftType)) {
      return `https://www.google.com/search?q=${gift.title}`;
    } else if (/experience/i.test(gift.giftType)) {
      let query = `https://www.google.com/search?q=${gift.title}`;
      if (friend && friend.location) {
        query += `+near+${friend.location}`;
      }
      return query;
    }
  }

  const handlePopOverOpen = (event, gift) => {
    setAnchorEl(event.currentTarget);
    setPopOverText(gift.reason);
  }

  const handlePopOverClose = () => {
    setAnchorEl(null);
  }

  const toggleFavorite = async (recommendation, e) => {
    e.preventDefault();
    const idx = favorites.findIndex(fav => fav.title.toLowerCase() === recommendation.title.toLowerCase());
    if (idx > -1) {
      // remove from favorites
      try {
        const item = favorites[idx];
        const res = await friendsService.removeFromFavorites(id, item._id);
        console.log(res);
        setFavorites(favorites.slice(0, idx).concat(favorites.slice(idx + 1)));
      } catch (error) {
        setFavError(error.message);
      }
    } else {
      // add to favorites
      try {
        const res = await friendsService.addToFavorites(id, recommendation);
        console.log(res);
        setFavorites([...favorites, res.recommendation]);
      } catch (error) {
        setFavError(error.message);
      }
    }
  }

  const giftPreferences = friend && friend.giftPreferences;
  const open = Boolean(anchorEl);

  return (
    <div className={styles["container"]}>
      <div className={styles["shadow"]}></div>
      <div className={styles["profile"]}>
        <img
          src={
            friend && friend.photo
              ? friend.photo
              : "https://i.imgur.com/hCwHtRc.png"
          }
          alt="Anthony Sudol"
          className={styles["profile-pic"]}
        />
        <h2 style={{ position: "relative" }}>{friend && friend.name}</h2>
        <p className={styles["back-btn"]} onClick={() => navigate('/friends')}>
          <BsArrowLeft />
        </p>


        <p>Friend</p>
      </div>
      <div className={styles["birthday"]}>
        <div className={styles["description"]}>
          <p className={styles["text-brick"]}>{dobObject && dobObject.day}</p>
          <p>{dobObject && dobObject.month}</p>
        </div>
        <div className={styles["border"]}>
          <p></p>
          <p></p>
        </div>
        <div className={styles["description"]}>
          <p className={styles["text-brick"]}>
            {friend && daysUntilBirthday(friend.dob)}
          </p>
          <p>Days left</p>
        </div>
        <div className={styles["border"]}>
          <p></p>
          <p></p>
        </div>
        <div className={styles["description"]}>
          <p className={styles["text-brick"]}>{friend && calculateAge(friend.dob)}</p>
          <p>Age </p>
        </div>
        <div>
          <img onClick={handleEditProfile} alt="edit" src={EditIcon} />
        </div>
      </div>
      <div className={styles["tab-container"]}>
        <span
          onClick={() => handleTabClick("profile")}
          className={activeTab === "profile" ? styles["active-tab"] : ""}
        >
          Profile
        </span>
        <span
          onClick={() => handleTabClick("explore")}
          className={activeTab === "explore" ? styles["active-tab"] : ""}
        >
          Explore Gifts
        </span>
      </div>
      {activeTab === "profile" && (
        <>
          <Card className={styles["card"]}>
            <CardHeader
              className={styles["card-header"]}
              title="Gift Type"
              action={
                <IconButton onClick={handleEditProfile}>
                  <img alt="edit" src={EditIcon} />
                </IconButton>
              }
            />
            <CardContent>
              <div className={styles["gift-preference"]}>
                <div className={styles["gift-types"]}>
                  <div
                    className={
                      styles["gift-type-btn"] +
                      " " +
                      (giftPreferences && giftPreferences.includes("Experience")
                        ? styles["active"]
                        : "")
                    }
                  >
                    <div
                      className={styles["gift-type-btn__image--experiences"]}
                    ></div>
                    <div className={styles["gift-type-btn__text"]}>
                      Experiences
                    </div>
                  </div>
                  <div
                    className={
                      styles["gift-type-btn"] +
                      " " +
                      (giftPreferences && giftPreferences.includes("Present")
                        ? styles["active"]
                        : "")
                    }
                  >
                    <div
                      className={styles["gift-type-btn__image--presents"]}
                    ></div>
                    <div className={styles["gift-type-btn__text"]}>
                      Presents
                    </div>
                  </div>
                  <div
                    className={
                      styles["gift-type-btn"] +
                      " " +
                      (giftPreferences && giftPreferences.includes("Donation")
                        ? styles["active"]
                        : "")
                    }
                  >
                    <div
                      className={styles["gift-type-btn__image--donations"]}
                    ></div>
                    <div className={styles["gift-type-btn__text"]}>
                      Donations
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={styles["card"]}>
            <CardHeader
              className={styles["card-header"]}
              title="Selected Tags"
              action={
                <IconButton onClick={handleEditTags}>
                  <img alt="edit" src={EditIcon} />
                </IconButton>
              }
            />
            <CardContent>
              <div className={styles["gift-preference"]}>
                <div className={styles["tags"]}>
                  {friend &&
                    friend.tags &&
                    !!friend.tags.length &&
                    friend.tags.map((tag, idx) => (
                      <>
                        <button key={tag._id}>{tag.title}</button>
                      </>
                    ))}
                  {!(friend && friend.tags && !!friend.tags.length) && (
                    <>
                      <div>
                        Your friend doesn't have any tags. Click edit to add
                        them.
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={styles["card"]}>
            <CardHeader
              className={styles["card-header"]}
              title="Favorite Gifts"
            />
            <CardContent>
              <div className={styles["gift-recommendations"]}>
                {favorites &&
                  !!favorites.length &&
                  <div className={styles["fav-grid"]}>
                    {favorites.map((fav, idx) => {
                      return (
                        <div key={fav._id} className={styles["grid-item"]}>
                           <Link to={buildGiftLink(fav)} target="_blank" rel="noopener noreferrer">
                          <div className={styles["product-pic"]}>
                            <img
                              className={styles["product-pic"]}
                              src={fav.image}
                              alt={fav.title}
                            />
                            <div className={styles["product-heart"]}>
                              <IconButton onClick={(e) => toggleFavorite(fav, e)}>
                                    <IconContext.Provider value={{ color: "#FA7F39" }}>
                                      <BsHeartFill />
                                    </IconContext.Provider>
                              </IconButton>
                            </div>
                          </div>

                          <div className={styles["product-name"]}>{fav.title}</div>
                          <div className={styles["product-price"]}>
                            ~{fav.estimatedCost}
                          </div>
                        </Link>
                        </div>
                      );
                    })}
                  </div>
                }
                {!(favorites && !!favorites.length) && (
                  <Typography>
                    You have no favorites yet
                  </Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {activeTab === "explore" && (
        <>
          <div className={styles["personalized-recs--container"]}>
            <div className={styles["personalized-recs--container--header"]}>
              <Typography variant="h6">
                <div>Personalized Recommendations</div>
              </Typography>
              <IconButton
                className={styles["action-btn"]}
                disabled={!enableRecs || isRecommending}
                onClick={() => setRefresh(true)}
              >
                <img alt="refresh" src={RefreshIcon} />
                <div>Refresh</div>
              </IconButton>
              <IconButton onClick={() => navigate('/filters', { state: { friend } })} className={styles["action-btn"]} disabled={!enableRecs || isRecommending}>
                <img alt="filter" src={FilterIcon} />
                <div>Filter</div>
              </IconButton>
            </div>
            {!showError ?
              <>
                {refresh || !recs.length ? (<div className={styles["spinner-container"]}>
                  <CircularProgress color="secondary" />
                </div>) : (
                  <div className={styles["personalized-recs--grid"]}>
                    <Popover
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: 'none',
                      }}
                      open={open}
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
                    >{popOverText}</Popover>
                    {recs.map((rec, idx) => (
                      <div key={idx} className={styles["grid-item"]} onMouseEnter={(e) => handlePopOverOpen(e, rec)} onMouseLeave={handlePopOverClose}>
                        <Link to={buildGiftLink(rec)} target="_blank" rel="noopener noreferrer">
                          <div className={styles["product-pic"]}>
                            <img
                              className={styles["product-pic"]}
                              src={rec.imgSrc}
                              alt={rec.title}
                            />
                            <div className={styles["product-heart"]}>
                              <IconButton onClick={(e) => toggleFavorite(rec, e)}>
                                {
                                  favorites.findIndex(fav => fav.title.toLowerCase() === rec.title.toLowerCase()) === -1 ?
                                    <BsHeart />
                                    :
                                    <IconContext.Provider value={{ color: "#FA7F39" }}>
                                      <BsHeartFill />
                                    </IconContext.Provider>
                                }
                              </IconButton>
                            </div>
                          </div>

                          <div className={styles["product-name"]}>{rec.title}</div>
                          <div className={styles["product-price"]}>
                            ~{rec.estimatedCost}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </>
              :
              <>
                <div className={styles["no-tags-text"]}>
                  <Typography>
                    It appears our servers are too busy, try again in a few seconds
                  </Typography>
                </div>
              </>
            }
            {!enableRecs && (
              <>
                <div className={styles["no-tags-text"]}>
                  <Typography>
                    Add tags to get personalized gift recommendations
                  </Typography>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShowFriend;
