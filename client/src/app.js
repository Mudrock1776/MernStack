import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./components/main"; // Use PascalCase for component names
import Nav from "./components/Nav";

import WorkStation from "./components/workstation";

//Components
import Login from "./components/Login";

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
}
import Alert from "./components/Alert.tsx";
import Button from "./components/Button.tsx";
import ListGroup from "./components/ListGroup.tsx";
import Processes from "./processes.tsx";

const App = () => {
    const token = getToken();
    if(!token) {
        return <Login />
    }
    return(
        <div>
            <Nav />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/main" element={<Main />} />
                <Route exact path="/" element={<WorkStation />} />
                <Route exact path="/" element={<Processes></Processes>} />
            </Routes>
        </div>
    );
};

export default App;
