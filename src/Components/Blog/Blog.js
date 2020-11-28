import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import FollowInsta from "../FollowInsta/FollowInsta";
import Footer from "../Footer/Footer";
import "./Blog.css";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import Axios from "axios";

export default function Blog() {
  const [blogData, setBlogData] = useState([]);
  const imageBlogURL = "http://localhost:4000/blog/";
  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);
  useEffect(() => {
    Axios.get("http://localhost:4000/blog")
      .then((res) => {
        if (res.data.length !== 0) {
          console.log(res.data);
          setBlogData(res.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      <NavBar color="rgb(85, 84, 84)" />
      <div className="blog-main">
        <div className="blog-head" data-aos="fade-left">
          <h1>Blog</h1>
        </div>
        <div className="blog-body">
          <div className="blog-card-container">
            {blogData.map((item) => {
              return (
                <Link
                key={item._id}
                  className="blogGallery_link"
                  to={{
                    pathname: "/blogGallery",
                    search: "?query=abc",
                    state: { detail: item },
                  }}
                >
                  <div className="blog-card" data-aos="fade-up">
                    {(item.blogImage.length !== 0) ? (
                      <img
                        src={imageBlogURL + item.blogImage[0].bImage}
                        className="blog-card-image"
                        alt="./blog.jpg"
                      />
                    ) : (
                      <div className="blog-card-image"> </div>
                    )}
                    <div className="blog-card-description">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </Link>
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
