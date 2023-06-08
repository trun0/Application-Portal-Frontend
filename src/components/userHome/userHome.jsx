import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userHome.css";
import checkInputValidity from "../inputValidityChecker";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserHome() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [aoi, setAoi] = useState(""); // aoi = area of interest
    const [status, setStatus] = useState("Not sent");
    const [resumeData, setResumeData] = useState("");
    const [resumeFilename, setResumeFilename] = useState("");
    const [heading, setHeading] = useState("Enter Your Details");
    const [inactiveSubmitButton, setInactiveSubmitButton] = useState(false);

    useEffect(() => {
        initialize();
    }, []);

    function initialize() {
        if (localStorage.getItem("nxtechUser")) {
            axios
                .get(
                    process.env.REACT_APP_SERVER_URL + "userServer/" + localStorage.getItem("nxtechUser")
                )
                .then(function (response) {
                    if (response.data.status) {
                        //alert(response.data.message);
                        const candidate = response.data.candidate;
                        console.log(candidate);
                        setStatus(
                            candidate.currentstatus
                                ? candidate.currentstatus
                                : ""
                        );
                        setName(
                            candidate.candidatename
                                ? candidate.candidatename
                                : ""
                        );
                        setEmail(candidate.email ? candidate.email : "");
                        setPhone(candidate.phone ? candidate.phone : "");
                        setAoi(
                            candidate.areaofinterest
                                ? candidate.areaofinterest
                                : ""
                        );
                        setResumeData(
                            candidate.data
                                ? "data:application/pdf;base64," +
                                      candidate.data
                                : ""
                        );
                        setResumeFilename(
                            candidate.filename ? candidate.filename : ""
                        );
                        switch (candidate.currentstatus) {
                            case "pending":
                                setHeading("Application Submitted");
                                break;
                            case "approved":
                                setHeading("Application Approved");
                                break;
                            case "rejected":
                                setHeading("Application Rejected");
                                break;
                            default:
                                setHeading("Enter Your Details");
                        }
                    } else {
                        //alert(response.data.message);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            navigate("/login");
        }
    }

    function handleUser() {
        if (checkInputValidity()) {
            setInactiveSubmitButton(true);
            const SubmitToastId = toast.loading("Submitting Application...", {
                position: toast.POSITION.TOP_RIGHT
            });
            const file = document.getElementById("resume").files;
            // console.log(file);
            var fd = new FormData();
            fd.append("resume", file[0]);
            fd.append("candidateName", name);
            fd.append("email", email);
            fd.append("phone", phone);
            fd.append("areaOfInterest", aoi);
            fd.append("currentStatus", "pending");
            axios
                .post(
                    process.env.REACT_APP_SERVER_URL +
                        "userServer/" +
                        localStorage.getItem("nxtechUser"),
                    fd,
                    {
                        headers: {
                            "content-type": "multipart/form-data",
                        },
                    }
                )
                .then(function (response) {
                    console.log("fd", response, "ost");
                    setInactiveSubmitButton(false);
                    if (response.data.status) {
                        toast.update(SubmitToastId, { 
                            render: "Application sent.You will shortly receive comfirmation email. Thank you for applying",
                            type: "success",
                            autoClose: 5000,
                            isLoading: false,
                            closeButton: null
                        });
                        initialize();
                    } else {
                        toast.update(SubmitToastId, { 
                            render: response.data.message,
                            type: "error",
                            autoClose: 5000,
                            isLoading: false,
                            closeButton: null
                        });
                        initialize();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    function handleResumeUpdate() {
        if (checkInputValidity()) {
            setInactiveSubmitButton(true);
            const UpdateToastId = toast.loading("Updating Resume...", {
                position: toast.POSITION.TOP_RIGHT
            });
            const file = document.getElementById("resume").files;
            var fd = new FormData();
            fd.append("resume", file[0]);
            axios
                .put(
                    process.env.REACT_APP_SERVER_URL +
                        "userServer/" +
                        localStorage.getItem("nxtechUser"),
                    fd,
                    {
                        headers: {
                            "content-type": "multipart/form-data",
                        },
                    }
                )
                .then(function (response) {
                    console.log("fd", response, "sdfsdg");
                    setInactiveSubmitButton(false);
                    if (response.data.status) {
                        toast.update(UpdateToastId, { 
                            render: "Resume Updated.You will shortly receive comfirmation email",
                            type: "success",
                            autoClose: 5000,
                            isLoading: false,
                            closeButton: null
                        });
                        initialize();
                    } else {
                        toast.update(UpdateToastId, { 
                            render: response.data.message,
                            type: "error",
                            autoClose: 5000,
                            isLoading: false,
                            closeButton: null
                        });
                        initialize();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    function logout() {
        localStorage.removeItem("nxtechUser");
        navigate("/login");
    }

    return (
        <div>
            <ToastContainer />
            <div className="logout-btn">
                <button onClick={logout} className="btn btn-danger">
                    Logout
                </button>
            </div>
            <div className="userForm">
                <h1 className="userHeading">{heading}</h1>
                {status === "pending" ? (
                    <center className="pendingText">
                        You can still update your resume
                    </center>
                ) : null}
                <div className="inputGroup">
                    <div className="row">
                        <div className="col-sm-4">
                            <label className="form-label required">Name</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                required
                                disabled={status !== "Not sent"}
                                placeholder="your name"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                value={name}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <label className="form-label required">Email</label>
                        </div>
                        <div className="col">
                            <input
                                type="email"
                                required
                                disabled={status !== "Not sent"}
                                placeholder="name@email.com"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                value={email}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <label className="form-label required">Phone</label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                required
                                disabled={status !== "Not sent"}
                                placeholder="10 digit phone number"
                                className=""
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                }}
                                value={phone}
                                pattern="[1-9]{1}[0-9]{9}"
                            />
                            <div className="form-text">
                                Only 10 digit numbers | Don't start with 0
                            </div>{" "}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <label className="form-label required">
                                Area of Interest
                            </label>
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                required
                                disabled={status !== "Not sent"}
                                placeholder="e.g. Android, Web, etc"
                                onChange={(e) => {
                                    setAoi(e.target.value);
                                }}
                                value={aoi}
                            />
                        </div>
                    </div>
                    {status === "approved" || status === "rejected" ? null : (
                        <div className="row">
                            <div className="col-sm-4">
                                <label className="form-label required">
                                    Resume
                                </label>
                            </div>
                            <div className="col">
                                <input
                                    type="file"
                                    id="resume"
                                    required
                                    accept="application/pdf"
                                />
                            </div>
                        </div>
                    )}
                    {resumeData === "" || status === "Not sent" ? null : (
                        <div className="row">
                            <div className="col-sm-4">
                                <label className="form-label">
                                    Current resume
                                </label>
                            </div>
                            <div className="col">
                                <a href={resumeData} download={resumeFilename}>
                                    {resumeFilename}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
                <div className="apply">
                    <button
                        onClick={
                            status === "Not sent"
                                ? handleUser
                                : handleResumeUpdate
                        }
                        className="btn btn-success application-btn"
                        disabled={
                            status === "approved" || status === "rejected" || inactiveSubmitButton
                        }
                    >
                        {status === "Not sent"
                            ? "Submit Application"
                            : "Update Resume"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserHome;
