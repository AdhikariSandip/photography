import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./PortfolioGallery.css";
import FollowInsta from "../FollowInsta/FollowInsta";
import Footer from "../Footer/Footer";
import Aos from "aos";
import "aos/dist/aos.css";
import Axios from "axios";

export default function PortfolioGallery(props) {
  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);
  const [images, setImages] = useState([]);
  const imagePortURL = "http://localhost:4000/portfolio/";
  useEffect(() => {
    if (!props.history.location.state) {
      Axios.get("http://localhost:4000/portfolio")
        .then((res) => {
          console.log(res.data);
          setImages(res.data[0].portImage);
        })
        .catch((error) => console.log(error));
    } else {
      setImages(props.history.location.state.detail);
    }
  }, [props]);

  return (
    <div>
      <NavBar color="rgb(85, 84, 84)" />
      <div className="port-container">
        <div className="port-heading" data-aos="fade-left">
          <h1>Portfolio Gallery</h1>
        </div>
        <div className="gallery_container">
          <div className="gallery_row">
            {images.map((item) => {
              return (
                <img
                  key={item._id}
                  src={imagePortURL + item.pImage}
                  className="galleryImage_item"
                  alt="portfolioImage.jpg"
                  data-aos="fade-up"
                />
              );
            })}
          </div>
        </div>
      </div>
      <FollowInsta />
      <Footer />
    </div>
  );
}
