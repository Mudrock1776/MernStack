import { ReactNode } from "react";
import React, { useEffect, useRef } from "react";

interface Props {
  children: ReactNode;
  color?: "primary" | "secondary" | "success" | "danger";
  onClose: () => void;
}

const Alert = ({ children, color = "danger", onClose }: Props) => {
  return (
    <div
      className={"alert alert-" + color + " alert-dismissible fade show"}
      role="alert"
    >
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default Alert;
