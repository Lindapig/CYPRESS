import { useState, useEffect } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import "./index.css";
import { validateHyperlink } from "../../../tool";

import { addQuestion, updateQuestionById, getQuestionByIdPure } from "../../../services/questionService";
import { isLoggedIn } from "../../../services/userService";

const NewQuestion = ({ handleQuestions, qid }) => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [tag, setTag] = useState("");
    const [usrn, setUsrn] = useState("");

    const [titleErr, setTitleErr] = useState("");
    const [textErr, setTextErr] = useState("");
    const [tagErr, setTagErr] = useState("");
    // const [usrnErr, setUsrnErr] = useState("");

    (async () => {
        const loginStatus = await isLoggedIn();
        // console.log(loginStatus.username);
        if (loginStatus && loginStatus.username) {
            setUsrn(loginStatus.username);
        }  else {
            window.location.reload(); 
        }
    })();

    // if (qid) {
    //     // // Fetch question details
    //     // (async () => {
    //     //     const res = await getQuestionById(qid);
    //     //     if (res && res.title) {
    //     //         setTitle(res.title);
    //     //         setText(res.text);
    //     //         // setTag(res.tags.join(" "));
    //     //     }
    //     // }
    //     // )();
        
    // }

    useEffect(() => {
        if (qid) {
            const fetchQuestion = async () => {
                try {
                    const res = await getQuestionByIdPure(qid);
                    if (res) {
                        setTitle(res.title);
                        setText(res.text);
                        // Assume tags is an array of strings
                        setTag(res.tags.join(" "));
                    }
                } catch (e) {
                    console.log(e);
                    // Handle error appropriately
                }
            };
            
            fetchQuestion();
        }
    }, [qid]);

    const postQuestion = async () => {
        let isValid = true;
        if (!title) {
            setTitleErr("Title cannot be empty");
            isValid = false;
        } else if (title.length > 100) {
            setTitleErr("Title cannot be more than 100 characters");
            isValid = false;
        }

        if (!text) {
            setTextErr("Question text cannot be empty");
            isValid = false;
        }

        // Hyperlink validation
        if (!validateHyperlink(text)) {
            setTextErr("Invalid hyperlink format.");
            isValid = false;
        }
        if (qid && isValid) {
            const question = {
                title: title,
                text: text,
            };
            await updateQuestionById(qid, question);
            console.log("Question updated");
            handleQuestions();
        }
        let tags = tag.split(" ").filter((tag) => tag.trim() !== "");
        if (tags.length === 0) {
            setTagErr("Should have at least 1 tag");
            isValid = false;
        } else if (tags.length > 5) {
            setTagErr("Cannot have more than 5 tags");
            isValid = false;
        }

        for (let tag of tags) {
            if (tag.length > 20) {
                setTagErr("New tag length cannot be more than 20");
                isValid = false;
                break;
            }
        }

        // if (!usrn) {
        //     setUsrnErr("Username cannot be empty");
        //     isValid = false;
        // }

        if (!isValid) {
            return;
        }

        const question = {
            title: title,
            text: text,
            tags: tags,
            asked_by: usrn,
            ask_date_time: new Date(),
        };

        // const res = await addQuestion(question);
        if (qid) {
            await updateQuestionById(qid, question);
        } else {
            await addQuestion(question);
        }
        // if (res && res._id) {
        //     handleQuestions();
        // }
        handleQuestions();
    };
    if (qid) return (
        <Form>
            <Input
                title={"Question Title"}
                hint={"Limit title to 100 characters or less"}
                id={"formTitleInput"}
                val={title}
                setState={setTitle}
                err={titleErr}
            />
            <Textarea
                title={"Question Text"}
                hint={"Add details"}
                id={"formTextInput"}
                val={text}
                setState={setText}
                err={textErr}
            />
            
            <div className="username-section">
                <div className="username-label">Username</div>
                <div className="username-display">{usrn}</div>
            </div>

            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        postQuestion();
                    }}
                >
                    Change Question
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );

    return (
        <Form>
            <Input
                title={"Question Title"}
                hint={"Limit title to 100 characters or less"}
                id={"formTitleInput"}
                val={title}
                setState={setTitle}
                err={titleErr}
            />
            <Textarea
                title={"Question Text"}
                hint={"Add details"}
                id={"formTextInput"}
                val={text}
                setState={setText}
                err={textErr}
            />
            <Input
                title={"Tags"}
                hint={"Add keywords separated by whitespace"}
                id={"formTagInput"}
                val={tag}
                setState={setTag}
                err={tagErr}
            />
            <div className="username-section">
                <div className="username-label">Username</div>
                <div className="username-display">{usrn}</div>
            </div>

            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        postQuestion();
                    }}
                >
                    Post Question
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default NewQuestion;
