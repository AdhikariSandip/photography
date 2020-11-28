import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Footer.css";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Axios from "axios";

export default function Footer() {
  const [FooterPortfolioData, setFooterPortfolioData] = useState([]);
  const [isDataEmpty, setIsDataEmpty] = useState(false);

  useEffect(() => {
    Aos.init({
      offset: 300,
      duration: 1000,
    });
  }, []);
  useEffect(() => {
    Axios.get("http://localhost:4000/portfolio")
      .then((res) => {
        if (res.data.length === 0) {
          setIsDataEmpty(true);
        } else {
          setFooterPortfolioData(res.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);
  const toTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="footer-main" data-aos="fade-up">
      <div className="footer-head">
        <div className="footer-box img-Collection">
          <ul>
            {isDataEmpty ? (
              <>
                <Link className="CollectionLink" to="/portfolio">
                  Portfolio
                </Link>
              </>
            ) : (
              <>
                {FooterPortfolioData.map((item) => {
                  return (
                    <li key={item._id}>
                      <Link
                        className="CollectionLink"
                        to={{
                          pathname: "/portfolioGallery",
                          search: "?query=abc",
                          state: { detail: item.portImage },
                        }}
                        onClick={toTop}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        </div>
        <div className="footer-image-container">
          <div className="footer-image" />
        </div>
        <div className="footer-box footer-links">
          <ul>
            <li>
              <Link className="CollectionLink" to="/about" onClick={toTop}>
                About
              </Link>
            </li>
            <li>
              <Link className="CollectionLink" to="/blog" onClick={toTop}>
                Blog
              </Link>
            </li>
            <li>
              <Link className="CollectionLink" to="/pricing" onClick={toTop}>
                Pricing
              </Link>
            </li>
            <li>
              <Link className="CollectionLink" to="/contact" onClick={toTop}>
                Say Hello
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-base">
        <h6>
          <span>&#169;</span>Copyright Photography Web Application
        </h6>
      </div>
    </div>
  );
}
