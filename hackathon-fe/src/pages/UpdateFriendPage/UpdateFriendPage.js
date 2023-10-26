import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { BsArrowLeft } from "react-icons/bs";
import * as friendsService from "../../utilities/friends-service";
import { splitDOB } from "../../utilities/helpers";

import Header from "../../components/Header/Header";

import styles from "../CreateFriendPage/CreateFriendPage.module.css";

function UpdateFriendPage () {
  const navigate = useNavigate();
  const { id } = useParams();

  const [friend, setFriend] = useState(null); 
  const [profileInput, setProfileInput] = useState(null);
  const [dobObject, setDobObject] = useState(null);

  useEffect(() => {
    const fetchFriend = async () => {
      const friendInfo = await friendsService.showFriend(id);
      setFriend(friendInfo);
      setProfileInput({
        ...friendInfo
      });
    }
    fetchFriend();
  }, [id]);


  const handleGiftTypeToggle = (type) => {
    const newGiftTypes = profileInput.giftPreferences.includes(type)
      ? profileInput.giftPreferences.filter((t) => t !== type)
      : [...profileInput.giftPreferences, type];
    setProfileInput({ ...profileInput, giftPreferences: newGiftTypes });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await friendsService.updateFriend(id, profileInput);
    if (response.message === 'Friend updated') navigate((-1));

  };

  return (
    <>
      <Header />
      <div className={styles["create-profile-container"]}>
        <div>
          <p onClick={() => navigate(-1)}>
            <BsArrowLeft />
          </p>
          <h1>Edit Friend Profile</h1>
        </div>

        <form onSubmit={submitHandler}>
          <div>
            { profileInput && profileInput.photo }
            <label htmlFor="image" className={styles["add-image"]}></label>
            <input type="file" id="image" hidden />
            <p>Add profile photo</p>
          </div>
          <br />

          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={profileInput && profileInput.name}
              onChange={(e) => setProfileInput({ ...profileInput, name: e.target.value })}
            />
          </div>
          <br />

          <div>
            <div>
              <label htmlFor="dob">DOB</label>
              <input
                type="date"
                id="dob"
                value={profileInput && profileInput.dob}
                onChange={(e) =>
                  setProfileInput({ ...profileInput, dob: e.target.value })
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

          <div>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              value={profileInput && profileInput.location}
              onChange={(e) =>
                setProfileInput({ ...profileInput, location: e.target.value })
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

          <button onClick={submitHandler}>Confirm</button>
        </form>
      </div>
    </>
  );
}

export default UpdateFriendPage;
