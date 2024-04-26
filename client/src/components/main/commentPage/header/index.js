import "./index.css";

// Header for the Answer page
const CommentHeader = ({ comCount }) => {
    return (
        <div id="commentsHeader" className="space_between right_padding">
            <div className="bold_title">{comCount} comments</div>
        </div>
    );
};

export default CommentHeader;
