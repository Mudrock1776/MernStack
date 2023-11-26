import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./components/main"; // Use PascalCase for component names
import Nav from "./components/Nav";

const App = () => {
    return (
        <div>
            <Nav />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/main" element={<Main />} />
            </Routes>
        </div>
    );
};

export default App;