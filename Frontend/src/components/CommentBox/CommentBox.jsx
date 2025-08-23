import React, { useState } from "react";
import styles from "./CommentBox.module.css";

const CommentBox = ({ onAddComment }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onAddComment(text);
      setText("");
    }
  };

  return (
    <div className={styles.commentBox}>
      <textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>Post Comment</button>
    </div>
  );
};

export default CommentBox;
