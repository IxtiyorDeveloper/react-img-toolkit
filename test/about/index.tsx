import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </div>
      <div>
        About page is created to check, if rendering happens again when router
        changes
      </div>
    </div>
  );
};

export default About;
