import "./index.css";
import { useState } from "react";
import Form from "../baseComponents/form";
// import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../../tool";
import { addComment } from "../../../services/commentService";
import { isLoggedIn } from "../../../services/userService";

const NewComment = ({ id, type, handleComment }) => {
    const [usrn, setUsrn] = useState("");
    const [text, setText] = useState("");
    // const [usrnErr, setUsrnErr] = useState("");
    const [textErr, setTextErr] = useState("");

    (async () => {
        const loginStatus = await isLoggedIn();
        // console.log(loginStatus.username);
        if (loginStatus && loginStatus.username) {
            setUsrn(loginStatus.username);
        }  else {
            window.location.reload(); 
        }
    })();

    const postComment = async () => {
        let isValid = true;

        // if (!usrn) {
        //     setUsrnErr("Username cannot be empty");
        //     isValid = false;
        // }

        if (!text) {
            setTextErr("Comment text cannot be empty");
            isValid = false;
        }

        // Hyperlink validation
        if (!validateHyperlink(text)) {
            setTextErr("Invalid hyperlink format.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const comment = {
            text: text,
            com_by: usrn,
            com_date_time: new Date(),
        };
        const res = await addComment(id, type, comment);
        if (res && res._id) {
            handleComment(id, type);
        }
    };
    return (
        <Form>
            {/* <Input
                title={"Username"}
                id={"answerUsernameInput"}
                val={usrn}
                setState={setUsrn}
                err={usrnErr}
            /> */}
            <div className="username-section">
                <div className="username-label">Comment with username:</div>
                <div className="username-display">{usrn}</div>
            </div>
            <Textarea
                title={"Comment Text"}
                id={"commentTextInput"}
                val={text}
                setState={setText}
                err={textErr}
            />
            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        postComment();
                    }}
                >
                    Post Comment
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default NewComment;
