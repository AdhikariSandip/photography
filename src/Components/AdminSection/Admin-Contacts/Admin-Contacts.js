import React, { Component } from "react";
import AdminNav from "../Navigation/admin-nav";
import "./Admin-Contacts.css";
import {
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Axios from "axios";

export default class Admin_Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutModal: false,
      contactEmail: "",
      contactPhone: "",
      contactImage: "",
      isEmptyData: false,
      contactID: "",
      imageSelected: false,
      imageURL: "http://localhost:4000/ContactUs/",
      authUser: {
        headers : { 'Authorization' : localStorage.getItem('token') }
    }
    };
  }
  aboutToggle = () => {
    this.setState({
      aboutModal: !this.state.aboutModal,
    });
  };
  componentDidMount = () => {
    Axios.get("http://localhost:4000/contactUs")
      .then((res) => {
        console.log(res.data);
        if (res.data.length === 0) {
          this.setState({ isEmptyData: true });
        } else {
          this.setState({
            contactImage: res.data[0].contactImage,
            contactEmail: res.data[0].email,
            contactPhone: res.data[0].phone,
            contactID: res.data[0]._id,
          });
        }
      })
      .catch((error) => console.log(error));
  };
  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });
  handleImageChange = (e) => {
    this.setState({
      myFile: e.target.files[0],
      imageSelected: true,
    });
  };
  handleImageSubmit = (e) => {
    e.preventDefault();
    if (this.state.contactID && this.state.imageSelected) {
      const formData = new FormData();
      formData.append("myFile", this.state.myFile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          'Authorization' : localStorage.getItem('token')
        },
      };
      Axios.post(
        `http://localhost:4000/contactUs/${this.state.contactID}`,
        formData,
        config
      )
        .then((res) => {
          console.log(res.data);
          this.setState({
            contactImage: res.data.contactImage,
            aboutModal: !this.state.aboutModal,
            imageSelected: false,
            isEmptyData: false,
          });
        alert("Image is saved...")
        })
        .catch((error) => console.log(error));
    } else {
      alert("Please fill email and phone number first...");
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.isEmptyData) {
      Axios.post(`http://localhost:4000/contactUs`, {
        email: this.state.contactEmail,
        phone: this.state.contactPhone,
      }, this.state.authUser).then((res) => {
        console.log(res.data);
        this.setState({
          isEmptyData: false,
          contactID: res.data._id,
        });
        alert("Saved...")
      });
    } else {
      Axios.patch(`http://localhost:4000/contactUs/${this.state.contactID}`, {
        email: this.state.contactEmail,
        phone: this.state.contactPhone,
      }, this.state.authUser).then((res) => {
        console.log(res.data);
        this.setState({
          isEmptyData: false,
        });
        alert("Saved...")
      });
    }
  };

  render() {
    return (
      <div>
        <AdminNav />
        <div className="contactAdmin_background">
          <h2>Contacts Background</h2>
          <div className="contactAdmin_details">
            <div className="input_section">
              <h4>Contact Details</h4>
              <Input
                type="email"
                placeholder="Enter Email Id..."
                id="contactEmail"
                name="contactEmail"
                value={this.state.contactEmail}
                onChange={this.handleChange}
              ></Input>
              <Input
                type="text"
                placeholder="Enter Phone Number..."
                id="contactPhone"
                name="contactPhone"
                value={this.state.contactPhone}
                onChange={this.handleChange}
              ></Input>
              <div className="contacts_buttons">
                <Button color="info" onClick={this.handleSubmit}>
                  Save
                </Button>
              </div>
            </div>
          </div>

          <div className="contactAdmin_main">
            <div className="contactAdmin_background_image">
              {this.state.isEmptyData || !this.state.contactImage ? (
                <div
                  className="backgroundContact_image"
                  style={{ backgroundColor: "#aaa" }}
                ></div>
              ) : (
                <img
                  className="backgroundContact_image"
                  src={this.state.imageURL + this.state.contactImage}
                  alt="background"
                />
              )}
            </div>
            <div className="contact_background_buttons">
              <Button color="primary" onClick={this.aboutToggle}>
                Upload
              </Button>

              {/* about background section here... */}
              <Modal
                isOpen={this.state.aboutModal}
                toggle={this.aboutToggle}
                className="contact_imageUpload_modal"
              >
                <ModalHeader toggle={this.aboutToggle}>
                  Upload Contacts Background Image
                </ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label for="myFile">File</Label>
                      <Input
                        type="file"
                        name="myFile"
                        id="myFile"
                        onChange={this.handleImageChange}
                      />
                      <FormText color="muted">
                        The portrait images might look better in background
                        section...
                      </FormText>
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.handleImageSubmit}>
                    Submit
                  </Button>{" "}
                  <Button color="secondary" onClick={this.aboutToggle}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
