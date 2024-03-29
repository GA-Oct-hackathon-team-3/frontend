import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import * as friendsService from '../../utilities/friends-service';
import {
  profileFormValidation,
  profileDobValidation,
} from '../../utilities/helpers';

import Header from '../../components/Header';

import profileImage from '../../assets/images/profileForm/manHoldingBaby.png';

import { BsArrowLeft } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { Box, MenuItem, Select } from '@mui/material';

import styles from '../../styles/ProfileForm.module.css';

function CreateFriend() {
  const navigate = useNavigate();

  const [validationMessage, setValidationMessage] = useState('');
  const [displayFile, setDisplayFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [buttonHTML, setButtonHTML] = useState('Add profile photo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    dob: '',
    gender: '',
    location: '',
    giftPreferences: [],
    giftCost: '',
  });

  const fileInputRef = useRef(null);

  const handleGiftTypeToggle = (type) => {
    const newGiftTypes = profile.giftPreferences.includes(type)
      ? profile.giftPreferences.filter((t) => t !== type)
      : [...profile.giftPreferences, type];
    setProfile({ ...profile, giftPreferences: newGiftTypes });
  };

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

  const handleFormMessage = (string) => {
    setIsSubmitting(false);

    // handles scrolling to top to display message with various reasons for why form is not valid for submit
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return setValidationMessage(string);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setValidationMessage('');

    const validDate = profileDobValidation(profile.dob);
    const valid = profileFormValidation(profile);
    if (!validDate)
      return handleFormMessage('Date of birth cannot be in the future');
    if (!valid) return handleFormMessage('Required fields are marked with (*)');

    try {
      const friendData = await friendsService.createFriend(profile);
      if (uploadedFile) {
        const photoResponse = await friendsService.uploadPhoto(
          friendData._id,
          uploadedFile
        );
        if (!photoResponse.ok)
          toast.error('Failed to upload photo. Please try again.');
      }

      if (friendData) {
        toast.info('Creating friend...', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate('/friend/' + friendData._id + '/tag');
        }, 2300);
      }
    } catch (error) {
      toast.error('Failed to create friend. Please try again');
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header />
      <section className={styles['profile-container']}>
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
                <h1>Create Friend Profile</h1>
                {displayFile ? (
                  <img src={displayFile} alt="Uploaded" />
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
                  type="file"
                  name="photo"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".jpg,.jpeg,.svg,.tiff,.bmp,.png,.webp"
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
              <label htmlFor="name" style={{ paddingTop: '10px' }}>
                Name *
              </label>
              <input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
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
                  value={profile.dob}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setProfile({ ...profile, dob: e.target.value })
                  }
                />
              </div>
              <br />
              <Box className={styles['form-group']}>
                <label htmlFor="gender">Gender *</label>
                <Select
                  id="gender"
                  value={profile.gender}
                  onChange={(e) =>
                    setProfile({ ...profile, gender: e.target.value })
                  }
                  className={styles['selector']}
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
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
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
                    profile.giftPreferences.findIndex(
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
                    profile.giftPreferences.findIndex(
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
                    profile.giftPreferences.findIndex(
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
              Continue to Tags
            </button>
          </form>
          <ToastContainer className={styles['toast-container']} />
        </div>
      </section>
    </>
  );
}

export default CreateFriend;
