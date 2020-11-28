import React, { Component } from "react";
import AdminNav from "../Navigation/admin-nav";
import "./OthersSection.css";
import AdminSocialLinks from "./Admin-SocialLinks";
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
      instaModal: false,
      instaTitle: "",
      instaLink: "",
      instaImage: [],
      isEmptyData: false,
      instaID: "",
      imageSelected: false,
      imageURL: "http://localhost:4000/Instagram/",
      credImage: "",
      credDescription: "",
      credID: "",
      isCredEmpty: false,
      CredImageSelected: false,
      imageCredentialsURL: "http://localhost:4000/credentials/",
      authUser: {
        headers : { 'Authorization' : localStorage.getItem('token') }
    }
    };
  }
  instaToggle = () =>
    this.setState({
      instaModal: !this.state.instaModal,
    });
  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });
  handleImageChange = (e) => {
    this.setState({
      myFile: e.target.files[0],
      imageSelected: true,
    });
  };
  handleCredImageChange = (e) => {
    this.setState({
      credFile: e.target.files[0],
      CredImageSelected: true,
    });
  };
  handleImageSubmit = (e) => {
    e.preventDefault();
    if (this.state.instaID && this.state.imageSelected) {
      const formData = new FormData();
      formData.append("myFile", this.state.myFile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          'Authorization' : localStorage.getItem('token')
        },
      };
      Axios.post(
        `http://localhost:4000/instagram/${this.state.instaID}`,
        formData,
        config
      )
        .then((res) => {
          // console.log(res.data.instagramImage)
          this.setState({
            instaImage: res.data.instagramImage,
            instaModal: !this.state.instaModal,
            imageSelected: false,
            isEmptyData: false,
          });
        })
        .catch((error) => console.log(error));
    } else {
      alert("Please fill the insta details and select an image...");
    }
  };
  handleCredSubmit = (e) => {
    e.preventDefault();
    if (this.state.isCredEmpty && this.state.CredImageSelected) {
      const formData = new FormData();
      formData.append("myFile", this.state.credFile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          'Authorization' : localStorage.getItem('token')
        },
      };
      Axios.post("http://localhost:4000/credentials", formData, config).then(
        (res) => {
          console.log(res.data);
          this.setState({
            credImage: res.data.credImage,
            credID: res.data._id,
            CredImageSelected: false,
            isCredEmpty: false,
          });
          Axios.post(`http://localhost:4000/credentials/${res.data._id}`, {
            description: this.state.credDescription,
          }, this.state.authUser);
          alert("saved...");
        }
      );
    } else {
      if (this.state.CredImageSelected) {
        const formData = new FormData();
        formData.append("myFile", this.state.credFile);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
            'Authorization' : localStorage.getItem('token')
          },
        };
        Axios.patch(
          `http://localhost:4000/credentials/${this.state.credID}`,
          formData,
          config
        ).then((res) => {
          this.setState({
            credImage: res.data.credImage,
            CredImageSelected: false,
          });
        });
      }
      Axios.post(`http://localhost:4000/credentials/${this.state.credID}`, {
        description: this.state.credDescription,
      }, this.state.authUser);
      alert("saved...");
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.isEmptyData) {
      Axios.post("http://localhost:4000/instagram", {
        title: this.state.instaTitle,
        link: this.state.instaLink,
      }, this.state.authUser).then((res) => {
        console.log(res.data);
        this.setState({
          isEmptyData: false,
          instaID: res.data._id,
        });
        alert("saved..");
      });
    } else {
      Axios.patch(`http://localhost:4000/instagram/${this.state.instaID}`, {
        title: this.state.instaTitle,
        link: this.state.instaLink,
      }, this.state.authUser).then((res) => {
        console.log(res.data);
        this.setState({
          isEmptyData: false,
          instaID: res.data._id,
        });
        alert("saved..");
      });
    }
  };
  handleDelete = (IID) => {
    const result = window.confirm("Are you sure to delete this image? ");
    if (result) {
      Axios.delete(`http://localhost:4000/instagram/image/${IID}`, this.state.authUser)
        .then((res) => {
          const filterData = this.state.instaImage.filter((item) => {
            return item._id !== IID;
          });
          this.setState({
            instaImage: filterData,
          });
        })
        .catch((error) => console.log(error));
    }
  };
  componentDidMount = () => {
    Axios.get("http://localhost:4000/instagram")
      .then((res) => {
        if (res.data.length === 0) {
          this.setState({ isEmptyData: true });
        } else {
          this.setState({
            instaImage: res.data[0].instagramImage,
            instaTitle: res.data[0].title,
            instaLink: res.data[0].link,
            instaID: res.data[0]._id,
          });
        }
      })
      .catch((error) => console.log(error));
    Axios.get("http://localhost:4000/credentials")
      .then((res) => {
        if (res.data.length === 0) {
          this.setState({ isCredEmpty: true });
        } else {
          this.setState({
            credDescription: res.data[0].description,
            credImage: res.data[0].credImage,
            credID: res.data[0]._id,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div>
        <AdminNav />
        <div className="othersSection_main">
          <h2>Others</h2>
          <div className="othersSection_body">
            <div className="othersSection_InstagramContainer">
              <h4>Instagram Section</h4>
              <Form className="othersSection_instaForm">
                <FormGroup>
                  <Label for="instaTitle">Title</Label>
                  <Input
                    type="text"
                    placeholder="Enter a short title..."
                    name="instaTitle"
                    id="instaTitle"
                    value={this.state.instaTitle}
                    onChange={this.handleChange}
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Label for="instaLink">Link</Label>
                  <Input
                    type="text"
                    placeholder="Enter link to the instagram..."
                    name="instaLink"
                    id="instaLink"
                    value={this.state.instaLink}
                    onChange={this.handleChange}
                  ></Input>
                </FormGroup>

                <div className="button-upload">
                  <Button color="primary" onClick={this.handleSubmit}>
                    Save
                  </Button>
                </div>
              </Form>
              <div className="imageSection_grid_images">
                {this.state.instaImage.map((itemCard) => {
                  return (
                    <div className="imageSection_grid_card" key={itemCard._id}>
                      <img
                        className="imageSection_image"
                        src={this.state.imageURL + itemCard.images}
                        alt="background"
                      />
                      <div className="card_button">
                        <Button
                          color="danger"
                          onClick={() => this.handleDelete(itemCard._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="button-upload">
                <Button
                  color="primary"
                  style={{ marginRight: "3rem" }}
                  onClick={this.instaToggle}
                >
                  Upload
                </Button>
              </div>
            </div>
            {/* credentials section.... */}
            <div className="othersSection_CredentialsContainer">
              <h4>Credentials Section</h4>
              <div className="credentialsSection_container">
                <div className="credentialsSection_imageSection">
                  {this.state.isCredEmpty ? (
                    <div
                      className="credentialsSection_credentialsImage"
                      style={{ backgroundColor: "#aaa" }}
                    ></div>
                  ) : (
                    <img
                      className="credentialsSection_credentialsImage"
                      src={
                        this.state.imageCredentialsURL + this.state.credImage
                      }
                      alt="credentials background"
                    />
                  )}

                  <FormGroup style={{ margin: "1rem" }}>
                    <Label for="credFile">Change Image</Label>
                    <Input
                      type="file"
                      name="credFile"
                      id="credFile"
                      className="inputFile"
                      onChange={this.handleCredImageChange}
                    />
                    <FormText color="muted">
                      Choose a new image to edit credentials...
                    </FormText>
                  </FormGroup>
                </div>
                <div className="credentialsSection_description">
                  <FormGroup>
                    <Label for="credDescription">Description</Label>
                    <Input
                      type="textarea"
                      className="CredentialsSection_credentials"
                      name="credDescription"
                      id="credDescription"
                      placeholder="describe about credentials"
                      value={this.state.credDescription}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <div className="button-upload">
                    <Button
                      color="primary"
                      style={{ marginRight: "3rem" }}
                      className="credentials_button"
                      onClick={this.handleCredSubmit}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* section section.... */}
            <AdminSocialLinks />
          </div>
        </div>
        {/* modals section */}
        {/* instagram modal */}
        <Modal
          isOpen={this.state.instaModal}
          toggle={this.instaToggle}
          className="homeBackground_imageUpload_modal"
        >
          <ModalHeader toggle={this.instaToggle}>
            Upload Home Background Images
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
                  The portrait images might look better in instagram section...
                </FormText>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleImageSubmit}>
              Submit
            </Button>{" "}
            <Button color="secondary" onClick={this.instaToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
