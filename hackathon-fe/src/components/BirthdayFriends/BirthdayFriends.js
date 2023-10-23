import dummydata from "../../dummydata";
import ShowFriend from "../ShowFriend/ShowFriend";

import styles from "./BirthdayFriends.module.css";

const BirthdayFriends = () => {
    return (
        <div>
            {dummydata.map(data => <ShowFriend friend={data}/>)}
        </div>
    );
};

export default BirthdayFriends;