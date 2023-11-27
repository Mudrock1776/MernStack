import React from "react";
import { Route, Routes } from "react-router-dom";

//Components
import Login from "./components/Login";

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
}

const App = () => {
    const token = getToken();
    if(!token) {
        return <Login />
    }
    return(
        <div>
            <Routes>
            </Routes>
        </div>
    );
};

export default App;
