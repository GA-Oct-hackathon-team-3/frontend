import { Link, useNavigate } from "react-router-dom";

import styles from "./CreateFriendPage.module.css";

const CreateFriendPage = () => {
    const navigate = useNavigate();
    return (
        <section className={styles["create-friend-container"]}>
            <h2>Add a friend pg</h2>
            <button onClick={() => navigate(-1)}>go back</button>
        </section>
    );
};

export default CreateFriendPage;