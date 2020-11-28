import React, { Component } from "react";
import AdminNav from "../Navigation/admin-nav";
import "./Admin-Blog.css";
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
export default class Admin_Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      modal: false,
      imageUploadModal: false,
      imageBlogURL: "http://localhost:4000/blog/",

      isEdit: false,
      blogTitle: "",
      blogDescription: "",
      blogID: "",
      blogData: [],

      selectedBlogTitle: "Choose Blog",
      selectedBlogID: "",
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
    Axios.get("http://localhost:4000/blog")
      .then((res) => {
        console.log(res.data);
        this.setState({
          blogData: res.data,
        });
      })
      .catch((error) => console.log(error));
  };
  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  //blog crud starts here....
  onEditChanges = (BID) => {
    const selectedData = this.state.blogData.find((item) => {
      return item._id === BID;
    });
    this.setState({
      isEdit: true,
      blogID: selectedData._id,
      blogTitle: selectedData.title,
      blogDescription: selectedData.description,
    });
  };
  handleDelete = (BID) => {
    const result = window.confirm("Are you sure?");
    if (result) {
      Axios.delete(`http://localhost:4000/blog/${BID}`, this.state.authUser)
        .then((res) => {
          const filter = this.state.blogData.filter((item) => {
            return item._id !== BID;
          });
          this.setState({
            blogData: filter,
            selectedBlogTitle: "Choose Blog",
            selectedBlogID: "",
            selectedImages: [],
            imageSelected: false,
          });
        })
        .catch((err) => console.log(err.res));
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.blogTitle !== "") {
      if (this.state.isEdit) {
        Axios.patch(`http://localhost:4000/blog/details/${this.state.blogID}`, {
          title: this.state.blogTitle,
          description: this.state.blogDescription,
        }, this.state.authUser)
          .then((res) => {
            console.log(res.data);
            const filterData = this.state.blogData.map((item) => {
              if (item._id === this.state.blogID) {
                item.title = this.state.blogTitle;
                item.description = this.state.blogDescription;
              }
              return item;
            });
            this.setState({
              blogData: filterData,
              isEdit: false,
              blogTitle: "",
              blogDescription: "",
              blogID: "",
              selectedBlogTitle: "Choose Blog",
              selectedBlogID: "",
              selectedImages: [],
              imageSelected: false,
            });
            alert("Gallery saved..");
          })
          .catch((error) => console.log(error));
      } else {
        Axios.post("http://localhost:4000/blog", {
          title: this.state.blogTitle,
          description: this.state.blogDescription,
        }, this.state.authUser)
          .then((res) => {
            console.log(res.data);
            this.setState({
              blogData: [...this.state.blogData, res.data],
              blogTitle: "",
              blogDescription: "",
              blogID: "",
              isEdit: false,
              selectedBlogTitle: "Choose Blog",
              selectedBlogID: "",
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

  //blog crud ends here....
  handleTitleChange = (BlogID) => {
    const selectedData = this.state.blogData.find((item) => {
      return item._id === BlogID;
    });
    this.setState({
      selectedBlogTitle: selectedData.title,
      selectedBlogID: selectedData._id,
      selectedImages: selectedData.blogImage,
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
    if (this.state.imageSelected && this.state.selectedBlogID) {
      const formData = new FormData();
      formData.append("myFile", this.state.myFile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          'Authorization' : localStorage.getItem('token')
        },
      };
      Axios.post(
        `http://localhost:4000/blog/${this.state.selectedBlogID}`,
        formData,
        config
      ).then((res) => {
        // console.log(res.data)
        const filteredData = this.state.blogData.map((item) => {
          if (item._id === res.data._id) {
            item.blogImage = res.data.blogImage
          }
          return item;
        })
        this.setState({
          imageSelected: false,
          blogData: filteredData,
          selectedImages: res.data.blogImage
        })
        alert("Image saved...")
      }).catch((error) => console.log(error))
    } else {
      alert("Please select a Blog and choose an image..")
    }
  };
  handleImageDelete = (BlogID) => {
    const result = window.confirm("Are you sure to delete this Image? ");
    if (result) {
      Axios.delete(`http://localhost:4000/blog/image/${BlogID}`, this.state.authUser)
      .then((res) => {
        // console.log(res.data)
        const filterData = this.state.blogData.map((item) => {
          if (item._id === BlogID) {
            item.blogImage = res.data.blogImage
          }
          return item;
        })
        this.setState({
          imageSelected: false,
          blogData: filterData,
          selectedImages: res.data.blogImage
        })
      }).catch((error) => console.log(error))
    }
  }

  render() {
    return (
      <div>
        <AdminNav />
        <div className="adminBlog">
          <h2>Blogs Section</h2>
          <div className="adminBlog_buttons">
            <Button color="primary" onClick={this.toggleModal}>
              New Blog
            </Button>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret>
                {this.state.selectedBlogTitle}
              </DropdownToggle>
              <DropdownMenu>
                {this.state.blogData.map((item) => {
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
          <div className="blog_gallery_images">
          {(this.state.selectedImages) ? (
              this.state.selectedImages.map((item) => {
                return (
                  <div className="blog_gallery_card" key={item._id}>
                    <img
                      className="blog_gallery_image"
                      src={this.state.imageBlogURL + item.bImage}
                      alt="blog"
                    />
                    <div className="blog_gallery_card_button">
                      <Button className="blog_gallery_card_delete" color="danger" onClick={() => this.handleImageDelete(item._id)}>
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
          <div className="button-uploadBlogImage">
            <Button
              className="BlogImage_upload"
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
          className="blogGallery_modal"
        >
          <ModalHeader toggle={this.toggleModal}>New Blog</ModalHeader>
          <ModalBody>
            <Form style={{ padding: "0 2rem" }}>
              <FormGroup>
                <Label for="blogTitle">Blog Name</Label>
                <Input
                  type="text"
                  name="blogTitle"
                  id="blogTitle"
                  placeholder="Enter the Blog name here..."
                  value={this.state.blogTitle}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="blogDescription">Description</Label>
                <Input
                  type="text"
                  name="blogDescription"
                  id="blogDescription"
                  placeholder="short description about the blog"
                  value={this.state.blogDescription}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter className="blogUpload_Modal">
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
            <div className="blogData_list">
              {this.state.blogData.map((item) => {
                return (
                  <div className="blogData_item" key={item._id}>
                    <span
                      className="blogData_title"
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
          className="blog_imageUpload_modal"
        >
          <ModalHeader toggle={this.imageUploadToggle}>
            Upload Blog Images
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="myFile">File</Label>
                <Input type="file" name="myFile" id="myFile" onChange={this.handleImageChange}/>
                <FormText color="muted">
                  Images are uploaded to the Blog selected previously...
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
