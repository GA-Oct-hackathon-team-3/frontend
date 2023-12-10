import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import { useNavigate, useLocation } from "react-router-dom";

import { BsArrowLeft } from "react-icons/bs";
import * as profilesService from "../../utilities/profiles-service";
import { profileFormValidation, profileDobValidation, getTimezones } from "../../utilities/helpers";

import styles from "../../styles/ProfileForm.module.css";
import { ToastContainer, toast } from "react-toastify";
import { Box, MenuItem, Select } from "@mui/material";


const UpdateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [validationMessage, setValidationMessage] = useState('');
  const [profileInput, setProfileInput] = useState(null);
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState([]);
  const [displayFile, setDisplayFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [buttonHTML, setButtonHTML] = useState("Add profile photo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileInfo = await profilesService.getProfile();
      setProfileInput(profileInfo.profile);
      if (profileInfo.profile.photo) {
        const uniqueTimestamp = Date.now();
        const profilePhoto = profileInfo.profile.photo ? `${profileInfo.profile.photo}?timestamp=${uniqueTimestamp}` : "https://i.imgur.com/hCwHtRc.png";
        setDisplayFile(profilePhoto);
        setButtonHTML("Change Photo");
      }
      setInterests([...profileInfo.profile.interests]);
    };
    fetchProfile();
  }, []);

  const handleFormMessage = (string) => {
    setIsSubmitting(false);
    
    // handles scrolling to top to display message with various reasons for why form is not valid for submit
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return setValidationMessage(string);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setValidationMessage('');

    // form validations
    const validDate = profileDobValidation(profileInput.dob);
    const valid = profileFormValidation(profileInput);
    if (!validDate) return handleFormMessage('Date of birth cannot be in the future');
    if (!valid) return handleFormMessage('Required fields are marked with (*)');

    // pass in interests and profileInput 
    const response = await profilesService.updateUserProfile(profileInput, interests);
    if (uploadedFile) {
      const photoResponse = await profilesService.uploadPhoto(uploadedFile);
      if (!photoResponse.ok) toast.error('Failed to upload photo. Please try again.');
    }
    if (response.message === 'User profile updated') {
        toast.info('Updating profile...', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });

          setTimeout(() => { navigate('/profile', { state: { path: location.pathname }}) }, 2000);
    }
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
      setButtonHTML("Change Photo");
    } else {
      setDisplayFile(null);
      setUploadedFile(null);
      setButtonHTML("Add Photo");
    }
  }

  const handleAddInterest = () => {
    if (interestInput && !interests.includes(interestInput.toLowerCase())) {
      setInterests((prev) => [...prev, interestInput.toLowerCase()]);
    }
    setInterestInput('');
  };

  const handleRemoveInterest = (e, interestToRemove) => {
    e.preventDefault();
    setInterests((prevInterests) => prevInterests.filter(interest => interest !== interestToRemove));
  }

  return (
    <>
      <Header />
      <section className={styles["user-profile-container"]}>
        <div className={styles["content-container"]}>
        <div className={styles["back-button"]}>
          <p onClick={() => navigate(-1)}>
            <BsArrowLeft />
          </p>
        </div>
        <form onSubmit={submitHandler} encType="multipart/form-data" className={styles["form-container"]}>
          <div className={styles["photo-group"]}>
            <div className={styles["photo-form-group"]}>
                <h1>My Profile</h1>
                {displayFile ? (
                <img
                    src={`${displayFile}`}
                    alt="Uploaded"
                    style={{ height: "80px", width: "80px", paddingBottom: "6px" }}
                />
                ) : (
                <label htmlFor="image" className={styles["add-image"]} onChange={handleAddPhotoClick}>
                    +
                </label>
                )}
                <input
                type="file"
                name="photo"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".jpg,.jpeg,.svg,.tiff,.bmp,.png,.webp"
                />
                <p onClick={handleAddPhotoClick}>{buttonHTML}</p>
            </div>
          </div>
          <br />
          <p>{validationMessage ? validationMessage : ''}</p>
          <div className={styles["form-group"]}>
            <label htmlFor="name" style={{ paddingTop: '10px' }}>Name *</label>
            <input
              id="name"
              value={profileInput && profileInput.name}
              maxLength={30}
              onChange={(e) =>
                setProfileInput({ ...profileInput, name: e.target.value })
              }
            />
          </div>
          <br />
          <div className={styles["form-group"]}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={profileInput && profileInput.bio}
              maxLength={150}
              onChange={(e) =>
                setProfileInput({ ...profileInput, bio: e.target.value })
              }
            />
          </div>
          <br />

          <div className={styles["form-select-group"]}>
          <div className={styles["form-group"]}>
              <label htmlFor="dob">Date of Birth *</label>
              <input
                type="date"
                id="dob"
                value={profileInput && profileInput.dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) =>
                  setProfileInput({
                    ...profileInput,
                    dob: e.target.value
                  })
                }
              />
            </div>
            <br />
            <Box className={styles["form-group"]}>
              <label htmlFor="gender">Gender</label>
              <Select
                id="gender"
                value={profileInput && profileInput.gender}
                onChange={(e) =>
                  setProfileInput({ ...profileInput, gender: e.target.value })
                }
                className={styles["selector"]}
              >
                <MenuItem disabled></MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </Box>
            <br />
          <Box className={styles["form-group"]}>
          <label htmlFor="timezone">Timezone</label>
          <Select 
          id="timezone" 
          value={(profileInput && profileInput.timezone) || 'UTC'} 
          className={styles['selector']}
          onChange={(e)=> setProfileInput({...profileInput, timezone: e.target.value})}
          >
            {
              getTimezones().map((tz, index) => {
                return (
                  <MenuItem value={tz} key={index} >{tz.replace(/_/g, ' ')}</MenuItem>
                );
              })
            }
          </Select>
          </Box>
          <br />
          <div className={styles["form-group"]}>
            <input
                type="text"
                name="interests"
                placeholder="Type to add interests"
                value={interestInput}
                onChange={(e)=> setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAddInterest()}
                }}
            />
          </div>
          <br />
          <div className={styles['interest-group']}>
            {interests && interests.length > 0
                ? interests.map((interest, index) => (
                    <button
                    className={styles['interest-button']}
                      onClick={(e) => handleRemoveInterest(e, interest)}
                      key={index}
                    >
                      {interest}
                    </button>
                  ))
                : ''}
          </div>
          </div>
          <br />
          <br />
          <button onClick={submitHandler} className={styles["profile-submit-button"]} disabled={isSubmitting}>Confirm</button>
        </form>
        <ToastContainer className={styles['toast-container']} />
        </div>
      </section>
    </>
  );
};

export default UpdateProfile;

