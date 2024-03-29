import { useState } from "react";
import '../../styles/DeleteUserPage.css';
import {
  deleteUser,
  confirmDeleteUser,
  logOut,
} from "../../utilities/users-service";
import { useNavigate } from "react-router-dom";

const DeleteUser = () => {
    const navigate = useNavigate();

  const [confirmToken, setConfirmToken] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // State to control the visibility of the confirmation pop-up

  const handleDelete = async () => {
    // Logic to delete the user account
    try {
        const response = await deleteUser(); 
        if (response.confirmationToken) {
          setConfirmToken(response.confirmationToken);
          setShowConfirmPopup(true); // Show confirmation pop-up
        }
    } catch (error) {
        throw error;
    }
  };

  const confirmDelete = async () => {
    try {
        // Logic to confirm the user account deletion
        const response = await confirmDeleteUser(confirmToken);
    
        // Handle the response after confirmation
        setShowConfirmPopup(false); // Hide confirmation pop-up
        logOut();
        navigate("/");
    } catch (error) {
        throw error;
    }
  };

  const cancelDelete = () => {
    // Logic to handle cancellation of account deletion
    setShowConfirmPopup(false); // Hide confirmation pop-up
  };

  return (
    <div className="delete-account-container">
      <h1>Delete Your Account</h1>
      <p>
        Are you sure you want to delete your account? This action cannot be
        undone.
      </p>
      <textarea placeholder="Tell us why you're leaving (optional)"></textarea>
      <button onClick={handleDelete} className="delete-button">
        Delete My Account
      </button>

      {showConfirmPopup && (
        <div className="confirm-popup">
          <p>
            Are you sure you want to permanently delete your account? All your
            data will be lost.
          </p>
          <button onClick={confirmDelete} className="confirm-button">
            Yes, Delete My Account
          </button>
          <button onClick={cancelDelete} className="cancel-button">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteUser;
