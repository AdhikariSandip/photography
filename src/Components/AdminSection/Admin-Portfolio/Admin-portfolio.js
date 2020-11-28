import React, { Component } from "react";
import AdminNav from "../Navigation/admin-nav";
import "./Admin-portfolio.css";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
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

export default class Admin_portfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      modal: false,
      imageUploadModal: false,
      imagePortURL: "http://localhost:4000/portfolio/",

      isEdit: false,
      portfolioTitle: "",
      portfolioDescription: "",
      portfolioID: "",
      portfolioData: [],

      selectedPortfolioTitle: "Choose Gallery",
      selectedPortfolioID: "",
      selectedImages: [],
      imageSelected: false,
      authUser: {
        headers : { 'Authorization' : localStorage.getItem('token') }
    }
    };
  }

  toggle = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });
  toggleModal = () => this.setState({ modal: !this.state.modal });
  imageUploadToggle = () => {
    this.setState({ imageUploadModal: !this.state.imageUploadModal });
  };

  componentDidMount = () => {
    Axios.get("http://localhost:4000/portfolio").then((res) => {
      console.log(res.data);
      this.setState({
        portfolioData: res.data,
      });
    }).catch((error) => console.log(error));
  };
  //portfolio crud starts....
  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onEditChanges = (PID) => {
    const selectedData = this.state.portfolioData.find((item) => {
      return item._id === PID;
    });
    this.setState({
      isEdit: true,
      portfolioID: selectedData._id,
      portfolioTitle: selectedData.title,
      portfolioDescription: selectedData.description,
    });
  };
  handleDelete = (PID) => {
    const result = window.confirm("Are you sure?");
    if (result) {
      Axios.delete(`http://localhost:4000/portfolio/${PID}`, this.state.authUser)
        .then((res) => {
          const filter = this.state.portfolioData.filter((item) => {
            return item._id !== PID;
          });
          this.setState({
            portfolioData: filter,
            selectedPortfolioTitle: "Choose Gallery",
            selectedPortfolioID: "",
            selectedImages: [],
            imageSelected: false,
          });
        })
        .catch((err) => console.log(err.res));
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.portfolioTitle !== "") {
      if (this.state.isEdit) {
        Axios.patch(
          `http://localhost:4000/portfolio/details/${this.state.portfolioID}`,
          {
            title: this.state.portfolioTitle,
            description: this.state.portfolioDescription,
          }, this.state.authUser
        )
          .then((res) => {
            console.log(res.data);
            const filterData = this.state.portfolioData.map((item) => {
              if (item._id === this.state.portfolioID) {
                item.title = this.state.portfolioTitle;
                item.description = this.state.portfolioDescription;
              }
              return item;
            });
            this.setState({
              portfolioData: filterData,
              isEdit: false,
              portfolioTitle: "",
              portfolioDescription: "",
              portfolioID: "",
              selectedPortfolioTitle: "Choose Gallery",
              selectedPortfolioID: "",
              selectedImages: [],
              imageSelected: false,
            });
            alert("Gallery saved..");
          })
          .catch((error) => console.log(error));
      } else {
        Axios.post("http://localhost:4000/portfolio", {
          title: this.state.portfolioTitle,
          description: this.state.portfolioDescription,
        }, this.state.authUser)
          .then((res) => {
            console.log(res.data);
            this.setState({
              portfolioData: [...this.state.portfolioData, res.data],
              portfolioTitle: "",
              portfolioDescription: "",
              portfolioID: "",
              isEdit: false,
              selectedPortfolioTitle: "Choose Gallery",
            selectedPortfolioID: "",
            selectedImages: [],
            imageSelected: false,
            });
            alert("Gallery Created...");
          })
          .catch((error) => console.log(error));
      }
    } else {
      alert("Please fill out the title..");
    }
  };
  //portfolio crud ends here......

  handleTitleChange = (PortID) => {
    const selectedData = this.state.portfolioData.find((item) => {
      return item._id === PortID;
    });
    this.setState({
      selectedPortfolioTitle: selectedData.title,
      selectedPortfolioID: selectedData._id,
      selectedImages: selectedData.portImage,
    });
    // alert(selectedData.title + " is selected..");
  };
  handleImageChange = (e) => {
    this.setState({
      myFile: e.target.files[0],
      imageSelected: true,
    });
  };
  handleImageUpload = () => {
    if (this.state.imageSelected && this.state.selectedPortfolioID) {
      const formData = new FormData();
      formData.append("myFile", this.state.myFile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          'Authorization' : localStorage.getItem('token')
        },
      };
      Axios.post(
        `http://localhost:4000/portfolio/${this.state.selectedPortfolioID}`,
        formData,
        config
      ).then((res) => {
        // console.log(res.data)
        const filteredData = this.state.portfolioData.map((item) => {
          if (item._id === res.data._id) {
            item.portImage = res.data.portImage
          }
          return item;
        })
        this.setState({
          imageSelected: false,
          portfolioData: filteredData,
          selectedImages: res.data.portImage
        })
      }).catch((error) => console.log(error))
    } else {
      alert("Please select a Gallery and choose an image..")
    }
  };
  handleImageDelete = (PortID) => {
    const result = window.confirm("Are you sure to delete this Image? ");
    if (result) {
      Axios.delete(`http://localhost:4000/portfolio/image/${PortID}`, this.state.authUser)
      .then((res) => {
        const filterData = this.state.portfolioData.map((item) => {
          if (item._id === PortID) {
            item.portImage = res.data.portImage
          }
          return item;
        })
        this.setState({
          imageSelected: false,
          portfolioData: filterData,
          selectedImages: res.data.portImage
        })
      }).catch((error) => console.log(error))
    }
  }

  render() {
    return (
      <div>
        <AdminNav />
        <div className="adminPortfolio">
          <h2>Portfolio and Galleries</h2>
          <div className="adminPortfolio_buttons">
            <Button color="primary" onClick={this.toggleModal}>
              New Gallery
            </Button>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret>
                {this.state.selectedPortfolioTitle}
              </DropdownToggle>
              <DropdownMenu>
                {this.state.portfolioData.map((item) => {
                  return (
                    <DropdownItem
                      key={item._id}
                      onClick={() => this.handleTitleChange(item._id)}
                    >
                      {item.title}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="portfolio_gallery_images">
            {(this.state.selectedImages) ? (
              this.state.selectedImages.map((item) => {
                return (
                  <div className="portfolio_gallery_card" key={item._id}>
                    <img
                      className="gallery_image"
                      src={this.state.imagePortURL + item.pImage}
                      alt="portfolio"
                    />
                    <div className="gallery_card_button">
                      <Button className="gallery_card_delete" color="danger" onClick={() => this.handleImageDelete(item._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-image">Oops....Image not found</div>
            )}
          </div>
          <div className="button-uploadGallery">
            <Button
              className="gallery_upload"
              color="primary"
              onClick={this.imageUploadToggle}
            >
              Upload
            </Button>
          </div>
        </div>
        {/* modals start here.... */}
        {/* New gallery modal */}
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className="portfolio_gallery_modal"
        >
          <ModalHeader toggle={this.toggleModal}>New Gallery</ModalHeader>
          <ModalBody>
            <Form style={{ padding: "0 2rem" }}>
              <FormGroup>
                <Label for="portfolioTitle">Gallery Name</Label>
                <Input
                  type="text"
                  name="portfolioTitle"
                  id="portfolioTitle"
                  placeholder="Enter the Gallery name here..."
                  value={this.state.portfolioTitle}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="portfolioDescription">Description</Label>
                <Input
                  type="text"
                  name="portfolioDescription"
                  id="portfolioDescription"
                  placeholder="short description about the gallery"
                  value={this.state.portfolioDescription}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter className="portfolioUpload_Modal">
            <div>
              {this.state.isEdit ? (
                <Button
                  color="warning"
                  onClick={this.handleSubmit}
                  style={{ marginRight: "1rem" }}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  color="primary"
                  onClick={this.handleSubmit}
                  style={{ marginRight: "1rem" }}
                >
                  Save
                </Button>
              )}{" "}
              <Button color="secondary" onClick={this.toggleModal}>
                Cancel
              </Button>
            </div>
            <div className="portfolioData_list">
              {this.state.portfolioData.map((item) => {
                return (
                  <div className="portfolioData_item" key={item._id}>
                    <span
                      className="portfolioData_title"
                      onClick={() => this.onEditChanges(item._id)}
                    >
                      {item.title}
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
          </ModalFooter>
        </Modal>

        {/* gallery image upload modal */}

        <Modal
          isOpen={this.state.imageUploadModal}
          toggle={this.imageUploadToggle}
          className="portfolio_imageUpload_modal"
        >
          <ModalHeader toggle={this.imageUploadToggle}>
            Upload Gallery Images
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
                  Images are uploaded to the gallery selected previously...
                </FormText>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleImageUpload}>
              Submit
            </Button>{" "}
            <Button color="secondary" onClick={this.imageUploadToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
