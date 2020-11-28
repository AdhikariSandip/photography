import React, { Component } from "react";
import AdminNav from "../Navigation/admin-nav";
import "./Admin-about.css";
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

export default class Admin_about extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutModal: false,
      aboutDescription: "",
      aboutImage: "",
      isEmptyData: false,
      aboutID: "",
      imageSelected: false,
      imageURL: "http://localhost:4000/about/",
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
    Axios.get("http://localhost:4000/about")
      .then((res) => {
        if (res.data.length === 0) {
          this.setState({ isEmptyData: true });
        } else {
          this.setState({
            aboutImage: res.data[0].aboutImage,
            aboutDescription: res.data[0].description,
            aboutID: res.data[0]._id,
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
  handleDescSubmit = (e) => {
    e.preventDefault();
    if (this.state.aboutID) {
      Axios.post(`http://localhost:4000/about/${this.state.aboutID}`, {
        description: this.state.aboutDescription,
      }, this.state.authUser).then((response) => {
        alert("saved..");
      });
    } else {
      alert("please upload an image first...");
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.imageSelected) {
      const formData = new FormData();
      formData.append("myFile", this.state.myFile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          'Authorization' : localStorage.getItem('token')
        },
      };
      if (!this.state.isEmptyData) {
        Axios.patch(
          `http://localhost:4000/about/${this.state.aboutID}`,
          formData,
          config
        )
          .then((res) => {
            this.setState({
              aboutImage: res.data.aboutImage,
              aboutModal: !this.state.aboutModal,
              imageSelected: false,
              isEmptyData: false,
            });
          })
          .catch((err) => console.log(err));
      } else {
        Axios.post("http://localhost:4000/about", formData, config)
          .then((res) => {
            this.setState({
              aboutImage: res.data.aboutImage,
              aboutModal: !this.state.aboutModal,
              imageSelected: false,
              isEmptyData: false,
              aboutID: res.data._id,
            });
          })
          .catch((err) => console.log(err));
      }
    } else {
      alert("Please select an image...");
    }
  };

  render() {
    return (
      <div>
        <AdminNav />
        <div className="aboutAdmin_background">
          <h2>About Background</h2>
          <div className="aboutAdmin_main">
            <div className="aboutAdmin_background_image">
              {this.state.isEmptyData ? (
                <div
                  className="backgroundAbout_image"
                  style={{ backgroundColor: "#aaa" }}
                >
                  {" "}
                </div>
              ) : (
                <img
                  className="backgroundAbout_image"
                  src={this.state.imageURL + this.state.aboutImage}
                  alt="background"
                />
              )}
            </div>
            <div className="about_button-upload">
              <Button
                color="primary"
                className="about_background_upload"
                onClick={this.aboutToggle}
              >
                Upload
              </Button>
              {/* about background section here... */}
              <Modal
                isOpen={this.state.aboutModal}
                toggle={this.aboutToggle}
                className="homeBackground_imageUpload_modal"
              >
                <ModalHeader toggle={this.aboutToggle}>
                  Upload About Background Images
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
                        The landscape images might look better in background
                        section...
                      </FormText>
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.handleSubmit}>
                    Submit
                  </Button>{" "}
                  <Button color="secondary" onClick={this.aboutToggle}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </div>
          <div className="aboutAdmin_description">
            <div className="input_section">
              <Input
                type="textarea"
                className="aboutAdmin_input_description"
                id="aboutDescription"
                name="aboutDescription"
                placeholder="Describe about yourself here...."
                value={this.state.aboutDescription}
                onChange={this.handleChange}
              ></Input>
            </div>
            <div className="about_button-upload">
              <Button
                color="info"
                className="about_background_upload"
                onClick={this.handleDescSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
