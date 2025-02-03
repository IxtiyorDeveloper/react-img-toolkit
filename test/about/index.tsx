import React from "react";
import { Link } from "react-router-dom";
import ImageConverter from "./imageConverter";
import ImageUploader from "./imageMetada";
import ImageOptimizer from "./imageOptimizer";

const About = () => {
  // const imageUrl = "https://picsum.photos/seed/1/800/600"; // Replace with a valid image URL

  return (
    <div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
      <h1>New hooks</h1>
      <ImageOptimizer />
      <ImageConverter />
      <ImageUploader />
    </div>
  );
};

export default About;
