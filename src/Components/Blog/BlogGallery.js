import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./BlogGallery.css";
import FollowInsta from "../FollowInsta/FollowInsta";
import Footer from "../Footer/Footer";
import Aos from "aos";
import "aos/dist/aos.css";
import Axios from "axios";

export default function BlogGallery(props) {
  const [imageData, setImageData] = useState([]);
  const [images, setimages] = useState([{
    bImage : ""
  }]);
  const imageBlogURL = "http://localhost:4000/blog/";
  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);
  useEffect(() => {
    if (!props.history.location.state) {
      Axios.get("http://localhost:4000/blog")
        .then((res) => {
          if (res.data.length !== 0) {
            setImageData(res.data[0]);
            if (res.data[0].blogImage.length !== 0) {
              setimages(res.data[0].blogImage);
            }
          }
        })
        .catch((error) => console.log(error));
    } else {
      setImageData(props.history.location.state.detail);
      if (props.history.location.state.detail.blogImage.length !== 0) {
        setimages(props.history.location.state.detail.blogImage);
      }
    }
  }, [props]);

  return (
    <div>
      <NavBar color="rgb(85, 84, 84)" />
      <div className="blogGallery-container">
        <div className="blogGallery-heading">
          <h4>{imageData.title}</h4>
          <p>{imageData.description}</p>
        </div>
        <div className="blogGallery_container">
          <div className="blogGallery_column">
            {images.map((item) => {
              return (
                <img
                  src={imageBlogURL + item.bImage}
                  alt=""
                  className="blogGalleryImage_item"
                  key={item._id}
                  data-aos="fade-up"
                />
              );
            })}
          </div>
          <div className="hearts">&#10084;&#10084;&#10084;&#10084;&#10084;</div>
        </div>
      </div>
      <FollowInsta />
      <Footer />
    </div>
  );
}
