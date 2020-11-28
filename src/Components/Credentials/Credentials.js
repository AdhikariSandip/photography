import React, { useEffect, useState } from "react";
import "./Credentials.css";
import Aos from "aos";
import "aos/dist/aos.css";
import Axios from "axios";

function Credentials() {
  const imageCredentialsURL = "http://localhost:4000/credentials/";
  const [credData, setcredData] = useState([]);
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const demoCred = "This is a demo credentials description...";

  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);
  useEffect(() => {
    Axios.get("http://localhost:4000/credentials")
      .then((res) => {
        if (res.data.length === 0) {
          setIsDataEmpty(true);
        } else {
          setcredData(res.data[0]);
          console.log(res.data[0]);
        }
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      <div className="credentails-box" data-aos="fade-up">
        <div className="cred-side-info">
          <div className="cred-decorate-img" />
          <h1>Credentials</h1>
          {isDataEmpty ? <p>{demoCred}</p> : <p>{credData.description}</p>}
        </div>
        <div className="cred-profile-bg">
          <div className="" />
          {isDataEmpty ? (
            <div
              className="cred-profile"
              style={{ backgroundColor: "#aaa" }}
            ></div>
          ) : (
            <img
              src={imageCredentialsURL + credData.credImage}
              alt="cred.jpg"
              className="cred-profile"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Credentials;
