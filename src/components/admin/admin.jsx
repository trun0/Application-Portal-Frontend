import "./admin.css"
import checkInputValidity from "../inputValidityChecker"
import React, { useState, useEffect } from "react"
import axios from "axios"
import Loading from "../loading"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Admin(props) {
    const [adminUsername, setAdminUsername] = useState("")
    const [adminPassword, setAdminPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem("nxtechAdmin")) {
            navigate("/adminhome")
        }
    }, [])

    function handleUser(event) {
        setAdminUsername(event.target.value)
    }
    function handlePass(event) {
        setAdminPassword(event.target.value)
    }

    function handleAdmin() {
        if (checkInputValidity()) {
            setLoading(true)
            axios
                .post(process.env.REACT_APP_SERVER_URL + "adminServer", {
                    userName: adminUsername,
                    password: adminPassword,
                })
                .then(function (response) {
                    if (response.data.status) {
                        localStorage.setItem("nxtechAdmin", adminUsername)
                        navigate("/adminhome")
                    } else {
                        toast.error(response.data.message || "Some error occurred", {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    setLoading(false)
                })
                .catch(function (error) {
                    console.log(error)
                    setLoading(false)
                })
        }
    }

    return (
        <div className="login">
            <ToastContainer />
            <div className="big-heading">
                <h1>Login</h1>
                <h6>Admin</h6>
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
                        value={adminUsername}
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
                        value={adminPassword}
                        autoComplete="off"
                        required
                    ></input>

                    <button
                        onClick={handleAdmin}
                        type="button"
                        className="btn btn-primary button"
                        name="button"
                    >
                        LOGIN
                    </button>
                </form>
            )}
        </div>
    )
}

export default Admin
