import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BsArrowLeft } from "react-icons/bs";
import * as friendsService from "../../utilities/friends-service";
import {
  profileFormValidation,
  profileDobValidation,
} from "../../utilities/helpers";

import Header from "../../components/Header/Header";

import styles from "../../styles/CreateFriendPage.module.css";
import { Box, MenuItem, Select } from "@mui/material";

function CreateFriendProfile() {
  const navigate = useNavigate();

  const [validationMessage, setValidationMessage] = useState("");
  const [displayFile, setDisplayFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [buttonHTML, setButtonHTML] = useState("Add profile photo");
  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    gender: "",
    location: "",
    giftPreferences: [],
    giftCost: "",
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
      setButtonHTML("Change photo");
    } else {
      setDisplayFile(null);
      setUploadedFile(null);
      setButtonHTML("Add profile photo");
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const validDate = profileDobValidation(profile.dob);
    const valid = profileFormValidation(profile);
    if (!validDate) {
      setValidationMessage("Date of birth cannot be in the future");
      return;
    }
    if (!valid) {
      toast.error("Submission failed. See required fields.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      setTimeout(() => {
        setValidationMessage("Required fields are marked with (*)");
      }, 2300);
      return;
    }

    try {
      const friendData = await friendsService.createFriend(profile);
      if (uploadedFile) {
        try {
          const response = await friendsService.uploadPhoto(
            friendData._id,
            uploadedFile
          );
          if (response.ok && friendData) {
            toast.info("Creating friend..", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1500,
            });

            setTimeout(() => {
              navigate("/friend/" + friendData._id + "/tag");
            }, 2300);
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (friendData) {
        if (!uploadedFile) {
          toast.info("Creating friend..", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500,
          });
        }

        setTimeout(() => {
          navigate("/friend/" + friendData._id + "/tag");
        }, 2300);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className={styles["create-profile-container"]}>
        <div>
          <p onClick={() => navigate(-1)}>
            <BsArrowLeft />
          </p>
          <h1>Create Friend Profile</h1>
        </div>

        <form onSubmit={submitHandler} encType="multipart/form-data">
          <div>
            {displayFile ? (
              <img
                src={displayFile}
                alt="Uploaded"
                style={{ height: "80px", width: "80px", paddingBottom: "6px" }}
              />
            ) : (
              <label
                htmlFor="image"
                className={styles["add-image"]}
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
              style={{ display: "none" }}
            />
            <p onClick={handleAddPhotoClick}>{buttonHTML}</p>
          </div>
          <br />
          {validationMessage ? validationMessage : ""}
          <div>
            <label htmlFor="name" style={{ paddingTop: 10 }}>
              Name *{" "}
            </label>
            <input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <br />

          <div>
            <div>
              <label htmlFor="dob">Date of Birth *</label>
              <input
                type="date"
                id="dob"
                value={profile.dob}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
              />
            </div>

            <Box sx={{ minWidth: "120px" }}>
              <label htmlFor="gender">Gender *</label>
              <Select
                id="gender"
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
                className={styles["selector"]}
              >
                <MenuItem disabled></MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </Box>
          </div>
          <br />

          <div>
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

          <div>
            <p>Gift type Preferences (choose all that apply)</p>
            <div>
              <button
                type="button"
                onClick={() => handleGiftTypeToggle("Experience")}
                className={
                  profile.giftPreferences.findIndex(
                    (g) => g.toLowerCase() === "experience"
                  ) > -1
                    ? styles["gift-type-active"]
                    : ""
                }
              >
                Experiences
              </button>
              <button
                type="button"
                onClick={() => handleGiftTypeToggle("Present")}
                className={
                  profile.giftPreferences.findIndex(
                    (g) => g.toLowerCase() === "present"
                  ) > -1
                    ? styles["gift-type-active"]
                    : ""
                }
              >
                Presents
              </button>
              <button
                type="button"
                onClick={() => handleGiftTypeToggle("Donation")}
                className={
                  profile.giftPreferences.findIndex(
                    (g) => g.toLowerCase() === "donation"
                  ) > -1
                    ? styles["gift-type-active"]
                    : ""
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
          <br />

          <button onClick={submitHandler}>Continue to add tags</button>
        </form>

        <ToastContainer className={styles["toast-container"]} />
      </div>
    </>
  );
}

export default CreateFriendProfile;
