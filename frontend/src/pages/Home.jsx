// frontend/pages/Home.jsx
import React from "react";
import { Container } from "react-bootstrap";
import CreatePost from "../components/createPost";
import PostList from "../components/postList";

const Home = () => {
  return (
    <Container>
      <h1 className="my-4">Social Feed</h1>
      <CreatePost />
      <PostList />
    </Container>
  );
};

export default Home;
