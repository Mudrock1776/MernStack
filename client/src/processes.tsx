import Alert from "./components/Alert.tsx";
import Button from "./components/Button.tsx";
import React, { useState } from "react";
import ListGroup from "./components/ListGroup.tsx";

function Processes() {
  const [showAlert, setShowAlert] = useState(false);
  const [showProcesses, setShowProcesses] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [part, setPart] = useState("???");
  const [process, setProcess] = useState("???");
  const [selecteditem, setSelecteditem] = useState("???");

  const handleOnClick = () => {
    setShowAlert(true);
  };

  const handleDismiss = () => {
    setShowAlert(false);
  };

  const handleSelectItem = (item: string) => {
    setPart("Processes for " + item);
    setShowAddButton(true);
    setShowProcesses(true);
    setShowDetails(false);
  };

  const handleSelectProcess = (item: string) => {
    setShowAddButton(false);
    setProcess("Details for " + item);
    setShowDetails(true);
  };

  const handleSelectDetail = (item: string) => {
    //setSelecteditem(item);
    setShowAddButton(false);
  };

  // These fields show be set via DB queries and refreshed during item selection queries
  let myparts = ["part 1", "part 2", "part 3"];
  let myprocesses = ["process 1", "process 2"];
  let mydetails = [
    "workstation 1",
    "machine time: 0.5",
    "batch size: 2",
    "RTY: 1",
  ];

  return (
    <div>
      <div id="alertplaceholder">
        {showAlert && (
          <Alert color="danger" onClose={handleDismiss}>
            Sorry, I can't let you do that.
          </Alert>
        )}
      </div>
      <ListGroup
        items={myparts}
        heading="Parts"
        onSelectItem={handleSelectItem}
      ></ListGroup>
      {showProcesses && (
        <ListGroup
          items={myprocesses}
          heading={part}
          onSelectItem={handleSelectProcess}
        ></ListGroup>
      )}
      {showDetails && (
        <ListGroup
          items={mydetails}
          heading={process}
          onSelectItem={handleSelectDetail}
        ></ListGroup>
      )}
      <br></br>
      {showAddButton && (
        <Button
          color="success"
          onClick={() => {
            handleDismiss();
            handleOnClick();
          }}
        >
          + Add Process
        </Button>
      )}
    </div>
  );
}

export default Processes;
