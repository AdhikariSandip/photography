import React, { useEffect, useState } from "react";
import "./SocialLinks.css";
import Aos from "aos";
import "aos/dist/aos.css";
import Axios from "axios";

export default function SocialLinks() {
  const imageSocialLinkURL = "http://localhost:4000/SocialLinks/";
  const [socialLinks, setsocialLinks] = useState([]);

  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);
  useEffect(() => {
    Axios.get("http://localhost:4000/socialLinks").then((res) => {
      console.log(res.data);
      setsocialLinks(res.data);
    });
  }, []);
  const visitURL = (link) => {
    window.location = link;
  };
  return (
    <div>
      <div className="social-card-container" data-aos="fade-up">
        {socialLinks.map((item) => {
          return (
            <div
              className="social-card"
              key={item._id}
              onClick={() => visitURL(item.link)}
            >
              {item.linkImage ? (
                <img
                  src={imageSocialLinkURL + item.linkImage}
                  alt="socialLink.jpg"
                  className="social-card-image"
                />
              ) : (
                <div
                  className="social-card-image"
                  style={{ backgroundColor: "#aaa" }}
                >
                  {" "}
                </div>
              )}

              <div className="social-card-info">{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
