import React from 'react'

function Loading(props) {
    return (

        <div className="d-flex justify-content-center mt-4 mb-3">
            <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                {props.text}...
            </button>
        </div>


    )
}

export default Loading;