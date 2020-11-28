import React, { Component } from "react";
import AdminNav from "../Navigation/admin-nav";
import "./dashboard.css";
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

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      homeModal: false,
      imageCollection: [],
      imageSelected: false,
      imageGridSelected: false,
      imageURL: "http://localhost:4000/home/homeBackground/",
      gridImageCollection: [],
      gridImageURL: "http://localhost:4000/home/homeGrid/",
      gridTitle: '',
      gridDescription: '',
      authUser: {
        headers : { 'Authorization' : localStorage.getItem('token') }
    }
    };
  }
  toggle = () => this.setState({ modal: !this.state.modal });

  homeToggle = () => this.setState({ homeModal: !this.state.homeModal });

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.imageSelected) {
      const formData = new FormData();
      formData.append("myFile", this.state.myFile);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        'Authorization' : localStorage.getItem('token')
      },
    };
    Axios.post("http://localhost:4000/home", formData, config)
    .then((res) => {
      this.setState({
          imageCollection: [...this.state.imageCollection, res.data],
          imageSelected: false
        });
        alert("Saved...")
      })
      .catch((err) => console.log(err));
    } else{
      alert("Please select an image...")
    }
  };
  handleGridSubmit = (e) => {
    e.preventDefault();
    if(this.state.imageGridSelected) {
      const formData = new FormData();
      formData.append("myFile", this.state.gridFile);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        'Authorization' : localStorage.getItem('token')
      },
    };
    Axios.post("http://localhost:4000/homeGrid", formData, config)
    .then((res) => {
      const GID = res.data._id;
      Axios.post(`http://localhost:4000/homeGrid/${GID}`, {
        title: this.state.gridTitle,
        description: this.state.gridDescription
      }, this.state.authUser)
      .then((response) => {
        console.log(response.data)
      })
      this.setState({
        gridImageCollection: [...this.state.gridImageCollection, res.data],
        imageGridSelected: false
      });
      alert("Saved...")
    }).catch((err) => console.log(err));
    } else{
      alert("Please select an image...")
    }
  }
  handleImageChange = (e) => {
    this.setState({
      myFile: e.target.files[0],
      imageSelected: true,
    });
  };
  handleGridImageChange = (e) => {
    this.setState({
      gridFile: e.target.files[0],
      imageGridSelected: true,
    });
  }
  handleDelete = (id) => {
    const result = window.confirm("Are you sure to delete this image?");
    if (result) {
      Axios.delete(`http://localhost:4000/home/${id}`, this.state.authUser)
      .then((res) => {
        const filterData = this.state.imageCollection.filter((item) => {
          return item._id !== id;
        });
        this.setState({
          imageCollection : filterData
        });
      }).catch(error => console.log(error));
    }
  };
  handleGridDelete = (gid) => {
    const result = window.confirm("Are you sure to delete this image?");
    if (result) {
      Axios.delete(`http://localhost:4000/homeGrid/${gid}`, this.state.authUser)
      .then((res) => {
        const filterData = this.state.gridImageCollection.filter((item) => {
          return item._id !== gid;
        });
        this.setState({
          gridImageCollection : filterData
        });
      }).catch(error => console.log(error));
    }
    
  }
  handleChange = (e) => this.setState({ [e.target.name]: e.target.value })
  componentDidMount = () => {
    Axios.get("http://localhost:4000/home")
      .then((res) => {
        console.log(res.data);
        this.setState({
          imageCollection: res.data,
        });
      })
      .catch((error) => console.log(error));
    Axios.get("http://localhost:4000/homeGrid")
      .then((res) => {
        console.log(res.data);
        this.setState({
          gridImageCollection: res.data,
        });
      })
      .catch((error) => console.log(error));
    
  };

  render() {
    return (
      <div>
        <AdminNav />
        <div className="home_background">
          <h2>Home Background Images</h2>
          <div className="home_background_images">
            {this.state.imageCollection.map((imageItem) => {
              return <div key={imageItem._id} className="home_background_card">
                  <img className="background_image" src={this.state.imageURL + imageItem.image} alt="background"/>
                  <div className="card_button">
                    <Button
                      color="danger"
                      onClick={() => this.handleDelete(imageItem._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
            })}
          </div>
          <div className="button-upload">
            <Button
              color="primary"
              onClick={this.homeToggle}
              className="background_upload"
            >
              Upload
            </Button>
          </div>
          {/* home background modal section */}
          <Modal
            isOpen={this.state.homeModal}
            toggle={this.homeToggle}
            className="homeBackground_imageUpload_modal"
          >
            <ModalHeader toggle={this.homeToggle}>
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
              <Button color="secondary" onClick={this.homeToggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        {/* grid section */}
        <div className="home_grid">
          <h2>Home Grid Images</h2>
          <div className="home_grid_images">
          {this.state.gridImageCollection.map((imageGridItem) => {
              return <div key={imageGridItem._id} className="home_grid_card">
                  <img className="grid_image" src={this.state.gridImageURL + imageGridItem.gridImage} alt="grid background"/>
                  <div className="card_button">
                    <Button
                      color="danger"
                      onClick={() => this.handleGridDelete(imageGridItem._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
            })}          
          </div>
          <div className="button-upload">
            <Button
              color="primary"
              onClick={this.toggle}
              className="grid_upload"
            >
              Upload
            </Button>
            {/* modal section */}
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              className="home_imageUpload_modal"
            >
              <ModalHeader toggle={this.toggle}>Home Grid</ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="gridTitle">Title</Label>
                    <Input
                      type="text"
                      name="gridTitle"
                      id="gridTitle"
                      placeholder="Enter the image title here.."
                      value={this.state.gridTitle}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="gridItemDescription">Description</Label>
                    <Input
                      type="text"
                      name="gridDescription"
                      id="gridDescription"
                      placeholder="short description about the image.."
                      value={this.state.gridDescription}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="gridFile">File</Label>
                    <Input type="file" name="gridFile" id="gridFile" onChange={this.handleGridImageChange}/>
                    <FormText color="muted">
                      The images of ratio 4:3 might look better in grid
                      section...
                    </FormText>
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.handleGridSubmit}>
                  Submit
                </Button>{" "}
                <Button color="secondary" onClick={this.toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
