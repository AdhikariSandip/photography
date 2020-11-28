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
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import AdminNav from "../Navigation/admin-nav";
import "./Admin-Packages.css";

export default class Admin_Packages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      modal: false,

      isEmpty: false,
      packageImageLink: "http://localhost:4000/package/",
      imageSelected: false,

      packageData: [],
      isPackageEdit: false,
      packageID: "",
      packageTitle: "",
      packageDescription: "",

      selectedPackageTitle: "Choose Package Category",
      selectedPackageID: "",
      selectedPackages: [],

      packageName: "",
      packageServices: [],
      serviceName: "",

      isPackageInfoEdit: false,
      packageInfoID: "",
      authUser: {
        headers : { 'Authorization' : localStorage.getItem('token') }
    }
    };
  }

  toggle = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });
  addToggle = () => {
    this.setState({
      modal: !this.state.modal,
      isPackageEdit: false,
      packageID: "",
      packageTitle: "",
      packageDescription: "",
    });
  };
  componentDidMount = () => {
    Axios.get("http://localhost:4000/package")
      .then((res) => {
        console.log(res.data);
        this.setState({
          packageData: res.data,
        });
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
  handleTitleChange = (PID) => {
    const selectedData = this.state.packageData.find((item) => {
      return item._id === PID;
    });
    this.setState({
      selectedPackageTitle: selectedData.title,
      selectedPackageID: selectedData._id,
      selectedPackages: selectedData.packages,
      packageName: "",
      packageServices: [],
      serviceName: "",
      isPackageInfoEdit: false,
    });
  };
  handlePackageEdit = (PID) => {
    const selectedData = this.state.packageData.find((item) => {
      return item._id === PID;
    });
    this.setState({
      isPackageEdit: true,
      packageID: selectedData._id,
      packageTitle: selectedData.title,
      packageDescription: selectedData.description,
    });
  };

  // package crud start here...
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.packageTitle) {
      if (this.state.isPackageEdit) {
        Axios.patch(`http://localhost:4000/package/${this.state.packageID}`, {
          title: this.state.packageTitle,
          description: this.state.packageDescription,
        }, this.state.authUser)
          .then((res) => {
            console.log(res.data);
            const filterData = this.state.packageData.map((item) => {
              if (item._id === this.state.packageID) {
                item.title = res.data.title;
                item.description = res.data.description;
              }
              return item;
            });
            this.setState({
              packageData: filterData,
              isPackageEdit: false,
              packageID: "",
              packageTitle: "",
              packageDescription: "",
            });
            alert("package updated..");
          })
          .catch((error) => console.log(error));
      } else {
        Axios.post("http://localhost:4000/package", {
          title: this.state.packageTitle,
          description: this.state.packageDescription,
        }, this.state.authUser)
          .then((res) => {
            console.log(res.data);
            this.setState({
              packageData: this.state.packageData.concat(res.data),
              isPackageEdit: false,
              packageID: "",
              packageTitle: "",
              packageDescription: "",
            });
            alert("package created..");
          })
          .catch((error) => console.log(error));
      }
    } else {
      alert("please fill the package title...");
    }
  };
  handlePackageDelete = (PID) => {
    const result = window.confirm(
      "Are you sure to delete this package Category and its contents? "
    );
    if (result) {
      Axios.delete(`http://localhost:4000/package/${PID}`, this.state.authUser)
        .then((res) => {
          const filterData = this.state.packageData.filter((item) => {
            return item._id !== PID;
          });
          this.setState({
            packageData: filterData,
            isPackageEdit: false,
            packageID: "",
            packageTitle: "",
            packageDescription: "",
          });
          alert("package deleted..");
        })
        .catch((error) => console.log(error));
    }
  };
  //package crud ends here....

  //package info crud starts here.......
  handleAddServices = (e) => {
    const duplicateData = this.state.packageServices.filter((dup) => {
      return dup.serviceName.trim() === this.state.serviceName.trim();
    });
    if (duplicateData.length >= 1) {
      return alert("Service already exists...");
    }
    if (this.state.serviceName) {
      this.setState({
        packageServices: this.state.packageServices.concat({
          serviceName: this.state.serviceName.trim(),
        }),
        serviceName: "",
      });
    } else {
      alert("please fill some details for service name...");
    }
  };
  handleServicesRemove = (name) => {
    const selected = this.state.packageServices.filter((item) => {
      return item.serviceName !== name;
    });
    this.setState({
      packageServices: selected,
    });
  };
  //package info crud ends here.......
  handlePackageInfoEdit = (PoID) => {
    const selectedPackageInfo = this.state.selectedPackages.find((item) => {
      return item._id === PoID;
    });
    // console.log(selectedPackageInfo)
    this.setState({
      isPackageInfoEdit: true,
      packageName: selectedPackageInfo.name,
      packageServices: selectedPackageInfo.services,
      packageInfoID: selectedPackageInfo._id,
    });
  };
  handlePackageInfoSubmit = (e) => {
    // console.log(this.state.packageServices)
    e.preventDefault();

    const formData = new FormData();
    formData.append("myFile", this.state.myFile);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        'Authorization' : localStorage.getItem('token')
      },
    };
    if (this.state.isPackageInfoEdit) {
      if (
        this.state.packageName &&
        this.state.packageServices.length !== 0 
      ) {
        Axios.patch(
          `http://localhost:4000/package/item/${this.state.packageInfoID}`,
          {
            name: this.state.packageName,
          }, this.state.authUser
        ).then((res) => {
        })
        Axios.patch(
          `http://localhost:4000/package/${this.state.packageInfoID}/service`,
          this.state.packageServices, this.state.authUser
        ).then((resSer) => {
          const filterData = this.state.packageData.map((item) => {
            if (item._id === this.state.selectedPackageID) {
              item.packages = resSer.data.packages;
            }
            return item;
          });
          this.setState({
            packageData: filterData,
            selectedPackages: resSer.data.packages,
          });
        })
        if(this.state.imageSelected) {
          Axios.post(
            `http://localhost:4000/package/${this.state.selectedPackageID}/item/${this.state.packageInfoID}`,
            formData,
            config
          ).then((resImg) => {
            // console.log(resImg.data.packages)
          });
        }
        this.setState({
          packageName: "",
            packageServices: [],
            serviceName: "",
            imageSelected: false,
            isPackageInfoEdit: false,
        })
        alert("Package updated..")
      } else {
        alert("please fill all of form requirements for update...");
      }
    } else {
      if (
        this.state.selectedPackageID &&
        this.state.packageName &&
        this.state.packageServices.length !== 0 &&
        this.state.imageSelected
      ) {
        Axios.post(
          `http://localhost:4000/package/${this.state.selectedPackageID}`,
          {
            name: this.state.packageName,
          }, this.state.authUser
        ).then((res) => {
          const arr1 = res.data.packages;
          const arr2 = this.state.selectedPackages;
          let result1 = [];
          let result2 = [];
          arr1.forEach((element) => {
            result1 = result1.concat(element._id);
          });
          arr2.forEach((element) => {
            result2 = result2.concat(element._id);
          });
          const finalResult = result1.filter((x) => !result2.includes(x));

          Axios.post(
            `http://localhost:4000/package/${this.state.selectedPackageID}/item/${finalResult}`,
            formData,
            config
          ).then((resImg) => {
            // console.log(resImg.data.packages)
          });
          Axios.post(
            `http://localhost:4000/package/${this.state.selectedPackageID}/${finalResult}/service`,
            this.state.packageServices, this.state.authUser
          ).then((resSer) => {
            const filterData = this.state.packageData.map((item) => {
              if (item._id === this.state.selectedPackageID) {
                item.packages = resSer.data.packages;
              }
              return item;
            });
            console.log(filterData);
            this.setState({
              packageData: filterData,
              selectedPackages: resSer.data.packages,
            });
          });
          this.setState({
            packageName: "",
            packageServices: [],
            serviceName: "",
            imageSelected: false,
            isPackageInfoEdit: false,
          });
          alert("package created...");
        });
      } else {
        alert("please fill all of form requirements...");
      }
    }
  };
  handleDeletePackageServices = (PID) => {
    const result = window.confirm("Are you sure to delete this package? ");
    if (result) {
      Axios.delete(`http://localhost:4000/packageItem/${PID}`, this.state.authUser)
        .then((res) => {
          const filterData = this.state.packageData.map((item) => {
            if (item._id === this.state.selectedPackageID) {
              item.packages = res.data.packages;
            }
            return item;
          });
          this.setState({
            selectedPackages: res.data.packages,
            packageData: filterData,
          });
        })
        .catch((error) => console.log(error.message));
    }
  };

  render() {
    return (
      <div>
        <AdminNav />
        <div className="Admin_packages">
          <h2>Packages</h2>
          <div className="createPackage_button">
            <Button
              color="primary"
              style={{ margin: "1rem" }}
              onClick={this.addToggle}
            >
              Create Package Category
            </Button>
          </div>
          <div className="Admin_packages_box">
            <div className="packages_input_section">
              <h4>Package Details & Services</h4>
              <Form className="packages_inputBox_form">
                <FormGroup>
                  <Label for="packageName">Package Category</Label>
                  <Dropdown
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggle}
                  >
                    <DropdownToggle caret>
                      {this.state.selectedPackageTitle}
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.state.packageData.map((item) => {
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
                </FormGroup>
                <div className="packages_inputBox">
                  <Label for="packageName">Name</Label>
                  <Input
                    type="text"
                    id="packageName"
                    name="packageName"
                    placeholder="Enter a new package name..."
                    value={this.state.packageName}
                    onChange={this.handleChange}
                  ></Input>
                </div>
                <FormGroup>
                  <Label for="myFile">File</Label>
                  <Input
                    type="file"
                    name="myFile"
                    id="myFile"
                    onChange={this.handleImageChange}
                  />
                  <FormText color="muted">
                    The portrait images might look better for package section...
                  </FormText>
                </FormGroup>
                <div className="packages_inputBox">
                  <Label for="serviceName">Services</Label>
                  <Input
                    type="text"
                    id="serviceName"
                    name="serviceName"
                    placeholder="Let's add new service to our package..."
                    value={this.state.serviceName}
                    onChange={this.handleChange}
                  ></Input>
                  <Button
                    color="primary"
                    onClick={this.handleAddServices}
                    style={{
                      marginTop: "1rem",
                      width: "100%",
                    }}
                  >
                    Add
                  </Button>
                  <div className="package_serviceList_section">
                    {this.state.packageServices.map((item) => {
                      return (
                        <div
                          className="package_serviceList_item"
                          key={item.serviceName}
                        >
                          <span className="serviceList_item_name">
                            {item.serviceName}
                          </span>
                          <Button
                            close
                            className="product_closeBtn"
                            onClick={() =>
                              this.handleServicesRemove(item.serviceName)
                            }
                          ></Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Form>
              <div className="packages_buttons">
                {this.state.isPackageInfoEdit ? (
                  <Button
                    color="warning"
                    onClick={this.handlePackageInfoSubmit}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={this.handlePackageInfoSubmit}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
            {/* package list start here... */}
            <div className="packageList_container">
              <h2>Package List in Current Category</h2>
              <div className="packageList_items_section">
                {this.state.selectedPackages.map((item) => {
                  return (
                    <div className="packageList_item" key={item._id}>
                      <span
                        className="packageList_item_name"
                        onClick={() => this.handlePackageInfoEdit(item._id)}
                      >
                        {item.name}
                      </span>
                      <Button
                        close
                        className="product_closeBtn"
                        onClick={() =>
                          this.handleDeletePackageServices(item._id)
                        }
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
          isOpen={this.state.modal}
          toggle={this.addToggle}
          className="packageCategory_newPackage_modal"
        >
          <ModalHeader toggle={this.addToggle}>
            Create New Package Category
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="packageTitle">Title</Label>
                <Input
                  type="text"
                  name="packageTitle"
                  id="packageTitle"
                  placeholder="Enter Package title here..."
                  value={this.state.packageTitle}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="packageDescription">Description</Label>
                <Input
                  type="textarea"
                  className="newPackage_description"
                  name="packageDescription"
                  id="packageDescription"
                  placeholder="short description about the package.."
                  value={this.state.packageDescription}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <hr />
              <div style={{ textAlign: "right", marginRight: "2rem" }}>
                {this.state.isPackageEdit ? (
                  <Button
                    color="warning"
                    style={{ marginRight: "1rem" }}
                    onClick={this.handleSubmit}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    style={{ marginRight: "1rem" }}
                    onClick={this.handleSubmit}
                  >
                    Save
                  </Button>
                )}
                <Button color="secondary" onClick={this.addToggle}>
                  Cancel
                </Button>
              </div>
              <FormGroup>
                <div className="package_serviceList_section">
                  {this.state.packageData.map((item) => {
                    return (
                      <div className="package_serviceList_item" key={item._id}>
                        <span
                          className="serviceList_item_name"
                          onClick={() => this.handlePackageEdit(item._id)}
                        >
                          {item.title}
                        </span>
                        <Button
                          close
                          className="product_closeBtn"
                          onClick={() => this.handlePackageDelete(item._id)}
                        ></Button>
                      </div>
                    );
                  })}
                </div>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
