import React, { useEffect, useState } from "react";
import Credentials from "../Credentials/Credentials";
import FollowInsta from "../FollowInsta/FollowInsta";
import NavBar from "../NavBar/NavBar";
import "./About.css";
import Aos from "aos";
import "aos/dist/aos.css";
import Footer from "../Footer/Footer";
import Axios from "axios";

export default function About() {
  const [aboutImage, setAboutImage] = useState("");
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const [aboutDescription, setAboutDescription] = useState(
    "This is a demo description"
  );
  const imageURL = "http://localhost:4000/about/";
  useEffect(() => {
    Aos.init({
      offset: 200,
      duration: 1000,
    });
  }, []);
  useEffect(() => {
    Axios.get("http://localhost:4000/about")
      .then((res) => {
        if (res.data.length === 0) {
          setIsDataEmpty(true);
        } else {
          setAboutImage(res.data[0].aboutImage);
          setAboutDescription(res.data[0].description);
        }
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="about">
      <NavBar color="rgb(85, 84, 84)" />
      <div className="aboutContainer">
        <div className="aboutImageContainer_background">
          {isDataEmpty ? (
            <div
              className="about-bg-image"
              style={{ backgroundColor: "#aaa" }}
            ></div>
          ) : (
            <img
              src={imageURL + aboutImage}
              alt="aboutBackground.jpg"
              className="about-bg-image"
            />
          )}
        </div>
      </div>
      <div className="about-me" data-aos="fade-up">
        <p className="descriptionAbtMe">{aboutDescription}</p>
      </div>
      <div className="credentialsSection_about">
        <Credentials />
      </div>
      <div className="followInstaSection_about">
        <FollowInsta />
      </div>
      <Footer />
    </div>
  );
}
