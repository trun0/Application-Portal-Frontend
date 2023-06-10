import React, { useEffect, useState } from "react";
import "./candidate.css";
import axios from "axios";
import Loading from "../loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Pending(props) {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading");
  const [page, setPage] = useState(1);


  function handlePage(selectedPage) {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(props.list.length / 5) &&
      selectedPage !== page
    )
      setPage(selectedPage);
  }

  function handleApprove(id) {
    setLoading(true);
    setLoadingText("Approving");
    axios
      .put(process.env.REACT_APP_SERVER_URL + "applicationsServer/" + id, {
        currentStatus: "approved",
      })
      .then(function (response) {
        if (response.data.status) {
          //alert(response.data.message);
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
          props.initializeList("pending");
        } else {
          toast.error(response.data.message || "Some error occurred", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function() {
        setLoading(false);
      });
  }

  function handleReject(id) {
    setLoading(true);
    setLoadingText("Rejecting");
    axios
      .put(process.env.REACT_APP_SERVER_URL + "applicationsServer/" + id, {
        currentStatus: "rejected",
      })
      .then(function (response) {
        if (response.data.status) {
          //alert(response.data.message);
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
          props.initializeList("pending");
        } else {
          toast.error(response.data.message || "Some error occurred", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function() {
        setLoading(false);
      });
  }

  return (
    <div>
      {loading ? (
        <Loading text={loadingText} />
      ) : props.list && props.list.length > 0 ? (
        props.list.slice(page * 5 - 5, page * 5).map((item) => {
          return (
            <div key={item.candidate_id} className="list-item-pending">
              <div>
                <div>
                  <strong>Name: </strong>
                  {item.candidatename}
                </div>
                <div>
                  <strong>Email: </strong>
                  {item.email}
                </div>
                <div>
                  <strong>Phone: </strong>
                  {item.phone}
                </div>
                <div>
                  <strong>Area of Interest: </strong>
                  {item.areaofinterest}
                </div>
                <div>
                  <strong>Resume: </strong>
                  <a
                    href={"data:application/pdf;base64," + item.data}
                    download={item.filename}
                  >
                    {item.filename}
                  </a>
                </div>
              </div>
              <div className="decision-btns">
                <div
                  className="selection-btn"
                  onClick={(e) => {
                    handleApprove(item.candidate_id);
                  }}
                >
                  <button className="btn btn-primary">Approve</button>
                </div>
                <div
                  className="selection-btn"
                  onClick={(e) => {
                    handleReject(item.candidate_id);
                  }}
                >
                  <button className="btn btn-primary">Reject</button>
                </div>
              </div>
            </div>
          );
        })
      ) : <h2>No applications</h2>}
            {props.list.length > 0 && (
        <div>
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button
                  onClick={() => handlePage(page - 1)}
                  className={
                    page <= 1 ? "page-link page-disabled" : "page-link"
                  }
                >
                  Previous
                </button>
              </li>
              {[...new Array(Math.ceil(props.list.length / 5))].map((_, i) => {
                return (
                  <li key={i} className="page-item">
                    <button
                      onClick={() => handlePage(i + 1)}
                      className={
                        page === i + 1 ? "page-link page-selected" : "page-link"
                      }
                    >
                      {i + 1}
                    </button>
                  </li>
                );
              })}
              <li className="page-item">
                <button
                  onClick={() => handlePage(page + 1)}
                  className={
                    page >= Math.ceil(props.list.length / 5)
                      ? "page-link page-disabled"
                      : "page-link"
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Pending;
