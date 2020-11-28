import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import "./NavBar.css";

export default function NavBar(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [portfolioDD, setportfolioDD] = useState(false);
  const togglePortfolioDD = () => setportfolioDD((prevState) => !prevState);
  const [NavPortfolioData, setNavPortfolioData] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:4000/portfolio")
      .then((res) => {
        console.log(res.data);
        setNavPortfolioData(res.data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="main-nav">
      <div className="nav-AppName">
        <h4 style={{ color: props.color }}>Photography Application</h4>
      </div>
      <div className="nav-NavList">
        <ul>
          <li>
            <Link style={{ color: props.color }} className="Link" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link style={{ color: props.color }} className="Link" to="/about">
              About
            </Link>
          </li>
          <li>
            <Dropdown isOpen={portfolioDD} toggle={togglePortfolioDD}>
              <DropdownToggle
                className="navBar-Dropdown"
                style={{ color: props.color }}
              >
                Portfolio
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link className="Link" to="/portfolio">
                    Portfolio
                  </Link>
                </DropdownItem>
                {NavPortfolioData ? (
                    NavPortfolioData.map((item) => {
                        return (
                            <DropdownItem key={item._id}>
                                <Link className="Link" 
                                to={{
                                    pathname: '/portfolioGallery',
                                    search: '?query=abc',
                                    state: { detail: item.portImage }
                                  }}
                                >{item.title}</Link>
                            </DropdownItem>
                        )
                    })
                ) : (
                  <DropdownItem></DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </li>
          <li>
            <Link style={{ color: props.color }} className="Link" to="/blog">
              Blog
            </Link>
          </li>
          <li>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle
                className="navBar-Dropdown"
                style={{ color: props.color }}
              >
                Pricing
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <Link className="Link" to="/pricing">
                    Pricing
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link className="Link" to="/packages">
                    Packages
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link className="Link" to="/price-list">
                    Price List
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </li>
          <li>
            <Link style={{ color: props.color }} className="Link" to="/contact">
              Say Hello
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
