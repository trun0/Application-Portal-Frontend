import React, { useEffect } from "react";
import { useState } from "react";
import "./candidate.css";

function List(props) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [props.status])
  

  function handlePage(selectedPage) {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(props.list.length / 5) &&
      selectedPage !== page
    )
      setPage(selectedPage);
  }
  return (
    <div>
      {props.list.length > 0 ?
        props.list.slice(page * 5 - 5, page * 5).map((item, i) => {
          return (
            <div key={i} className={"list-item-" + props.status}>
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
          );
        }): <h2>No applications</h2>}
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

export default List;
