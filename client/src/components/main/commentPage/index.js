import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import CommentHeader from "./header";
import Comment from "./comment";
import "./index.css";
import { getQuestionByIdPure } from "../../../services/questionService";
import { getAnswerById } from "../../../services/answerService";
import { isLoggedIn } from "../../../services/userService";
// Component for the Answers page
const CommentPage = ({ id, type, handleNewComment }) => {
    const [item, setItem] = useState({});
    const [usrn, setUsrn] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            let res;
            if (type === "question") {
                res = await getQuestionByIdPure(id);
            } else if (type === "answer") {
                res = await getAnswerById(id);
            }
            setItem(res || {});
        };
    
        fetchData().catch(console.error);
    }, [id, type]);

    useEffect(() => {
        const checkPermission = async () => {
            const loginStatus = await isLoggedIn();
            if (loginStatus && loginStatus.username) {
                setUsrn(loginStatus.username);
            }  else {
                window.location.reload(); 
            }
        };

        checkPermission().catch(console.error);
    }, []);
    // console.log(item);
    return (
        <>
            <CommentHeader
                comCount={
                    item && item.comments && item.comments.length
                }
            />
            
                {item &&
                item.comments &&
                item.comments.map((c, idx) => (
                    <Comment
                        key={idx}
                        c = {c}
                        cid = {c && c._id}
                        text={c.text}
                        comby={c.com_by}
                        meta={getMetaData(new Date(c.com_date_time))}
                        usrn={usrn}
                    />
                ))}
            {/* <div>
                {content}
            </div> */}
            <button
                className="bluebtn ansButton"
                onClick={() => {
                    handleNewComment(id, type);
                }}
            >
                Post a Comment
            </button>
            
        </>
    );
};

export default CommentPage;
