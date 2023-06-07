import "./login.css";
import checkInputValidity from "../inputValidityChecker";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../loading";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login(props) {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("nxtechUser")) {
            navigate("/userhome");
        }
    }, []);

    function handleUser(event) {
        setLoginUsername(event.target.value);
    }
    function handlePass(event) {
        setLoginPassword(event.target.value);
    }

    function handleLogin() {
        if (checkInputValidity()) {
            setLoading(true);
            axios
                .post(process.env.REACT_APP_SERVER_URL + "loginServer", {
                    userName: loginUsername,
                    password: loginPassword,
                })
                .then(function (response) {
                    if (response.data.status) {
                        localStorage.setItem("nxtechUser", response.data.id);
                        navigate("/userhome");
                    } else {
                        console.log(response.data.message)
                        toast.error(response.data.message || "Some error occurred", {
                            position: toast.POSITION.TOP_CENTER
                        });
                        
                    }
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                });
        }
    }

    return (
        <div className="login">
            <ToastContainer />
            <div className="big-heading">
                <h1>Login</h1>
                <h6>User</h6>
            </div>
            {loading ? (
                <Loading text="Logging In" />
            ) : (
                <form className="">
                    <label className="required">
                        <i className="fas fa-user mb-2"></i> Username
                    </label>
                    <input
                        onChange={handleUser}
                        type="text"
                        className="form-control username"
                        name="username"
                        placeholder="Enter Username"
                        value={loginUsername}
                        autoComplete="off"
                        required
                    ></input>

                    <label className="required">
                        <i className="fas fa-lock mb-2"></i> Password
                    </label>
                    <input
                        onChange={handlePass}
                        type="password"
                        className="form-control password"
                        name="password"
                        placeholder="Enter Password"
                        value={loginPassword}
                        autoComplete="off"
                        required
                    ></input>

                    <button
                        onClick={handleLogin}
                        type="button"
                        className="btn btn-primary button"
                        name="button"
                        value="Login"
                    >
                        LOGIN
                    </button>

                    <div className="extra">
                        <strong>New user? </strong>
                        <Link to="/signup">Create an account</Link>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Login;
