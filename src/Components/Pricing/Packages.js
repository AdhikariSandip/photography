import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Packages.css";
import FollowInsta from "../FollowInsta/FollowInsta";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Footer from "../Footer/Footer";
import Axios from "axios";
import { Link } from "react-router-dom";

function Packages(props) {
  const [packageData, setpackageData] = useState([]);
  const [packages, setpackages] = useState([]);
  const [allPackages, setallPackages] = useState([]);
  const packageImageLink = "http://localhost:4000/package/";

  useEffect(() => {
    Aos.init({
      offset: 300,
      duration: 1000,
    });
  }, []);
  useEffect(() => {
    if (!props.history.location.state) {
      Axios.get("http://localhost:4000/package").then((res) => {
        if (res.data.length !== 0) {
          console.log(res.data);
          setpackageData(res.data[0]);
          if (res.data[0].packages.length !== 0) {
            setpackages(res.data[0].packages);
          }
        }
      });
    } else {
      setpackageData(props.history.location.state.detail);
      if (props.history.location.state.detail.packages.length !== 0) {
        setpackages(props.history.location.state.detail.packages);
      }
    }
  }, [props]);
  useEffect(() => {
    Axios.get("http://localhost:4000/package")
      .then((res) => {
        if (res.data.length !== 0) {
          setallPackages(res.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);
  const toTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div>
      <NavBar color="rgb(85, 84, 84)" />
      <div className="package-description">
        <p>{packageData.description}</p>
      </div>
      <div className="main-package">
        <div className="package-head">
          <h2 className="package-title" data-aos="fade-up">
            {packageData.title}
          </h2>
        </div>
        <div className="package-body">
          {packages.map((item) => {
            return (
              <div className="package-item" key={item._id}>
                <div className="package-image-section" data-aos="fade-up">
                  {
                    <img
                      src={packageImageLink + item.packageImage}
                      alt="package.jpg"
                      className="package-side-image"
                    />
                  }
                </div>
                <div className="package-side-description" data-aos="fade-up">
                  <h1>{item.name}</h1>
                  {item.services.map((ser) => {
                    return (
                      <h6 key={ser._id}>
                        <span>~ </span>
                        {ser.serviceName}
                      </h6>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="investment-footer" data-aos="fade-up">
        {allPackages.map((pack) => {
          return (
            <h2 key={pack._id}>
              <Link
                className="investment-title"
                to={{
                  pathname: "/packages",
                  search: "?query=abc",
                  state: { detail: pack },
                }}
                onClick={toTop}
              >
                {pack.title}
              </Link>
            </h2>
          );
        })}
      </div>
      <FollowInsta />
      <Footer />
    </div>
  );
}

export default Packages;
