import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Portfolio.css";
import FollowInsta from "../FollowInsta/FollowInsta";
import Aos from "aos";
import "aos/dist/aos.css";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import Axios from "axios";

export default function Portfolio() {
  const [portfolioData, setportfolioData] = useState([]);
  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:4000/portfolio")
      .then((res) => {
        console.log(res.data);
        setportfolioData(res.data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      <NavBar color="rgb(85, 84, 84)" />
      <div className="port-container">
        <div className="port-heading" data-aos="fade-up">
          <h1>Portfolio</h1>
        </div>
        <div className="port-body" data-aos="fade-up">
          <sidebar>
            <div className="sidebar-left">
              <div className="sidebar-heading">
                <h1>Galleries</h1>
              </div>
              <div>
                <ul>
                  {portfolioData.map((item) => {
                    return (
                      <li key={item._id}>
                        <Link className="portfolioLinks"
                        to={{
                            pathname: '/portfolioGallery',
                            search: '?query=abc',
                            state: { detail: item.portImage }
                          }}
                         >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </sidebar>
          <div className="sidebar-right">
            <div className="sidebar-image" />
          </div>
        </div>
      </div>
      <FollowInsta />
      <Footer />
    </div>
  );
}
