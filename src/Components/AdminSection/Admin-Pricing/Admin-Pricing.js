import Axios from "axios";
import React, { Component } from "react";
import {
  Input,
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  FormText,
  ModalFooter,
} from "reactstrap";
import AdminNav from "../Navigation/admin-nav";
import "./Admin-Pricing.css";

export default class Admin_Pricing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      editModal: false,

      isEmpty: false,
      pricingTitle: "",
      pricingDescription: "",
      pricingID: "",
      pricingImageLink: "http://localhost:4000/product/",

      productID: "",
      productName: "",
      productFeatures: "",
      pricingProductList: [],
      imageSelected: false,
      productImage: "",
      authUser: {
        headers : { 'Authorization' : localStorage.getItem('token') }
    }
    };
  }

  addToggle = () => {
    this.setState({ addModal: !this.state.addModal });
  };
  editToggle = () => {
    this.setState({ editModal: !this.state.editModal });
  };
  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.isEmpty) {
      Axios.post(`http://localhost:4000/productList`, {
        title: this.state.pricingTitle,
        description: this.state.pricingDescription,
      }, this.state.authUser).then((res) => {
        console.log(res.data);
        this.setState({
          isEmpty: false,
          pricingID: res.data._id,
        });
        alert("Saved..");
      });
    } else {
      Axios.patch(`http://localhost:4000/productList/${this.state.pricingID}`, {
        title: this.state.pricingTitle,
        description: this.state.pricingDescription,
      }, this.state.authUser).then((res) => {
        console.log(res.data);
        this.setState({
          isEmpty: false,
        });
        alert("Saved..");
      });
    }
  };
  componentDidMount = () => {
    Axios.get("http://localhost:4000/productList")
      .then((res) => {
        if (res.data.length === 0) {
          this.setState({ isEmpty: true });
        } else {
          this.setState({
            pricingProductList: res.data[0].products,
            pricingTitle: res.data[0].title,
            pricingDescription: res.data[0].description,
            pricingID: res.data[0]._id,
          });
        }
      })
      .catch((error) => console.log(error));
  };
  // crud for the products starts here....
  handleImageChange = (e) => {
    this.setState({
      myFile: e.target.files[0],
      imageSelected: true,
    });
  };
  handleEditChanges = (PID) => {
    const selectedProduct = this.state.pricingProductList.find((item) => {
      return item._id === PID;
    });
    console.log(selectedProduct);
    this.setState({
      editModal: !this.state.editModal,
      productID: selectedProduct._id,
      productName: selectedProduct.name,
      productFeatures: selectedProduct.feature,
      productImage: selectedProduct.productImage,
    });
  };
  handleEditSubmit = (e) => {
    e.preventDefault();
    Axios.patch(
      `http://localhost:4000/productList/investment/${this.state.productID}`,
      {
        name: this.state.productName,
        feature: this.state.productFeatures,
      }, this.state.authUser
    )
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
            `http://localhost:4000/productList/investment/${this.state.productID}`,
            formData,
            config
          ).then((resImg) => {
            this.setState({
              pricingProductList: resImg.data.products,
              productID: "",
              productName: "",
              productFeatures: "",
              editModal: !this.state.editModal,
            });
          });
        } else {
          this.setState({
            editModal: !this.state.editModal,
          });
        }
        this.setState({
          productID: "",
          productName: "",
          productFeatures: "",
          pricingProductList: res.data.products,
        });
      })
      .catch((error) => console.log(error));
  };
  addProductDetails = (e) => {
    e.preventDefault();
    if (this.state.productName) {
      Axios.post(
        `http://localhost:4000/productList/${this.state.pricingID}/investment`,
        {
          name: this.state.productName,
          feature: this.state.productFeatures,
        }, this.state.authUser
      )
        .then((res) => {
          console.log(res.data);
          this.setState({
            productID: "",
            productName: "",
            productFeatures: "",
            pricingProductList: res.data.products,
          });
        })
        .catch((error) => console.log(error));
    } else {
      alert("Please fill product name..");
    }
  };
  handleDelete = (PID) => {
    const result = window.confirm("Are you sure to delete this product?");
    if (result) {
      Axios.delete(`http://localhost:4000/productList/investment/${PID}`, this.state.authUser)
        .then((res) => {
          console.log(res.data)
          this.setState({
            pricingProductList: res.data.products
          });
        })
        .catch((err) => console.log(err.res));
    }
  };

  // crud for the products ends here....

  render() {
    return (
      <div>
        <AdminNav />
        <div className="Admin_pricingDetails">
          <h2>Pricing & Products</h2>
          <div className="Admin_pricingDetails_box">
            <div className="pricingDetails_input_section">
              <h4 style={{ marginTop: "2rem" }}>Pricing & Product Info</h4>
              <div className="pricingDetails_inputBox">
                <Label for="pricingTitle">Title</Label>
                <Input
                  type="text"
                  id="pricingTitle"
                  name="pricingTitle"
                  placeholder="Enter title for pricing page..."
                  value={this.state.pricingTitle}
                  onChange={this.handleChange}
                ></Input>
              </div>
              <div className="pricingDetails_inputBox">
                <Label for="pricingDescription">Description</Label>
                <Input
                  type="textarea"
                  id="pricingDescription"
                  name="pricingDescription"
                  className="pricingDescription"
                  placeholder="Enter descriptions for pricing page..."
                  value={this.state.pricingDescription}
                  onChange={this.handleChange}
                ></Input>
              </div>

              <div className="pricingDetails_buttons">
                <Button color="primary" onClick={this.handleSubmit}>
                  Save
                </Button>
              </div>
            </div>
            {/* packages start here... */}
            <div className="pricingDetails_products_container">
              <h2>Product List</h2>
              <div className="pricingDetails_addButton">
                <Button color="primary" onClick={this.addToggle}>
                  Create New
                </Button>
              </div>
              <div className="pricingDetails_products_list">
                {this.state.pricingProductList.map((item) => {
                  return (
                    <div
                      className="pricingDetails_products_item"
                      key={item._id}
                    >
                      <span
                        className="pricingDetails_product_title"
                        onClick={() => this.handleEditChanges(item._id)}
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
        </div>
        {/* modals start here.... */}
        {/* add modal... */}
        <Modal
          isOpen={this.state.addModal}
          toggle={this.addToggle}
          className="pricingDetails_productUpload_modal"
        >
          <ModalHeader toggle={this.addToggle}>Product Details</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="productName">Name</Label>
                <Input
                  type="text"
                  name="productName"
                  id="productName"
                  placeholder="Enter Product name here..."
                  value={this.state.productName}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="productFeatures">Features</Label>
                <Input
                  type="textarea"
                  className="productUpload_featuresText"
                  name="productFeatures"
                  id="productFeatures"
                  placeholder="short features about the product.."
                  value={this.state.productFeatures}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addProductDetails}>
              Submit
            </Button>{" "}
            <Button color="secondary" onClick={this.addToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* edit Modal */}
        <Modal
          isOpen={this.state.editModal}
          toggle={this.editToggle}
          className="pricingDetails_productEdit_modal"
        >
          <ModalHeader toggle={this.editToggle}>
            Update Product Details
          </ModalHeader>
          <ModalBody>
            <Form>
              <div className="productEdit_container">
                <div className="productEdit_imageSection">
                  {this.state.productImage ? (
                    <img
                      className="productEdit_productImage"
                      src={
                        this.state.pricingImageLink + this.state.productImage
                      }
                      alt="portfolio"
                    />
                  ) : (
                    <div className="no-image" style={{ height: "100%" }}>
                      No Image
                    </div>
                  )}
                  <FormGroup style={{ margin: "1rem" }}>
                    <Label for="myFile">Change Image</Label>
                    <Input
                      type="file"
                      name="myFile"
                      id="myFile"
                      className="inputFile"
                      onChange={this.handleImageChange}
                    />
                    <FormText color="muted">
                      The images thus updated can be viewed after saving...
                    </FormText>
                  </FormGroup>
                </div>
                <div className="productEdit_detailsSection">
                  <FormGroup>
                    <Label for="productName">Name</Label>
                    <Input
                      type="text"
                      name="productName"
                      id="productName"
                      placeholder="Enter Product name here..."
                      value={this.state.productName}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="productFeatures">Features</Label>
                    <Input
                      type="textarea"
                      className="productUpload_featuresText"
                      name="productFeatures"
                      id="productFeatures"
                      placeholder="short features about the product.."
                      value={this.state.productFeatures}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </div>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleEditSubmit}>
              Submit
            </Button>{" "}
            <Button color="secondary" onClick={this.editToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
