import React, { Component } from "react";
import "./OthersSection.css";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import Axios from "axios";

export default class Admin_about extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socialLinks: [],
      //   socialLinksDetails: [],
      imageSelected: false,
      selectedImageFile: "",
      socialName: "",
      socialLink: "",
      socialLID: "",
      isEdit: false,
      imageSocialLinkURL: "http://localhost:4000/SocialLinks/", 
      authUser: {
        headers : { 'Authorization' : localStorage.getItem('token') }
    }
    };
  }
  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });
  handleImageChange = (e) => {
    this.setState({
      myFile: e.target.files[0],
      imageSelected: true,
    });
  };
  componentDidMount = () => {
    Axios.get("http://localhost:4000/socialLinks").then((res) => {
      this.setState({
        socialLinks: res.data,
      });
    });
  };
  onEditChanges = (SLID) => {
    const selectedData = this.state.socialLinks.find((item) => {
      return item._id === SLID;
    });
    this.setState({
      isEdit: true,
      selectedImageFile: selectedData.linkImage,
      socialName: selectedData.name,
      socialLink: selectedData.link,
      socialLID: selectedData._id,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.isEdit) {
      Axios.patch(`http://localhost:4000/socialLinks/${this.state.socialLID}`, {
        name: this.state.socialName,
        link: this.state.socialLink,
      }, this.state.authUser)
        .then((res) => {
          const filterData = this.state.socialLinks.map((item) => {
            if (item._id === res.data._id) {
              item.name = this.state.socialName;
              item.link = this.state.socialLink;
            }
            return item;
          });
          if (this.state.imageSelected) {
            const formData = new FormData();
            formData.append("myFile", this.state.myFile);
            const config = {
              headers: {
                "content-type": "multipart/form-data",
                'Authorization' : localStorage.getItem('token')
              },
            };
            Axios.post(
              `http://localhost:4000/socialLinks/${this.state.socialLID}`,
              formData,
              config
            )
              .then((resImg) => {
                const filterImageData = filterData.map((item) => {
                  if (item._id === resImg.data._id) {
                    item.linkImage = resImg.data.linkImage;
                  }
                  return item;
                });
                this.setState({
                  socialLinks: filterImageData,
                });
                console.log(filterImageData);
              })
              .catch((error) => console.log(error));
          } else {
            this.setState({
              socialLinks: filterData,
            });
          }
          this.setState({
            isEdit: false,
            imageSelected: false,
            selectedImageFile: "",
            socialName: "",
            socialLink: "",
            socialLID: "",
          });
          alert("Saved...");
        })
        .catch((error) => console.log(error));
    } else {
      Axios.post(`http://localhost:4000/socialLinks`, {
        name: this.state.socialName,
        link: this.state.socialLink,
      }, this.state.authUser)
        .then((res) => {
          console.log(res.data);
          if (this.state.imageSelected) {
            const formData = new FormData();
            formData.append("myFile", this.state.myFile);
            const config = {
              headers: {
                "content-type": "multipart/form-data",
                'Authorization' : localStorage.getItem('token')
              },
            };
            Axios.post(
              `http://localhost:4000/socialLinks/${res.data._id}`,
              formData,
              config
            )
              .then((resImg) => {
                console.log(resImg.data);
                this.setState({
                  socialLinks: [...this.state.socialLinks, resImg.data],
                });
              })
              .catch((error) => console.log(error));
          } else {
            this.setState({
              socialLinks: [...this.state.socialLinks, res.data],
            });
          }
          this.setState({
            isEdit: false,
            imageSelected: false,
            selectedImageFile: "",
            socialName: "",
            socialLink: "",
          });
          alert("Saved...");
        })
        .catch((error) => console.log(error));
    }
  };
  handleDelete = (SID) => {
    const result = window.confirm("Are you sure to delete this Social Link ");
    if (result) {
      Axios.delete(`http://localhost:4000/socialLinks/${SID}`, this.state.authUser)
        .then((res) => {
          const filterData = this.state.socialLinks.filter((item) => {
            return item._id !== SID;
          });
          this.setState({
            socialLinks: filterData,
          });
        })
        .catch((error) => console.log(error));
    }
  };

  render() {
    return (
      <div>
        {/* Social Links section.... */}
        <div className="othersSection_SocialLinksContainer">
          <h4>Social Links Section</h4>
          <Form className="socialLinks_FormSection">
            <FormGroup>
              <Label for="socialName">Name</Label>
              <Input
                type="text"
                id="socialName"
                name="socialName"
                placeholder="Enter name of the social site..."
                value={this.state.socialName}
                onChange={this.handleChange}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="socialLink">Link</Label>
              <Input
                type="text"
                id="socialLink"
                name="socialLink"
                placeholder="Enter Link to the site..."
                value={this.state.socialLink}
                onChange={this.handleChange}
              ></Input>
            </FormGroup>
            <FormGroup className="socialLinks_imageUploadSection">
              <div className="socialLinks_imageUploadSection_input">
                <Label for="myFile">Change Image</Label>
                <Input
                  type="file"
                  name="myFile"
                  id="exampleFile"
                  className="inputFile"
                  onChange={this.handleImageChange}
                />
              </div>
              <div className="socialLinks_imageUploadSection_view">
                {this.state.isEdit && this.state.selectedImageFile ? (
                  <img
                    className="socialLinks_imageSocialLink"
                    src={
                      this.state.imageSocialLinkURL +
                      this.state.selectedImageFile
                    }
                    alt="socialLinkImg"
                  />
                ) : (
                  <div className="social-noImage">Demo Image</div>
                )}
              </div>
            </FormGroup>
            <div className="button-upload">
              {this.state.isEdit ? (
                <Button
                  color="warning"
                  style={{ marginRight: "3rem" }}
                  className="credentials_button"
                  onClick={this.handleSubmit}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  color="primary"
                  style={{ marginRight: "3rem" }}
                  className="credentials_button"
                  onClick={this.handleSubmit}
                >
                  Save
                </Button>
              )}
            </div>
          </Form>
          <div className="socialLinks_list">
            {this.state.socialLinks.map((item) => {
              return (
                <div className="socialLinks_item" key={item._id}>
                  <span
                    className="socialLinks_title"
                    onClick={() => this.onEditChanges(item._id)}
                  >
                    {item.name}
                  </span>
                  <Button
                    close
                    className="product_closeBtn"
                    onClick={() => this.handleDelete(item._id)}
                  ></Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
