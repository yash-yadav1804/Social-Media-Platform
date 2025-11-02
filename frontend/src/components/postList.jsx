import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import axios from "axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/comments`,
        { text: commentText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentText("");
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <Card key={post._id} className="mb-3">
          <Card.Body>
            <Card.Title>{post.userId?.username}</Card.Title>
            {post.content && <Card.Text>{post.content}</Card.Text>}
            {post.image && (
              <img
                src={`http://localhost:5000${post.image}`}
                alt="Post"
                style={{ maxWidth: "100%" }}
              />
            )}
            <div className="mt-2">
              <Button variant="link" onClick={() => handleLike(post._id)}>
                Like ({post.likes?.length || 0})
              </Button>
              <Button variant="link">
                Comments ({post.comments?.length || 0})
              </Button>
            </div>

            {/* Comments Section */}
            <div className="mt-3">
              {post.comments?.map((comment, index) => (
                <div key={index} className="mb-2">
                  <strong>{comment.username}: </strong>
                  {comment.text}
                </div>
              ))}

              <Form.Group className="mt-2">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => handleComment(post._id)}
                >
                  Comment
                </Button>
              </Form.Group>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default PostList;
