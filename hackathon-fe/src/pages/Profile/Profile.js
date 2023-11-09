import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

import { BsArrowLeft } from "react-icons/bs";
import * as profilesService from "../../utilities/profiles-service";
import { profileFormValidation, profileDobValidation } from "../../utilities/helpers";

import styles from "../../styles/CreateFriendPage.module.css";

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
      <div className={styles["create-profile-container"]}>
        <div>
          <p onClick={() => navigate(-1)}>
            <BsArrowLeft />
          </p>
          <h1>My Profile</h1>
          <button onClick={logOutHandler}>Log Out</button>
        </div>
        <form onSubmit={submitHandler} encType="multipart/form-data">
          <div>
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
            />
            <p onClick={handleAddPhotoClick}>{buttonHTML}</p>
          </div>
          <br />
          {validationMessage ? validationMessage : ''}
          <div>
            <label htmlFor="name" style={{paddingTop: 10}}>Name *</label>
            <input
              id="name"
              value={profileInput && profileInput.name}
              onChange={(e) =>
                setProfileInput({ ...profileInput, name: e.target.value })
              }
            />
          </div>
          <br />

          <div>
            <div>
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
            <div>
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                value={profileInput && profileInput.gender}
                onChange={(e) =>
                  setProfileInput({ ...profileInput, gender: e.target.value })
                }
              >
                <option disabled></option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <br />
          <br />
          <button onClick={submitHandler}>Confirm</button>
        </form>
      </div>
    </>
  );
};

export default Profile;

