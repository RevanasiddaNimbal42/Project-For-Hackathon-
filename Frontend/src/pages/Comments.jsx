import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/api";

const Comments = () => {
  const { id } = useParams(); // artwork id
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/comments/${id}`,
        { text },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setText("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h3>Comments</h3>
      <form onSubmit={addComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>
      <ul>
        {comments.map((c) => (
          <li key={c._id}>
            <strong>{c.user.username || c.user.name}</strong>: {c.text}
            {c.user._id === localStorage.getItem("userId") && (
              <button onClick={() => deleteComment(c._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
