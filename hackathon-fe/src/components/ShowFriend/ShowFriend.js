import React from 'react';

const ShowFriend = ({friend}) => {

    return (
        <div>
            <h2>Hi, {friend.firstName}</h2>
        </div>
    );
};

export default ShowFriend;