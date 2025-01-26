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
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
        architecto corporis dolorum eum exercitationem laboriosam nostrum
        obcaecati, placeat praesentium quaerat quasi repellendus sunt tempora
        totam vel! Eligendi nesciunt nisi reprehenderit?
      </div>
    </div>
  );
};

export default About;
