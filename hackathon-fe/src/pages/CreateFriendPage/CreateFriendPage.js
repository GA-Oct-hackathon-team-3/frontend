import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { BsArrowLeft } from "react-icons/bs";
import * as friendsService from "../../utilities/friends-service";

import Header from "../../components/Header/Header";

import styles from "./CreateFriendPage.module.css";

function CreateFriendProfile() {
  const navigate = useNavigate();

  const [displayFile, setDisplayFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [buttonHTML, setButtonHTML] = useState('Add profile photo');
  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    gender: "",
    location: "",
    giftPreferences: [],
    giftCost: ""
  });

  const fileInputRef = useRef(null);

  const handleGiftTypeToggle = (type) => {
    const newGiftTypes = profile.giftPreferences.includes(type)
      ? profile.giftPreferences.filter((t) => t !== type)
      : [...profile.giftPreferences, type];
    setProfile({ ...profile, giftPreferences: newGiftTypes });
  };

    function handleAddPhotoClick (evt) {
        evt.preventDefault();
        fileInputRef.current.click();
    }

    function handleFileChange (evt) {
        // assigns file upload to display image, adds file to state for form submit, and toggles button HTML
        const file = evt.target.files[0];
        if (file) {
            setDisplayFile(URL.createObjectURL(file));
            setUploadedFile(file);
            setButtonHTML('Change photo upload');
        } else {
            setDisplayFile(null);
            setUploadedFile(null);
            setButtonHTML('Add profile photo');
        } 
    }



  

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      const friendData = await friendsService.createFriend(profile);
      if (uploadedFile) {
        try {
            const response = await friendsService.uploadPhoto(friendData._id, uploadedFile);
            if (response.ok && friendData) navigate("/friends");
        } catch (error) {
            console.log(error);
        }
      }
      if (friendData) navigate("/friends");
    } catch (error) {
      console.log(error);
    }

    // navigate("/addtags")
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
                { displayFile ? (
                    <img src={displayFile} alt="Uploaded" style={{ height: '80px', width: '80px', paddingBottom: '6px' }}/>
                ) : (
                    <label htmlFor="image" className={styles["add-image"]} >+</label>
                )}
                <input type="file" name="photo" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <button onClick={handleAddPhotoClick}>{buttonHTML}</button>
          </div>
          <br />

          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <br />

          <div>
            <div>
              <label htmlFor="dob">DOB</label>
              <input
                type="date"
                id="dob"
                value={profile.dob}
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
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
                onClick={() => handleGiftTypeToggle("Present")}
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => handleGiftTypeToggle("Experience")}
              >
                Experience
              </button>
              <button
                type="button"
                onClick={() => handleGiftTypeToggle("Donation")}
              >
                Donation
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
      </div>
    </>
  );
}

export default CreateFriendProfile;
