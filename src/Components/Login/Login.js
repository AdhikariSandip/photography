import React, { Component } from "react";
import "./Login.css";
import { Link, Redirect } from 'react-router-dom'
import Axios from "axios";

export default class Login extends Component {
    constructor(props) {
        super(props) 
    
        this.state = {
            username: '',
            password: '',
            loggedIn: false
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleLogin = (e) => {
      e.preventDefault();
      Axios.post('http://localhost:4000/users/login', this.state)
        .then((res) => {
            localStorage.setItem('token', res.data.token);
            this.setState({ loggedIn: true })
        }).catch( err  => console.log(err));
    }
  render() {
    if (this.state.loggedIn) {
      return <Redirect to='/dashboard'/>
  }
    return (
      <div className="loginBody">
        <div className="box">
          <h2>Login</h2>
          <form>
            <div className="inputBox">
              <input
                type="text"
                name="username"
                id="username"
                required="required"
                value={this.state.username}
                onChange={this.handleChange}
              ></input>
              <label htmlFor="username">Username</label>
            </div>
            <div className="inputBox">
              <input
                type="password"
                name="password"
                id="password"
                required="required"
                value={this.state.password}
                onChange={this.handleChange}
              ></input>
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" onClick={this.handleLogin}>
              Login
            </button>
            <div className="regSection">
              <label>New User?</label>
              <Link to="/register" className="registerBtn">
                Register now
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
