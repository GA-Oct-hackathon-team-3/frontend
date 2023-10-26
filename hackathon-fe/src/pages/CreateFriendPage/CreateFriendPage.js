import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BsArrowLeft } from "react-icons/bs";
import * as friendsService from "../../utilities/friends-service";

import Header from "../../components/Header/Header";

import styles from "./CreateFriendPage.module.css";

function CreateFriendProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    gender: "",
    location: "",
    giftTypePreferences: [],
    giftCost: ""
  });

  const handleGiftTypeToggle = (type) => {
    const newGiftTypes = profile.giftTypePreferences.includes(type)
      ? profile.giftTypePreferences.filter((t) => t !== type)
      : [...profile.giftTypePreferences, type];
    setProfile({ ...profile, giftTypePreferences: newGiftTypes });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const friendData = await friendsService.createFriend(profile);
      console.log("friend succesfully created", friendData);
      // navigate("/friends");
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

        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="image" className={styles["add-image"]}></label>
            <input type="file" id="image" hidden />
            <p>Add profile photo</p>
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
