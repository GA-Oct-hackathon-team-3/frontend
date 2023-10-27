import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

import { BsArrowLeft } from "react-icons/bs";
import * as userService from "../../utilities/users-api";

import styles from "../CreateFriendPage/CreateFriendPage.module.css";

const Profile = () => {
  const navigate = useNavigate();

  const [profileInput, setProfileInput] = useState(null);
  const [displayFile, setDisplayFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [buttonHTML, setButtonHTML] = useState("Add profile photo");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileInfo = await userService.getProfile();
      console.log("profileInfo", profileInfo.user);
      setProfileInput({
        ...profileInfo.user
      });
      if (profileInfo.photo) {
        const uniqueTimestamp = Date.now();
        profileInfo.photo = `${profileInfo.photo}?timestamp=${uniqueTimestamp}`;
        setDisplayFile(profileInfo.photo);
        setButtonHTML("Change photo");
      }
    };
    fetchProfile();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    // const response = await friendsService.updateFriend(id, profileInput);
    // if (uploadedFile) {
    //   const photoResponse = await friendsService.uploadPhoto(id, uploadedFile);
    //   if (photoResponse.ok && response.message === "Friend updated")
    //     navigate(`/friend/${id}`);
    // }
    // if (response.message === "Friend updated") navigate(`/friend/${id}`);
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
      setButtonHTML("Change photo");
    } else {
      setDisplayFile(null);
      setUploadedFile(null);
      setButtonHTML("Add profile photo");
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
              <label htmlFor="image" className={styles["add-image"]}>
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
            <button onClick={handleAddPhotoClick}>{buttonHTML}</button>
          </div>
          <br />

          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={profileInput && profileInput.name}
              onChange={(e) =>
                setProfileInput({ ...profileInput, name: e.target.value })
              }
            />
            <div>
              <div>
                <label htmlFor="dob">DOB</label>
                <input
                  type="date"
                  id="dob"
                  value={profileInput && profileInput.dob.substring(0, 10)}
                  onChange={(e) =>
                    setProfileInput({
                      ...profileInput,
                      dob: e.target.value
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="gender">Gender</label>
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
          </div>
          <br />
          <button onClick={submitHandler}>Confirm</button>
          <button onClick={logOutHandler}>Log Out</button>
        </form>
      </div>
    </>
  );
};

export default Profile;
