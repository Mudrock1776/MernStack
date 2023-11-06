import React from "react";
import { Route, Routes } from "react-router-dom";

import Main from "./components/main";
import Create from "./components/create";
import Navbar from "./components/navbar";
import Edit from "./components/edit";
import Login from "./components/Login";
import Logout from "./components/logout";

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
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Main />} />
                <Route exact path="/main" element={<Main />} />
                <Route path="/create" element={<Create />} />
                <Route path="/edit/:id" element={<Edit />} /> 
                <Route path="/logout" element={<Logout /> } />
            </Routes>
        </div>
    );
};

export default App;