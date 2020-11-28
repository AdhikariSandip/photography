import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import "./admin-nav.css"

export default function NavBar(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

    return (
        <div className="main-navAdmin">
            <div className="nav-AppNameAdmin">
                <h4>Photography Application</h4>
            </div>
            <div className="nav-NavListAdmin">
            <ul>
            <li><Link  className="Link" to='/dashboard'>Home</Link></li>
            <li><Link  className="Link" to='/admin-about'>About</Link></li>
            <li><Link  className="Link" to='/admin-portfolio'>Portfolio</Link></li>
            <li><Link className="Link" to='/admin-blog'>Blog</Link></li>
            <li><Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle className="adminPricingLink-Dropdown">Pricing</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem><Link className="Link" to='/admin-pricing'>Pricing</Link></DropdownItem>
                    <DropdownItem><Link className="Link" to='/admin-packages'>Packages</Link></DropdownItem>
                    <DropdownItem><Link className="Link" to='/admin-priceList'>Price List</Link></DropdownItem>
                  </DropdownMenu>
                </Dropdown></li>
            <li><Link className="Link" to='/admin-contact'>Say Hello</Link></li>
            <li><Link className="Link" to='/admin-others'>Others</Link></li>
            <li>
            <Link className="Link" onClick={() => {
              localStorage.removeItem('token');
              }} to='/'>Logout</Link>
              </li>
            </ul>
            </div>
        </div>
    )
}
