import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";
import FollowInsta from "../FollowInsta/FollowInsta";
import "./Pricing.css";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Footer from "../Footer/Footer";
import Axios from "axios";
import { Link } from "react-router-dom";

export default function Pricing() {
  const [pricingData, setPricingData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [packageData, setPackageData] = useState([]);

  const pricingImageLink = "http://localhost:4000/product/";
  const packageImageLink = "http://localhost:4000/package/";

  useEffect(() => {
    Aos.init({
      offset: 300,
      duration: 1000,
    });
  }, []);
  const toTop = () => {
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    Axios.get("http://localhost:4000/productList")
      .then((res) => {
        if (res.data.length !== 0) {
          setPricingData(res.data[0]);
          if (res.data[0].products.length !== 0) {
            setProductData(res.data[0].products);
          }
        }
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    Axios.get("http://localhost:4000/package")
      .then((res) => {
        console.log(res.data);
        if (res.data.length !== 0) {
          console.log(res.data);
          setPackageData(res.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="main-package">
      <NavBar color="rgb(85, 84, 84)" />
      <div className="package-cards" data-aos="fade-up">
        {packageData.map((item) => {
          return (
            <div className="package-card" key={item._id}>
              <Link
                to={{
                  pathname: "/packages",
                  search: "?query=abc",
                  state: { detail: item },
                }}
              >
                {item.packages.length !== 0 ? (
                  <img
                    src={packageImageLink + item.packages[0].packageImage}
                    alt="packageImg.jpg"
                    className="card-image"
                  />
                ) : (
                  <div
                    className="card-image"
                    style={{ backgroundColor: "#eee" }}
                  >
                    {" "}
                  </div>
                )}
              </Link>
                <h6>{item.title}</h6>
            </div>
          );
        })}
      </div>
      <div className="investment-details" data-aos="fade-up">
        <h2 className="investment-titleHead">{pricingData.title}</h2>
        <p className="investment-description">{pricingData.description}</p>
      </div>
      <div className="investment-products">
        {productData.map((item) => {
          return (
            <div className="investment-item" key={item._id}>
              <div className="investment-image-section" data-aos="fade-up">
                {
                  <img
                    src={pricingImageLink + item.productImage}
                    alt="productImage.js"
                    className="side-image"
                  />
                }
              </div>
              <div className="side-description" data-aos="fade-up">
                <h1>{item.name}</h1>
                <p>{item.feature}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="investment-footer" data-aos="fade-up">
        <h2>
          <Link className="investment-title" to="price-list" onClick={toTop}>
            Product Pricing
          </Link>
        </h2>
        <h2>
          <Link className="investment-title" to="price-list" onClick={toTop}>
            Wedding Pricing
          </Link>
        </h2>
        <h2>
          <Link className="investment-title" to="price-list" onClick={toTop}>
            Portrait Pricing
          </Link>
        </h2>
      </div>
      <FollowInsta />
      <Footer />
    </div>
  );
}
