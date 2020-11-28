import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar/NavBar'
import FollowInsta from '../FollowInsta/FollowInsta'
import SocialLinks from '../SocialLinks/SocialLinks'
import Footer from '../Footer/Footer';
import "./Contact.css";
import Aos from "aos";
import 'aos/dist/aos.css';
import { Button } from 'reactstrap';
import Axios from 'axios';

export default function Contact() {
  const [contactData, setContactData] = useState([]);
  const imageURL = "http://localhost:4000/ContactUs/";
    useEffect(() => {
        Aos.init({
            duration: 1000
        })
    }, [])
    useEffect(() => {
        Axios.get("http://localhost:4000/contactUs")
        .then((res) => {
            if(res.data.length !== 0) {
                setContactData(res.data[0])
            }
        })
        .catch((error) => console.log(error));
      }, []);
    return (
        <div>
      <NavBar color="rgb(85, 84, 84)"/>
            <div className="main-contact">
                <div className="contact-container" data-aos="fade-up">
                    <img 
                    src={imageURL + contactData.contactImage}
                    alt="contact.jpg"
                    className="contact-image"
                    />
                    <div className="side-contact-container">
                        <div className="side-contact">
                            <form>
                                <h2>{contactData.phone}</h2>
                                <h2>{contactData.email}</h2>
                                <label htmlFor="name">Name</label>
                                <input type="text" className="name" id="name"></input>
                                <label htmlFor="email">Email</label>
                                <input type="email" className="email" id="mail"></input>
                                <label htmlFor="phone">Phone</label>
                                <input type="text" className="phone" id="phone"></input>
                                <div className="checkbox-section">

                                    <label className="head-label">Are you interested in....</label> <br/>
                                    <div className="checkboxes">
                                    <label>Maternity Portraiture</label>
                                    <input type="checkbox" />
                                    </div>

                                    <div  className="checkboxes">
                                    <label>Pet Portraiture</label>
                                    <input type="checkbox" />
                                    </div>

                                    <div  className="checkboxes">
                                    <label>Family Portraiture</label>
                                    <input type="checkbox" />
                                    </div>
                                    </div>
                                <label htmlFor="message">Message</label>
                                <textarea type="text" id="message" className="message"
                                name="message"></textarea>
                                <div>
                                <Button type="submit" className="send-btn" color="primary">Send email</Button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            </div>
            <SocialLinks />
            <FollowInsta />
            <Footer />
        </div>
    )
}
