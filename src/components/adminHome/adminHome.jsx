import React, { useState, useEffect } from "react";
import "./adminHome.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import List from "../candidate/list";
import Pending from "../candidate/pending";

function AdminHome() {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("pending");

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("nxtechAdmin")) {
      navigate("/admin");
    }
    initializeList("pending");
  }, []);

  function logout() {
    localStorage.removeItem("nxtechAdmin");
    navigate("/admin");
  }

  function initializeList(type) {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "applicationsServer/" + type)
      .then(function (response) {
        console.log(response);
        if (response.data.status) {
          setList(response.data.list);
        } else setList([]);
        setMessage(type);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {});

    const tags = document.querySelectorAll(".navlink-active");
    tags.forEach((tag) => {
      tag.classList.remove("navlink-active");
    });
    switch (type) {
      case "pending":
        document
          .getElementsByClassName("navlink")[0]
          .classList.add("navlink-active");
        break;
      case "approved":
        document
          .getElementsByClassName("navlink")[1]
          .classList.add("navlink-active");
        break;
      case "rejected":
        document
          .getElementsByClassName("navlink")[2]
          .classList.add("navlink-active");
        break;
      default:
        break;
    }
  }

  return (
    <div className="adminHome">
      <div className="sidebar">
        <div className="sidebar-nav">
          <div className="sidebar-heading">
            <h4>Applications</h4>
          </div>
          <div className="">
            <button
              onClick={logout}
              className="btn btn-danger admin-logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="navitems">
          <div className="navlink" onClick={() => initializeList("pending")}>
            <i className="sidebar-icon fas fa-hourglass"></i>Pending
          </div>
          <div className="navlink" onClick={() => initializeList("approved")}>
            <i className="sidebar-icon fas fa-thumbs-up"></i>Approved
          </div>
          <div className="navlink" onClick={() => initializeList("rejected")}>
            <i className="sidebar-icon fas fa-trash mb-2"></i>Rejected
          </div>
        </div>
      </div>
      <div className="candidate-list">
        {message === "pending" ? (
          <Pending list={list} initializeList={initializeList} />
        ) : (
          <List list={list} status={message} />
        )}
      </div>
    </div>
  );
}

export default AdminHome;
