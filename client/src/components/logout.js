import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();
    sessionStorage.clear();
    navigate("/");
    window.location.reload(false);
    return(<div></div>);
}