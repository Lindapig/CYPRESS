import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../services/questionService";
import { isLoggedIn } from "../../../services/userService";

// Component for the Answers page
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, handleUpdateQuestion, handleComment }) => {
    const [question, setQuestion] = useState({});
    const [usrn, setUsrn] = useState("");
    const [content, setContent] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionById(qid);
            setQuestion(res || {});
        };
        fetchData().catch((e) => console.log(e));
    }, [qid]);
    // grad username using login status
    
    useEffect(() => {
        const checkPermission = async () => {
            const loginStatus = await isLoggedIn();
            console.log(loginStatus.username);
            console.log(question.asked_by);
            if (loginStatus && loginStatus.username === question.asked_by) {
                setContent(
                    <button
                        className="bluebtn ansButton"
                        // only trigger the function when the button is clicked
                        // onClick={handleUpdateQuestion(question._id)}
                        onClick={() => handleUpdateQuestion(question._id)}
                    >
                        Modify Question
                    </button>
                );
            } else {
                setContent(null); 
            }
        };

        if (question && question.asked_by) {
            checkPermission().catch(console.error);
        }
    }, [question, handleUpdateQuestion]);

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

    return (
        <>
            <AnswerHeader
                ansCount={
                    question && question.answers && question.answers.length
                }
                title={question && question.title}
                handleNewQuestion={handleNewQuestion}
            />
            <QuestionBody
                q = {question}
                qid = {qid}
                comCount = {question && question.comments && question.comments.length}
                views={question && question.views}
                text={question && question.text}
                askby={question && question.asked_by}
                meta={question && getMetaData(new Date(question.ask_date_time))}
                handleComment={handleComment}
                usrn={usrn}
            />
            {question &&
                question.answers &&
                question.answers.map((a, idx) => (
                    <Answer
                        key={idx}
                        a = {a}
                        aid = {a && a._id}
                        comCount = {a && a.comments && a.comments.length}
                        text={a.text}
                        ansBy={a.ans_by}
                        meta={getMetaData(new Date(a.ans_date_time))}
                        handleComment={handleComment}
                        usrn={usrn}
                    />
                ))}
            
            <div>
                {content}
            </div>
            <button
                className="bluebtn ansButton"
                onClick={() => {
                    handleNewAnswer();
                }}
            >
                Answer Question
            </button>
            
        </>
    );
};

export default AnswerPage;
