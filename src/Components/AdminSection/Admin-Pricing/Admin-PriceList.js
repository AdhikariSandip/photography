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
import "./Admin-PriceList.css";

export default class Admin_Pricing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      productModal: false,

      isEmpty: false,
      priceListImageLink: "http://localhost:4000/priceList/",
      imageSelected: false,

      priceListTitle: "",
      priceListImage: "",
      priceListID: "",
      priceProductList: [],

      productTitle: "",
      productID: "",
      isProductEdit: false,

      priceList: [],
      selectedPriceProduct: "Product Price Info",
      isPriceEdit: false,
      productName: "",
      productPrice: "",
      priceID: "",
      authUser: {
        headers : { 'Authorization' : localStorage.getItem('token') }
    }
    };
  }
  addToggle = () => {
    this.setState({ addModal: !this.state.addModal });
  };
  productToggle = () => {
    this.setState({ productModal: !this.state.productModal });
  };
  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });
  handleImageChange = (e) => {
    this.setState({
      myFile: e.target.files[0],
      imageSelected: true,
    });
  };
  componentDidMount = () => {
    Axios.get("http://localhost:4000/priceList")
      .then((res) => {
        console.log(res.data);
        if (res.data.length === 0) {
          this.setState({ isEmpty: true });
        } else {
          this.setState({
            priceListTitle: res.data[0].title,
            priceListImage: res.data[0].backgroundImage,
            priceProductList: res.data[0].productList,
            priceListID: res.data[0]._id,
          });
        }
      })
      .catch((error) => console.log(error));
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.isEmpty) {
      if (this.state.priceListTitle !== "") {
        Axios.post("http://localhost:4000/priceList", {
          title: this.state.priceListTitle,
        }, this.state.authUser).then((res) => {
          console.log(res.data);
          this.setState({
            priceListID: res.data._id,
            isEmpty: false,
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
              `http://localhost:4000/priceList/${res.data._id}`,
              formData,
              config
            ).then((resImg) => {
              this.setState({
                imageSelected: false,
                priceListImage: resImg.data.backgroundImage,
              });
              alert("posted");
            });
          }
        });
      } else {
        alert("please fill the title..");
      }
    } else {
      alert("editing...");
      if (this.state.priceListTitle !== "") {
        Axios.patch(
          `http://localhost:4000/priceList/${this.state.priceListID}`,
          {
            title: this.state.priceListTitle,
          }, this.state.authUser
        ).then((res) => {
          console.log(res.data);
          this.setState({
            isEmpty: false,
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
              `http://localhost:4000/priceList/${res.data._id}`,
              formData,
              config
            ).then((resImg) => {
              this.setState({
                imageSelected: false,
                priceListImage: resImg.data.backgroundImage,
              });
            });
          }
        });
      } else {
        alert("please fill the title..");
      }
    }
  };

  // product crud starts here....
  handleProductSubmit = (e) => {
    e.preventDefault();
    if (this.state.productTitle) {
      if (this.state.isProductEdit) {
        Axios.patch(
          `http://localhost:4000/priceList/products/${this.state.productID}`,
          {
            productTitle: this.state.productTitle,
          }, this.state.authUser
        )
          .then((res) => {
            this.setState({
              priceProductList: res.data.productList,
              productTitle: "",
              isProductEdit: false,
            });
            alert("saved...");
          })
          .catch((error) => console.log(error));
      } else {
        Axios.post(
          `http://localhost:4000/priceList/${this.state.priceListID}/products`,
          {
            productTitle: this.state.productTitle,
          }, this.state.authUser
        )
          .then((res) => {
            this.setState({
              priceProductList: res.data.productList,
              productTitle: "",
              isProductEdit: false,
            });
            alert("saved...");
          })
          .catch((error) => console.log(error));
      }
    } else {
      alert("please fill the product name..");
    }
  };
  beforeEdit = (PID) => {
    const selectedData = this.state.priceProductList.find((item) => {
      return item._id === PID;
    });
    this.setState({
      productTitle: selectedData.productTitle,
      productID: selectedData._id,
      addModal: !this.state.addModal,
      isProductEdit: true,
    });
  };
  handleDelete = (PID) => {
    const result = window.confirm("Are you sure to delete this product?");
    if (result) {
      Axios.delete(`http://localhost:4000/priceList/products/${PID}`, this.state.authUser)
        .then((res) => {
          console.log(res.data);
          this.setState({
            priceProductList: res.data.productList,
          });
        })
        .catch((err) => console.log(err.res));
    }
  };

  //product price crud starts here....
  handleProductPriceSelect = (ProdID) => {
    const selectedProduct = this.state.priceProductList.find((item) => {
      return item._id === ProdID;
    });
    this.setState({
      productModal: !this.state.productModal,
      productID: selectedProduct._id,
      priceList: selectedProduct.product,
      selectedPriceProduct: selectedProduct.productTitle,
    });
  };
  beforePriceEdit = (priceID) => {
    const selectedPrice = this.state.priceList.find((item) => {
      return item._id === priceID;
    });
    console.log(selectedPrice);
    this.setState({
      isPriceEdit: true,
      productName: selectedPrice.productName,
      productPrice: selectedPrice.price,
      priceID: selectedPrice._id,
    });
  };
  handlePriceSubmit = (e) => {
    e.preventDefault();
    if (this.state.isPriceEdit) {
      if (this.state.productName) {
        Axios.patch(
          `http://localhost:4000/priceList/products/${this.state.productID}/item/${this.state.priceID}`,
          {
            productName: this.state.productName,
            price: this.state.productPrice,
          }, this.state.authUser
        ).then((res) => {
          const filterData = res.data.productList.find((item) => {
            return item._id === this.state.productID;
          });
          console.log(res.data.productList);
          this.setState({
            isPriceEdit: false,
            productName: "",
            productPrice: "",
            priceID: "",
            priceList: filterData.product,
            priceProductList: res.data.productList,
          });
          alert("price updated..");
        });
      }
    } else {
      if (this.state.productName) {
        Axios.post(
          `http://localhost:4000/priceList/products/${this.state.productID}/item`,
          {
            productName: this.state.productName,
            price: this.state.productPrice,
          }, this.state.authUser
        ).then((res) => {
          console.log(res.data);
          const filterData = res.data.productList.find((item) => {
            return item._id === this.state.productID;
          });
          console.log(filterData);
          this.setState({
            isPriceEdit: false,
            productName: "",
            productPrice: "",
            priceID: "",
            priceList: filterData.product,
            priceProductList: res.data.productList,
          });
          alert("price saved..");
        });
      }
    }
  };
  handlePriceDelete = (PriceID) => {
    const result = window.confirm("Are you sure to delete this item?");
    if (result) {
      Axios.delete(
        `http://localhost:4000/priceList/${this.state.productID}/item/${PriceID}`, this.state.authUser
      )
        .then((res) => {
          console.log(res.data);
          const filterData = res.data.productList.find((item) => {
            return item._id === this.state.productID;
          });
          this.setState({
            priceList: filterData.product,
            priceProductList: res.data.productList,
          });
        })
        .catch((err) => console.log(err.res));
    }
  };

  render() {
    return (
      <div>
        <AdminNav />
        <div className="Admin_priceList">
          <h2>Price List</h2>
          <div className="Admin_priceList_box">
            <div className="priceList_input_section">
              <h4 style={{ margin: "2rem 0" }}>Price List Page Details</h4>
              <div className="priceList_input_section_body">
                <div className="Admin_priceList_imageSection">
                  <Form>
                    {this.state.priceListImage ? (
                      <img
                        className="Admin_priceList_background"
                        src={
                          this.state.priceListImageLink +
                          this.state.priceListImage
                        }
                        alt="priceList__image"
                      />
                    ) : (
                      <div className="no-image" style={{ height: "50vh" }}>
                        No Image
                      </div>
                    )}
                    <FormGroup>
                      <Label for="myFile">File</Label>
                      <Input
                        type="file"
                        name="myFile"
                        id="myFile"
                        className="inputFile"
                        onChange={this.handleImageChange}
                      />
                      <FormText color="muted">
                        The landscape images might look better for background..
                      </FormText>
                    </FormGroup>
                  </Form>
                </div>
                <div className="priceList_inputBox">
                  <Label for="priceListTitle">Title</Label>
                  <Input
                    type="text"
                    id="priceListTitle"
                    name="priceListTitle"
                    placeholder="Enter title for price list page..."
                    value={this.state.priceListTitle}
                    onChange={this.handleChange}
                  ></Input>
                </div>
              </div>

              <div className="priceList_buttons">
                <Button color="primary" onClick={this.handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>

            {/* product price list start here... */}
            <div className="priceList_products_container">
              <h2>Product Price List</h2>
              <div className="priceList_addButton">
                <Button color="primary" onClick={this.addToggle}>
                  Create New
                </Button>
              </div>
              <div className="priceList_products_list">
                {this.state.priceProductList.map((item) => {
                  return (
                    <div className="priceList_products_item" key={item._id}>
                      <span
                        className="priceList_product_title"
                        onClick={() => this.handleProductPriceSelect(item._id)}
                      >
                        {item.productTitle}
                      </span>
                      <Button
                        color="info"
                        size="sm"
                        onClick={() => this.beforeEdit(item._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => this.handleDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* modals start here... */}
        {/* add modal for product price List */}
        <Modal
          isOpen={this.state.addModal}
          toggle={this.addToggle}
          className="priceList_productPriceUpload_modal"
        >
          <ModalHeader toggle={this.addToggle}>Product info</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="productTitle">Title</Label>
                <Input
                  type="text"
                  name="productTitle"
                  id="productTitle"
                  placeholder="Enter Product title here..."
                  value={this.state.productTitle}
                  onChange={this.handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            {this.state.isProductEdit ? (
              <Button color="warning" onClick={this.handleProductSubmit}>
                Update
              </Button>
            ) : (
              <Button color="primary" onClick={this.handleProductSubmit}>
                Save
              </Button>
            )}{" "}
            <Button color="secondary" onClick={this.addToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* product and price list modal */}
        <Modal
          isOpen={this.state.productModal}
          toggle={this.productToggle}
          className="priceList_detailsUpload_modal"
        >
          <ModalHeader toggle={this.productToggle}>
            {this.state.selectedPriceProduct}
          </ModalHeader>
          <ModalBody>
            <Form className="priceList_modal_form">
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
                <Label for="productPrice">Price</Label>
                <Input
                  type="text"
                  name="productPrice"
                  id="productPrice"
                  placeholder="Enter Product Price here..."
                  value={this.state.productPrice}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup className="priceList_modalButton">
                {this.state.isPriceEdit ? (
                  <Button color="warning" onClick={this.handlePriceSubmit}>
                    Update
                  </Button>
                ) : (
                  <Button color="primary" onClick={this.handlePriceSubmit}>
                    Save
                  </Button>
                )}
              </FormGroup>
            </Form>

            <div className="priceList_productPriceList_container">
              <h2>Product Price List</h2>
              <div className="priceList_productPriceList">
                {this.state.priceList.map((item) => {
                  return (
                    <div
                      className="priceList_productPriceList_item"
                      key={item._id}
                    >
                      <span
                        className="priceList_productPriceItem_title"
                        onClick={() => this.beforePriceEdit(item._id)}
                      >
                        {item.productName} - {item.price}
                      </span>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => this.handlePriceDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
