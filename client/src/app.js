import React from "react";
import { Route, Routes } from "react-router-dom";


//Components
import Login from "./components/Login";
import Alert from "./components/Alert.tsx";
import Button from "./components/Button.tsx";
import ListGroup from "./components/ListGroup.tsx";
import Processes from "./processes.tsx";
import Main from "./components/main"; // Use PascalCase for component names
import Nav from "./components/Nav";
import WorkStation from "./components/workstation";
import Logout from "./components/logout.js";
import PartList from "./components/parts.js";

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
            <Nav />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/main" element={<Main />} />
                <Route exact path="/workstation" element={<WorkStation />} />
                <Route exact path="/process" element={<Processes></Processes>} />
                <Route exact path="/logout" element={<Logout />} />
                <Route exact path="/part" element={<PartList></PartList>} />
            </Routes>
        </div>
    );
};

export default App;
