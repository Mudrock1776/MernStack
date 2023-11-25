import React from "react";
import { Route, Routes } from "react-router-dom";
import WorkStation from "./components/workstation";

//Components


const App = () => {
    return(
        <div>
            <Routes>
                <Route path="/workstation" element={<WorkStation />} />
            </Routes>
        </div>
    );
};

export default App;
