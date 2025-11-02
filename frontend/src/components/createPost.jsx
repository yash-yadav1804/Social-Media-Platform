import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !image) return;

    const formData = new FormData();
    if (content) formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setContent("");
      setImage(null);
      if (onPostCreated) onPostCreated(); // Refresh posts
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-2"
        />
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-2"
        />
        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            type="submit"
            disabled={loading || (!content && !image)}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
};

export default CreatePost;
