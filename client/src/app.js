import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login"
import main from "./components/main"
import Nav from "./components/Nav"
//Components


const App = () => {
    return(
        <div>
            <Routes>
				<Route path="/" element={<Nav />} />
				<Route path="/" element={<main />} />
            </Routes>
        </div>
    );
};

export default App;