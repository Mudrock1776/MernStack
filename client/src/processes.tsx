import Alert from "./components/Alert.tsx";
import Button from "./components/Button.tsx";
import React, { useState } from "react";
import ListGroup from "./components/ListGroup.tsx";
import { Route, Routes } from "react-router-dom";
//import { listProcesses } from "../server/controllers/capacity.js";

function Processes() {
  const [showAlert, setShowAlert] = useState(false);
  const [showProcesses, setShowProcesses] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [part, setPart] = useState("???");
  const [selectedPart, setSelectedPart] = useState("???");
  const [detailsHeader, setDetailsHeader] = useState("???");
  const [process, setProcess] = useState("???");
  const [fetchedProcesses, setFetchedProcesses] = useState(Object);
  const [myprocesses, setMyprocesses] = useState(["???"]);
  const [mydetails, setMydetails] = useState(["???"]);
  const [myworkstations, setMyworkstations] = useState(["???"]);
  const [myworkstation, setMyworkstation] = useState("???");
  const [showWorkstations, setShowWorkstations] = useState(false);
  const [fetchedWorkstations, setFetchedWorkstations] = useState(Object);
  const [processID, setProcessID] = useState("???");
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showProcessesForm, setShowProcessesForm] = useState(false);

  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [selectedProcessIndex, setSelectedProcessIndex] = useState(0);
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(0);

  const [options, setOptions] = useState([
    { value: "1", label: "One" },
    { value: "2", label: "Two" },
    { value: "3", label: "Three" },
  ]);

  const updateSelectedOption = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = event.target.value;
    setAddProcessFormData({
      ...addProcessFormData,
      ["workstation"]: selectedOption,
    });
  };

  const updateSelectedOption2 = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = event.target.value;
    setMyworkstation(selectedOption);
    setFormData({
      ...formData,
      ["workstation"]: selectedOption,
    });
  };

  const [addProcessFormData, setAddProcessFormData] = useState({
    name: "",
    workstation: "",
    MT: "",
    BS: "",
    RTY: "",
  });

  const [formData, setFormData] = useState({
    MT: "",
    BS: "",
    RTY: "",
    workstation: "",
  });

  const handleOnClick = async () => {
    setShowAlert(false);
    setShowAddButton(false);
    let results = [{ value: "", label: "" }];
    let array = await fetchWorkstations("isake6");
    for (let i = 0; i < array.length; i++) {
      let result = array[i];
      results[i] = { value: result["name"], label: result["name"] };
    }
    setOptions(results);
    setShowProcessesForm(true);
  };

  const handleSubmitProcessesForm = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    let data = [""];
    data[0] = "isake6";
    data[1] = selectedPart;
    data[2] = addProcessFormData.name;
    data[3] = addProcessFormData.workstation;
    data[4] = addProcessFormData.MT;
    data[5] = addProcessFormData.BS;
    data[6] = addProcessFormData.RTY;

    console.log("Data being POST to create process:");
    console.log(data);
    addProcess(data);

    // Update Process Details display
    let result = [""];
    result[0] = "Workstation: " + data[4];
    result[1] = "Machine Time: " + data[5];
    result[2] = "Batch Size: " + data[6];
    result[3] = "RTY: " + data[7];
    setMydetails(result);
    setShowProcessesForm(false);

    let results = await fetchProcesses("isake6", selectedPart);
    setFetchedProcesses(results);
    let resultStrings = [""];
    console.log("Results of fetchProcesses() for selected part:");
    console.log(results);
    for (let i = 0; i < results.length; i++) {
      let array = results[i];
      resultStrings[i] = array["name"];
    }
    setMyprocesses(resultStrings);
  };

  const handleDismiss = () => {
    setShowAlert(false);
  };

  const handleSelectItem = async (item: string, index: number) => {
    setPart("Processes for " + item);
    setSelectedPart(item);
    setSelectedPartIndex(index);
    setSelectedProcessIndex(-1);
    setSelectedDetailIndex(-1);
    setShowAddButton(true);
    let partInput = item;
    let userInput = "isake6";
    let result = await fetchProcesses(userInput, partInput);
    setFetchedProcesses(result);
    let resultStrings = [""];
    console.log("Results of fetchProcesses() for selected part:");
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      let array = result[i];
      resultStrings[i] = array["name"];
    }
    if (resultStrings[0] != "") {
      console.log(
        "Results of parsing fetchProcesses() response into string array:"
      );
      console.log(resultStrings);
      setMyprocesses(resultStrings);
    } else {
      setMyprocesses([]);
    }
    setShowProcesses(true);
    setShowDetailsForm(false);
    setShowDetails(false);
    setShowWorkstations(false);
  };

  const handleSelectProcess = (item: string, index: number) => {
    setShowAddButton(false);
    //setSelectedPartIndex(-1);
    setSelectedProcessIndex(index);
    setSelectedDetailIndex(-1);
    setDetailsHeader("Details for " + item);
    setProcess(item);
    let result = [""];
    let selectedProcessDetails;
    for (let i = 0; i < fetchedProcesses.length; i++) {
      let array = fetchedProcesses[i];
      if (array["name"] === item) {
        setProcessID(array["_id"]);
        result[0] = "Workstation: " + array["workstation"];
        result[1] = "Machine Time: " + array["MT"];
        result[2] = "Batch Size: " + array["BS"];
        result[3] = "RTY: " + array["RTY"];
        selectedProcessDetails = {
          workstation: array["workstation"],
          MT: array["MT"],
          BS: array["BS"],
          RTY: array["RTY"],
        };
        setMyworkstation(array["workstation"]);
      }
    }
    setFormData({
      MT: selectedProcessDetails.MT,
      BS: selectedProcessDetails.BS,
      RTY: selectedProcessDetails.RTY,
      workstation: selectedProcessDetails.workstation,
    });
    setMydetails(result);
    setShowDetails(true);
    setShowDetailsForm(false);
    setShowWorkstations(false);
  };

  const handleSelectDetail = async (item: string, index: number) => {
    setShowWorkstations(false);
    setSelectedDetailIndex(index);
    let results = [{ value: "", label: "" }];
    let array = await fetchWorkstations("isake6");
    for (let i = 0; i < array.length; i++) {
      let result = array[i];
      results[i] = { value: result["name"], label: result["name"] };
    }
    setOptions(results);
    setShowDetails(false);
    setShowDetailsForm(true);
    setShowAddButton(false);
  };

  async function SelectWorkstations() {
    let results = [""];
    let userInput = "isake6";
    let array = await fetchWorkstations(userInput);
    console.log("Results of fetchWorkstations:");
    console.log(array);
    setFetchedWorkstations(array);
    for (let i = 0; i < array.length; i++) {
      let result = array[i];
      results[i] = result["name"];
    }
    if (array.length > 0) {
      setMyworkstations(results);
    } else {
      setMyworkstations([]);
    }
    setShowWorkstations(true);
  }

  // Function to update the corresponding variable in real-time
  const updateVariable = (property: string, value: string) => {
    setFormData({
      ...formData,
      [property]: value,
    });
  };

  const updateProcessesVariable = (property: string, value: string) => {
    setAddProcessFormData({
      ...addProcessFormData,
      [property]: value,
    });
  };

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let data = [""];
    data[0] = processID;
    data[1] = "isake6";
    data[2] = selectedPart;
    data[3] = process;
    let updatedProcesses = await fetchProcesses("isake6", selectedPart);
    setFetchedProcesses(updatedProcesses);
    let defaultMT = "";
    let defaultBS = "";
    let defaultRTY = "";
    let defaultWorkstation = "";
    for (let i = 0; i < updatedProcesses.length; i++) {
      let array = updatedProcesses[i];
      if (array["name"] === process) {
        defaultWorkstation = array["workstation"];
        defaultMT = array["MT"];
        defaultBS = array["BS"];
        defaultRTY = array["RTY"];
      }
    }
    console.log(formData);
    data[4] =
      formData.workstation.length > 0
        ? formData.workstation
        : defaultWorkstation;
    data[5] = formData.MT.length > 0 ? formData.MT : defaultMT;
    data[6] = formData.BS.length > 0 ? formData.BS : defaultBS;
    data[7] = formData.RTY.length > 0 ? formData.RTY : defaultRTY;

    console.log("Data being POST to update process:");
    console.log(data);
    updateProcess(data);

    // Update Process Details display
    let result = [""];
    result[0] = "Workstation: " + data[4];
    result[1] = "Machine Time: " + data[5];
    result[2] = "Batch Size: " + data[6];
    result[3] = "RTY: " + data[7];
    setMydetails(result);
    setShowDetailsForm(false);
    setShowDetails(true);
  };

  const handleSelectWorkstation = async (item: string) => {
    // Generate input for POST action
    let data = [""];
    data[0] = processID;
    data[1] = "isake6";
    data[2] = selectedPart;
    data[3] = process;
    data[4] = item;
    let updatedProcesses = await fetchProcesses("isake6", selectedPart);
    setFetchedProcesses(updatedProcesses);
    for (let i = 0; i < updatedProcesses.length; i++) {
      let array = updatedProcesses[i];
      if (array["name"] === process) {
        data[5] = array["MT"];
        data[6] = array["BS"];
        data[7] = array["RTY"];
      }
    }
    console.log("Data being POST to /process/update:");
    console.log(data);

    // Update Process in DB
    updateProcess(data);

    // Update Process Details display
    let result = [""];
    result[0] = "Workstation: " + data[4];
    result[1] = "Machine Time: " + data[5];
    result[2] = "Batch Size: " + data[6];
    result[3] = "RTY: " + data[7];
    setMydetails(result);
  };

  async function fetchProcesses(userInput: string, partInput: string) {
    try {
      const response = await fetch("/process/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userInput,
          part: partInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }

  async function fetchWorkstations(userInput: string) {
    let username = "isake6";
    try {
      const response = await fetch("/workstation/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: username,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching workstations:", error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }

  async function addProcess(userInput: string[]) {
    //console.log("Data being POST to /process/add:\n"+userInput);
    try {
      const response = await fetch("/process/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userInput[0],
          part: userInput[1],
          name: userInput[2],
          workstation: userInput[3],
          MT: userInput[4],
          BS: userInput[5],
          RTY: userInput[6],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.text();
      return result;
    } catch (error) {
      console.error("Error adding process:", error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }

  async function updateProcess(userInput: string[]) {
    //console.log("Data being POST to /process/update:\n"+userInput);
    try {
      const response = await fetch("/process/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userInput[0],
          user: userInput[1],
          part: userInput[2],
          name: userInput[3],
          workstation: userInput[4],
          MT: userInput[5],
          BS: userInput[6],
          RTY: userInput[7],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.text();
      return result;
    } catch (error) {
      console.error("Error updating process:", error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }

  // These fields show be set via DB queries and refreshed during item selection queries
  let myparts = ["part 1", "part 2", "part 3"];
  //let myprocesses = ["process 1", "process 2"];

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
        onSelectItem={(item, index) => handleSelectItem(item, index)}
        selectedIndex={selectedPartIndex}
      ></ListGroup>
      {showProcesses && (
        <ListGroup
          items={myprocesses}
          heading={part}
          onSelectItem={(item, index) => handleSelectProcess(item, index)}
          selectedIndex={selectedProcessIndex}
        ></ListGroup>
      )}
      {showDetails && (
        <ListGroup
          items={mydetails}
          heading={detailsHeader}
          onSelectItem={handleSelectDetail}
          selectedIndex={selectedDetailIndex}
        ></ListGroup>
      )}
      {showProcessesForm && (
        <form onSubmit={handleSubmitProcessesForm}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Process Name:
            </label>
            <input
              type="text"
              className="form-control"
              value={addProcessFormData.name}
              onChange={(e) => updateProcessesVariable("name", e.target.value)}
              id="name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="workstation" className="form-label">
              Workstation:
            </label>
            <select
              className="form-select"
              aria-label="Select an option"
              value={addProcessFormData.workstation}
              onChange={updateSelectedOption}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="inputMT" className="form-label">
              Machine Time:
            </label>
            <input
              type="number"
              className="form-control"
              value={addProcessFormData.MT}
              onChange={(e) => updateProcessesVariable("MT", e.target.value)}
              id="inputMT"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputBS" className="form-label">
              Batch Size:
            </label>
            <input
              type="number"
              className="form-control"
              value={addProcessFormData.BS}
              onChange={(e) => updateProcessesVariable("BS", e.target.value)}
              id="inputBS"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputRTY" className="form-label">
              RTY:
            </label>
            <input
              type="number"
              className="form-control"
              value={addProcessFormData.RTY}
              onChange={(e) => updateProcessesVariable("RTY", e.target.value)}
              id="inputRTY"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      )}
      {showDetailsForm && (
        <>
          <h1>{detailsHeader}</h1>
          <form onSubmit={handleSubmitForm}>
            <div className="mb-3">
              <label htmlFor="workstation" className="form-label">
                Workstation:
              </label>
              <select
                className="form-select"
                aria-label="Select an option"
                value={myworkstation}
                onChange={updateSelectedOption2}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="inputMT" className="form-label">
                Machine Time:
              </label>
              <input
                type="number"
                className="form-control"
                value={formData.MT}
                onChange={(e) => updateVariable("MT", e.target.value)}
                id="inputMT"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputBS" className="form-label">
                Batch Size:
              </label>
              <input
                type="number"
                className="form-control"
                value={formData.BS}
                onChange={(e) => updateVariable("BS", e.target.value)}
                id="inputBS"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputRTY" className="form-label">
                RTY:
              </label>
              <input
                type="number"
                className="form-control"
                value={formData.RTY}
                onChange={(e) => updateVariable("RTY", e.target.value)}
                id="inputRTY"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </>
      )}
      {showWorkstations && (
        <div className="mb-3">
          <label htmlFor="workstation" className="form-label">
            Workstation:
          </label>
          <select
            className="form-select"
            aria-label="Select an option"
            value="Select a workstation"
            onChange={updateSelectedOption2}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
