import "./index.css";
import React from "react";
import { handleHyperlink } from "../../../../tool";
import { useEffect, useState } from "react";
import { clickLike, clickDislike } from "../../../../services/likeService";

// Component for the Question's Body
const QuestionBody = ({ q, qid, comCount, views, text, askby, meta, handleComment, usrn }) => {
    const [likeCount, setLikeCount] = useState(q && q.likes ? q.likes.length : 0);

    useEffect(() => {
        // This effect will run every time `q.likes` changes
        if (q && q.likes) {
            setLikeCount(q.likes.length);
        }
    }, [q.likes]); // Dependency array includes `q.likes`

    const [likedByCurrentUser, setLikedByCurrentUser] = useState(q && q.likes && q.likes.includes(usrn));
    useEffect(() => {
        if (q && q.likes) {
            setLikedByCurrentUser(q.likes.includes(usrn));
        }
    }, [q.likes, usrn]);
    
    const like = async () => {
        if (!likedByCurrentUser) { // Only allow clicking if not already liked
            const res = await clickLike(qid, "question", usrn);
            setLikeCount(res && res.likes && res.likes.length);
            setLikedByCurrentUser(true);
        }
    };

    const dislike = async () => {
        if (likedByCurrentUser) { // Only allow clicking if not already liked
            const res = await clickDislike(qid, "question", usrn);
            setLikeCount(res && res.likes && res.likes.length);
            setLikedByCurrentUser(false);
        }
        
    };
    comCount = comCount || 0;
    return (
        <div id="questionBody" className="questionBody right_padding">
            <div className="bold_title answer_question_view">{views} views</div>
            <div className="answer_question_text">{handleHyperlink(text)}</div>
            <div className="answer_question_right">
                <div className="question_author">{askby}</div>
                <div className="answer_question_meta">asked {meta}</div>
            </div>
            <div>
                <button id = "like" className={`likeBtn ${likedByCurrentUser ? 'liked' : ''}`} onClick={like}>
                    Like {likeCount}
                </button>
                <button onClick={dislike}>
                    Dislike
                </button>
                <button
                    className=""
                    onClick={() => {
                        handleComment(qid, "question");
                    }}
                >
                    Comment {comCount}
                </button>
            </div>
        </div>
    );
};

export default QuestionBody;
