import { handleHyperlink } from "../../../../tool";
import "./index.css";
import { useEffect, useState } from "react";
import { clickLike, clickDislike } from "../../../../services/likeService";

// Component for the Answer Page
const Answer = ({ a, aid, comCount, text, ansBy, meta, handleComment, usrn }) => {
    const [likeCount, setLikeCount] = useState(a && a.likes ? a.likes.length : 0);

    useEffect(() => {
        // This effect will run every time `a.likes` changes
        if (a && a.likes) {
            setLikeCount(a.likes.length);
        }
    }, [a.likes]); // Dependency array includes `a.likes`

    const [likedByCurrentUser, setLikedByCurrentUser] = useState(a && a.likes && a.likes.includes(usrn));
    useEffect(() => {
        if (a && a.likes) {
            setLikedByCurrentUser(a.likes.includes(usrn));
        }
    }, [a.likes, usrn]);

    const like = async () => {
        if (!likedByCurrentUser) { // Only allow clicking if not already liked
            const res = await clickLike(aid, "answer", usrn);
            setLikeCount(res && res.likes && res.likes.length);
            setLikedByCurrentUser(true);
        }
    };

    const dislike = async () => {
        if (likedByCurrentUser) { // Only allow clicking if not already liked
            const res = await clickDislike(aid, "answer", usrn);
            setLikeCount(res && res.likes && res.likes.length);
            setLikedByCurrentUser(false);
        }
        
    };

    comCount = comCount || 0;
    return (
        <div className="answer right_padding">
            <div id="answerText" className="answerText">
                {handleHyperlink(text)}
            </div>
            <div className="answerAuthor">
                <div className="answer_author">{ansBy}</div>
                <div className="answer_question_meta">{meta}</div>
            </div>
            <div>
                <button id = "like" className={`likeBtn ${ likedByCurrentUser? 'liked' : ''}`} onClick={like}>
                    Like {likeCount}
                </button>
                <button onClick={dislike}>
                    Dislike
                </button>
                <button
                    className=""
                    onClick={() => {
                        handleComment(aid, "answer");
                    }}
                >
                    Comment {comCount}
                </button>
            </div>
        </div>
    );
};

export default Answer;
