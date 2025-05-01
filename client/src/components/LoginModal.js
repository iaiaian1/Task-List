import React, { useState } from "react";
import ReactDOM from "react-dom";

const Modal = ({ open, onClose, children }) => {
    if (!open) return null;

    return ReactDOM.createPortal(
      <>
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-primary">
            <p>{ children }</p>
            <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </>,
    document.getElementById("root")
    );
  };
  
export default Modal;