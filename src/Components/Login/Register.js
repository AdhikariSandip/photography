import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './Register.css';

export default class Register extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            username : '',
            password: '',
            firstname: '',
            lastname: '',
            role: '',
            RegisteredIn: false
        }
    }
    
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })

    }
    handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4000/users', this.state)
        .then((res) => {
            localStorage.setItem('token', res.data.token);
            this.setState({ RegisteredIn: true })
        }).catch( err  => console.log(err));
    }

    render() {
        if (this.state.RegisteredIn) {
            return <Redirect to='/dashboard' />
        }
        return (
        <div className="registerBody">
            <div className="container">
                <h2>Register User</h2>
                <div className="row100">
                    <div className="col">
                        <div className="inputBox">
                            <input type="text" name="firstname" id='firstname' required="required"
                            value= {this.state.firstname} onChange={this.handleChange}></input>
                            <span className="text">First Name</span>
                            <span className="line"></span>
                        </div>
                    </div>
                    <div className="col">
                        <div className="inputBox">
                            <input type="text" name="lastname" id="lastname" required="required"
                            value= {this.state.lastname} onChange={this.handleChange}></input>
                            <span className="text">Last Name</span>
                            <span className="line"></span>
                        </div>
                    </div>

                    <div className="col">
                        <div className="inputBox">
                            <input type="username" name="username" id="username" required="required"
                            value= {this.state.username} onChange={this.handleChange}></input>
                            <span className="text">User Name</span>
                            <span className="line"></span>
                        </div>
                    </div>


                    <div className="col">
                        <div className="inputBox">
                            <input type="password" name="password" id="password" required="required"
                            value= {this.state.password} onChange={this.handleChange}></input>
                            <span className="text">Password</span>
                            <span className="line"></span>
                        </div>
                    </div>
                </div>
                <div className="row100">
                    <div className="col">
                        <button type="submit" onClick={this.handleSubmit}>Register</button>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}