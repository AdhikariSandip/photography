import React, { useEffect, useState } from "react";
import FollowInsta from "../FollowInsta/FollowInsta";
import NavBar from "../NavBar/NavBar";
import Aos from "aos";
import "aos/dist/aos.css";
import "./PriceList.css";
import Footer from "../Footer/Footer";
import Axios from "axios";

export default function PriceList() {
  const priceListImageLink = "http://localhost:4000/priceList/";
  const [priceListData, setpriceListData] = useState([]);
  const [productPrice, setproductPrice] = useState([]);
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const [isProductList, setIsProductList] = useState(false);

  useEffect(() => {
    Aos.init({
      offset: 300,
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:4000/priceList")
      .then((res) => {
        if (res.data.length !== 0) {
          console.log(res.data[0]);
          setpriceListData(res.data[0]);
          if (res.data[0].productList.length !== 0) {
            setproductPrice(res.data[0].productList);
          } else {
            setIsProductList(true);
          }
        } else {
          setIsDataEmpty(true);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <NavBar color="rgb(85, 84, 84)" />
      <div className="priceList">
        <div className="fill">
          {(!isDataEmpty) ? (
            <>
              <img
                src={priceListImageLink + priceListData.backgroundImage}
                alt="backgroundImage.jpg"
                className="priceList-bg-image"
              />
            </>
          ) : (
            <>
              <div className="priceList-bg-imageAlt"></div>
            </>
          )}
        </div>
        <div className="priceList-details" data-aos="fade-up">
          <div className="priceList-title">{priceListData.title}</div>
          {isProductList ? (
            <> </>
          ) : (
            <>
              {productPrice.map((PL) => {
                return (
                  <div className="product-item" key={PL._id} data-aos="fade-up">
                    <div className="product-title">{PL.productTitle}</div>
                    {PL.product.map((item) => {
                      return (
                        <div className="product-price" key={item._id}>
                          {item.productName}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
      <FollowInsta />
      <Footer />
    </div>
  );
}
