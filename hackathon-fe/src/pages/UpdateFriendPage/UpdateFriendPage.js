import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import * as friendsService from '../../utilities/friends-service';
import {
  profileFormValidation,
  profileDobValidation,
} from '../../utilities/helpers';

import Header from '../../components/Header';

import profileImage from '../../assets/images/profileForm/manHoldingBaby.png';

import { BsArrowLeft } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { Box, MenuItem, Select, CircularProgress } from '@mui/material';

import styles from '../../styles/ProfileForm.module.css';

function UpdateFriendPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [profileInput, setProfileInput] = useState({
    name: '',
    dob: '',
    gender: '',
    location: '',
    giftPreferences: [],
  });
  const [displayFile, setDisplayFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [buttonHTML, setButtonHTML] = useState('Add profile photo');
  const [validationMessage, setValidationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const friendInfo = await friendsService.showFriend(id);
        setProfileInput({ ...friendInfo });
        if (friendInfo.photo) {
          const uniqueTimestamp = Date.now();
          friendInfo.photo = `${friendInfo.photo}?timestamp=${uniqueTimestamp}`;
          setDisplayFile(friendInfo.photo);
          setButtonHTML('Change photo');
        }
      } catch (error) {
        throw error;
      } finally {
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
      }
    };
    fetchFriend();
  }, [id]);

  function handleAddPhotoClick(evt) {
    evt.preventDefault();
    fileInputRef.current.click();
  }

  function handleFileChange(evt) {
    // assigns file upload to display image, adds file to state for form submit, and toggles button HTML
    const file = evt.target.files[0];
    if (file) {
      setDisplayFile(URL.createObjectURL(file));
      setUploadedFile(file);
      setButtonHTML('Change photo');
    } else {
      setDisplayFile(null);
      setUploadedFile(null);
      setButtonHTML('Add profile photo');
    }
  }

  const handleGiftTypeToggle = (type) => {
    const newGiftTypes = profileInput.giftPreferences.includes(type)
      ? profileInput.giftPreferences.filter((t) => t !== type)
      : [...profileInput.giftPreferences, type];
    setProfileInput({ ...profileInput, giftPreferences: newGiftTypes });
  };

  const handleFormMessage = (string) => {
    setIsSubmitting(false);

    // handles scrolling to top to display message with various reasons for why form is not valid for submit
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return setValidationMessage(string);
  };

  const submitHandler = async (evt) => {
    try {
      evt.preventDefault();
      setIsSubmitting(true);

      setValidationMessage('');

      const validDate = profileDobValidation(profileInput.dob);
      const valid = profileFormValidation(profileInput);
      if (!validDate)
        return handleFormMessage('Date of birth cannot be in the future');
      if (!valid)
        return handleFormMessage('Required fields are marked with (*)');

      const response = await friendsService.updateFriend(id, profileInput);
      if (uploadedFile) {
        const photoResponse = await friendsService.uploadPhoto(
          id,
          uploadedFile
        );
        if (!photoResponse.ok)
          toast.error('Failed to upload photo. Please try again.');
      }
      if (response.message === 'Friend updated') {
        toast.info('Updating friend...', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });

        const pathData = { path: location.pathname };

        setTimeout(() => {
          navigate(`/friend/${id}`, { state: pathData });
        }, 2000);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Header />
      <section className={styles['profile-container']}>
        {isLoading ? (
          <div style={{ margin: 'auto' }}>
            <CircularProgress color="secondary" />
          </div>
        ) : (
          <div className={styles['content-container']}>
            <div className={styles['back-button']}>
              <p onClick={() => navigate(-1)}>
                <BsArrowLeft />
              </p>
            </div>

            <form
              onSubmit={submitHandler}
              encType="multipart/form-data"
              className={styles['form-container']}
            >
              <div className={styles['photo-group']}>
                <div className={styles['photo-form-group']}>
                  <h1>Edit Friend Profile</h1>
                  {displayFile ? (
                    <img src={`${displayFile}`} alt="Uploaded" />
                  ) : (
                    <label
                      htmlFor="image"
                      className={styles['add-image']}
                      onClick={handleAddPhotoClick}
                    >
                      +
                    </label>
                  )}
                  <input
                    accept=".jpg,.jpeg,.svg,.tiff,.bmp,.png,.webp"
                    type="file"
                    name="photo"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <p onClick={handleAddPhotoClick}>{buttonHTML}</p>
                </div>
                <img
                  src={profileImage}
                  alt="person holding a baby"
                  className={styles['profile-icon']}
                />
              </div>
              <br />
              <p>{validationMessage ? validationMessage : ''}</p>
              <div className={styles['form-group']}>
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  value={profileInput && profileInput.name}
                  onChange={(e) =>
                    setProfileInput({ ...profileInput, name: e.target.value })
                  }
                />
              </div>
              <br />

              <div className={styles['form-select-section']}>
                <div className={styles['form-group']}>
                  <label htmlFor="dob">Date of Birth *</label>
                  <input
                    type="date"
                    id="dob"
                    value={profileInput && profileInput.dob}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) =>
                      setProfileInput({ ...profileInput, dob: e.target.value })
                    }
                  />
                </div>
                <br />
                <Box className={styles['form-group']}>
                  <label htmlFor="gender">Gender *</label>
                  <Select
                    id="gender"
                    value={profileInput && profileInput.gender}
                    className={styles['selector']}
                    onChange={(e) =>
                      setProfileInput({
                        ...profileInput,
                        gender: e.target.value,
                      })
                    }
                  >
                    <MenuItem disabled></MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </Box>
              </div>
              <br />

              <div className={styles['form-group']}>
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  value={profileInput && profileInput.location}
                  onChange={(e) =>
                    setProfileInput({
                      ...profileInput,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <br />

              <div className={styles['form-group']}>
                <p>Gift type Preferences (choose all that apply)</p>
                <div className={styles['preference-group']}>
                  <button
                    type="button"
                    onClick={() => handleGiftTypeToggle('Experience')}
                    className={
                      profileInput &&
                      profileInput.giftPreferences.findIndex(
                        (g) => g.toLowerCase() === 'experience'
                      ) > -1
                        ? styles['gift-type-active']
                        : ''
                    }
                  >
                    Experiences
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGiftTypeToggle('Present')}
                    className={
                      profileInput &&
                      profileInput.giftPreferences.findIndex(
                        (g) => g.toLowerCase() === 'present'
                      ) > -1
                        ? styles['gift-type-active']
                        : ''
                    }
                  >
                    Presents
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGiftTypeToggle('Donation')}
                    className={
                      profileInput &&
                      profileInput.giftPreferences.findIndex(
                        (g) => g.toLowerCase() === 'donation'
                      ) > -1
                        ? styles['gift-type-active']
                        : ''
                    }
                  >
                    Donations
                  </button>
                </div>
              </div>
              <br />

              {/* <div>
            <label htmlFor="giftcost">Gift Cost</label>
            <select
              id="giftcost"
              value={profile.giftCost}
              onChange={(e) =>
                setProfile({ ...profile, giftCost: e.target.value })
              }
            >
              <option disabled></option>
              <option value="Low">$ - Low</option>
              <option value="Medium">$$ - Medium</option>
              <option value="High">$$$ - High</option>
            </select>
          </div> */}

              <button
                onClick={submitHandler}
                className={styles['profile-submit-button']}
                disabled={isSubmitting}
              >
                Confirm
              </button>
            </form>
            <ToastContainer className={styles['toast-container']} />
          </div>
        )}
      </section>
    </>
  );
}

export default UpdateFriendPage;
