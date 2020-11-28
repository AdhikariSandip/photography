import React, { useEffect, useState } from "react";
import "./FollowInsta.css";
import Aos from "aos";
import "aos/dist/aos.css";
import Axios from "axios";

const FollowInsta = () => {
  const [InstaData, setInstaData] = useState([]);
  const [instaImages, setInstaImages] = useState([]);
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const imageURL = "http://localhost:4000/Instagram/";

  useEffect(() => {
    Aos.init({
      offset: 300,
      duration: 1000,
    });
  }, []);
  useEffect(() => {
    Axios.get("http://localhost:4000/instagram")
      .then((res) => {
        if (res.data.length === 0) {
          setIsDataEmpty(true);
        } else {
          setInstaData(res.data[0]);
          setInstaImages(res.data[0].instagramImage);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const visitURL = (link) => {
    window.location = link;
  };

  return (
    <div>
      <div className="follow-me" data-aos="fade-up">
        {isDataEmpty ? (
          <>
            <h5>Follow me on Instagram</h5>
            <h6>example@instagram.com</h6>
          </>
        ) : (
          <>
            <h5>{InstaData.title}</h5>
            <h6>{InstaData.link}</h6>
            <div className="follow-me-box">
              {instaImages.map((item) => {
                return (
                  <img
                    src={imageURL + item.images}
                    alt="instagramImage.jpg"
                    className="follow-me-images"
                    key={item._id}
                    onClick={() => visitURL(InstaData.link)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FollowInsta;
