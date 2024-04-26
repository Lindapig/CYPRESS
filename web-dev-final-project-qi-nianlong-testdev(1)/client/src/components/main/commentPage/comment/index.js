import React, { useEffect, useState } from 'react';
import { clickLike, clickDislike } from '../../../../services/likeService';
import { handleHyperlink } from '../../../../tool';
import './index.css';

const Comment = ({ c, cid, text, comBy, meta, usrn }) => {
    const [likeCount, setLikeCount] = useState(c && c.likes ? c.likes.length : 0);

    useEffect(() => {
        // This effect will run every time `c.likes` changes
        if (c && c.likes) {
            setLikeCount(c.likes.length);
        }
    }, [c.likes]); // Dependency array includes `c.likes`

    const [likedByCurrentUser, setLikedByCurrentUser] = useState(c && c.likes && c.likes.includes(usrn));
    useEffect(() => {
        if (c && c.likes) {
            setLikedByCurrentUser(c.likes.includes(usrn));
        }
    }, [c.likes, usrn]);
    
    const like = async () => {
        if (!likedByCurrentUser) { // Only allow clicking if not already liked
            const res = await clickLike(cid, "comment", usrn);
            setLikeCount(res && res.likes && res.likes.length);
            setLikedByCurrentUser(true);
        }
    };

    const dislike = async () => {
        if (likedByCurrentUser) { // Only allow clicking if not already liked
            const res = await clickDislike(cid, "comment", usrn);
            setLikeCount(res && res.likes && res.likes.length);
            setLikedByCurrentUser(false);
        }
        
    };
    return (
        <div className="answer right_padding">
            <div id="commentText" className="answerText">
                {handleHyperlink(text)}
            </div>
            <div className="answerAuthor">
                <div className="answer_author">{comBy}</div>
                <div className="answer_question_meta">{meta}</div>
            </div>
            <div>
                <button id = "like" className={`likeBtn ${likedByCurrentUser ? 'liked' : ''}`} onClick={like}>
                    Like {likeCount}
                </button>
                <button onClick={dislike}>
                    Dislike
                </button>
            </div>
        </div>
    );
};

export default Comment;
