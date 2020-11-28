import React, { useEffect, useState } from "react";
import "./Home.css";
import FollowInsta from "../FollowInsta/FollowInsta";
import Aos from "aos";
import "aos/dist/aos.css";
import Footer from "../Footer/Footer";
import Axios from "axios";
import NavBar from "../NavBar/NavBar";
import {
  Carousel,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
} from "reactstrap";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [gridItems, setGridItems] = useState([]);
  const [animating, setAnimating] = useState(false);
  const imageURL = "http://localhost:4000/home/homeBackground/";
  const gridImageURL = "http://localhost:4000/home/homeGrid/";

  useEffect(() => {
    Axios.get("http://localhost:4000/home")
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => console.log(error));
    Axios.get("http://localhost:4000/homeGrid")
      .then((res) => {
        setGridItems(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item._id}
      >
        <img
          src={imageURL + item.image}
          alt={item.altText}
          className="header-image"
        />
      </CarouselItem>
    );
  });

  useEffect(() => {
    Aos.init({
      offset: 0,
      duration: 1000,
    });
  }, []);
  return (
    <>
      <div className="header-Nav-container">
        <NavBar color="#fff" />
      </div>
      <div className="home-main">
        <Carousel activeIndex={activeIndex} next={next} previous={previous}>
          <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
          />
          {slides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={next}
          />
        </Carousel>

        <section id="grid-section" className="grid-section" data-aos="fade-up">
          {gridItems.map((item) => {
            return (
              <article className="content" key={item._id}>
                <div className="content-overlay">
                  <div className="grid-background" />
                </div>
                <img
                  src={gridImageURL + item.gridImage}
                  alt="grid.jpg"
                  className="grid-image"
                />
                <div className="content-details fadeIn-bottom">
                  <h2 className="content-title">{item.title}</h2>
                  <p className="content-text">{item.description}</p>
                </div>
              </article>
            );
          })}
        </section>

        <FollowInsta />
        <Footer />
      </div>
    </>
  );
}
