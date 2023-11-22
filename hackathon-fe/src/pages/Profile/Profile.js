import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

import { BsArrowLeft } from "react-icons/bs";
import * as profilesService from "../../utilities/profiles-service";
import { profileFormValidation, profileDobValidation, getUniqueTimezones, getTimezones } from "../../utilities/helpers";

import styles from "../../styles/ProfileForm.module.css";
import { Box, MenuItem, Select } from "@mui/material";


const Profile = () => {
  const navigate = useNavigate();
  
  const [validationMessage, setValidationMessage] = useState('');
  const [profileInput, setProfileInput] = useState(null);
  const [displayFile, setDisplayFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [buttonHTML, setButtonHTML] = useState("Add profile photo");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileInfo = await profilesService.getProfile();
      setProfileInput(profileInfo.profile);
      if (profileInfo.photo) {
        const uniqueTimestamp = Date.now();
        const profilePhoto = profileInfo.photo ? `${profileInfo.photo}?timestamp=${uniqueTimestamp}` : "https://i.imgur.com/hCwHtRc.png";
        setDisplayFile(profilePhoto);
        setButtonHTML("Change Photo");
      }
    };
    fetchProfile();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const validDate = profileDobValidation(profileInput.dob);
    const valid = profileFormValidation(profileInput);
    if (!validDate) {
        setValidationMessage('Date of birth cannot be in the future');
        return;
    }
    if (!valid) {
        setValidationMessage('Required fields are marked with (*)');
        return;
    }
    const response = await profilesService.updateUserProfile(profileInput);
    if (uploadedFile) {
      const photoResponse = await profilesService.uploadPhoto(uploadedFile);
      if (photoResponse.ok && response.message === "User details updated")
        navigate("/friends");
    }
    if (response.message === "User profile updated") navigate("/friends");
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
  const logOutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <Header />
      <section className={styles["profile-container"]}>
        <div className={styles["content-container"]}>
        <div className={styles["back-button"]}>
          <p onClick={() => navigate(-1)}>
            <BsArrowLeft />
          </p>
        </div>
          <button onClick={logOutHandler} className={styles["logout"]}>Log Out</button>
          <h1>My Profile</h1>
        <form onSubmit={submitHandler} encType="multipart/form-data" className={styles["form-container"]}>
          <div className={styles["photo-group"]}>
            <div className={styles["photo-form-group"]}>
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
              getTimezones().map(tz => {
                return (
                  <MenuItem value={tz}>{tz.replace(/_/g, ' ')}</MenuItem>
                );
              })
            }
          </Select>
          </Box>
          </div>
          <br />
          <br />
          <button onClick={submitHandler} className={styles["profile-submit-button"]}>Confirm</button>
        </form>
        </div>
      </section>
    </>
  );
};

export default Profile;

