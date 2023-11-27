import React from "react";
import { Route, Routes } from "react-router-dom";

//Components
import Alert from "./components/Alert.tsx";
import Button from "./components/Button.tsx";
import ListGroup from "./components/ListGroup.tsx";
import Processes from "./processes.tsx";

const App = () => {
    return(
        <div>
            <Routes>
            <Route exact path="/" element={<Processes></Processes>} />
            </Routes>
        </div>
    );
};

export default App;