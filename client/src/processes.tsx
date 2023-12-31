import Alert from "./components/Alert.tsx";
import Button from "./components/Button.tsx";
import React, { useState, useEffect } from "react";
import ListGroup from "./components/ListGroup.tsx";
import { Route, Routes } from "react-router-dom";

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
  const [myParts, setMyParts] = useState(["???"]);
  const [fetchedParts, setFetchedParts] = useState(Object);
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [selectedProcessIndex, setSelectedProcessIndex] = useState(0);
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(0);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const [options, setOptions] = useState([
    { value: "1", label: "One" },
    { value: "2", label: "Two" },
    { value: "3", label: "Three" },
  ]);

  async function updateMyParts() {
    let results = ["???"];
    let userInput = getToken();
    let array = await fetchParts(userInput);
    console.log("Results of fetchParts:");
    console.log(array);
    setFetchedParts(array);
    for (let i = 0; i < array.length; i++) {
      let result = array[i];
      results[i] = result["name"];
    }
    if (array.length > 0) {
      setMyParts(results);
    } else {
      setMyParts([]);
    }
    return results;
  }

  async function fetchParts(userInput: string) {
    let username = getToken();
    try {
      const response = await fetch("/part/list", {
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
      console.error("Error fetching parts:", error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }

  const updateSelectedOption = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = event.target.value;
    console.log("Selected option: " + selectedOption);
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

  function getToken() {
    const tokenString = sessionStorage.getItem("token");
    const userToken = tokenString != null ? JSON.parse(tokenString) : "isake6";
    if (tokenString == null) {
      console.log(
        "No token found in sessionStorage, setting default token to 'isake6'"
      );
      return userToken;
    } else return userToken?.token;
  }

  const handleOnClick = async () => {
    setShowAlert(false);
    setShowAddButton(false);
    let results = [{ value: "", label: "" }];
    let array = await fetchWorkstations(getToken());
    for (let i = 0; i < array.length; i++) {
      let result = array[i];
      results[i] = { value: result["name"], label: result["name"] };
    }
    setOptions(results);
    setShowProcessesForm(true);
  };

  const handleOnClick2 = async () => {
    setShowAlert(false);
    setShowDeleteButton(false);
    removeProcess(processID);
    setShowDetails(false);
    setShowDetailsForm(false);
  };

  async function removeProcess(userInput: string) {
    //console.log("Data being POST to /process/update:\n"+userInput);
    try {
      const response = await fetch("/process/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.text();
      console.log("Result of removeProcess():" + result);
      let updatedProcesses = await fetchProcesses(getToken(), selectedPart);
      let resultStrings = [""];
      for (let i = 0; i < updatedProcesses.length; i++) {
        let array = updatedProcesses[i];
        resultStrings[i] = array["name"];
      }
      setMyprocesses(resultStrings);
      if (updatedProcesses.length === 0) setShowProcesses(false);
      return result;
    } catch (error) {
      console.error("Error removing process:", error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }

  const handleSubmitProcessesForm = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    let data = [""];
    data[0] = getToken();
    data[1] = selectedPart;
    data[2] = addProcessFormData.name;
    data[3] = addProcessFormData.workstation;
    data[4] = addProcessFormData.MT;
    data[5] = addProcessFormData.BS;
    data[6] = addProcessFormData.RTY;
    console.log("Data being POST to create process:");
    console.log(data);
    let defaultWorkstation = await fetchWorkstations(getToken());
    if (data[3].length === 0) data[3] = defaultWorkstation[0]["name"];
    addProcess(data);

    // Update Process Details display
    let result = [""];
    result[0] = "Workstation: " + data[4];
    result[1] = "Machine Time: " + data[5];
    result[2] = "Batch Size: " + data[6];
    result[3] = "RTY: " + data[7];
    setMydetails(result);
    setShowProcessesForm(false);

    let results = await fetchProcesses(getToken(), selectedPart);
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
    setShowDeleteButton(false);
    let partInput = item;
    let userInput = getToken();
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

  const handleSelectProcess = async (item: string, index: number) => {
    setShowAddButton(true);
    setShowDeleteButton(true);
    //setSelectedPartIndex(-1);
    setSelectedProcessIndex(index);
    setSelectedDetailIndex(-1);
    setDetailsHeader("Details for " + item);
    setProcess(item);
    let result = [""];
    let selectedProcessDetails;
    let updatedProcesses = await fetchProcesses(getToken(), selectedPart);
    setFetchedProcesses(updatedProcesses);
    for (let i = 0; i < updatedProcesses.length; i++) {
      let array = updatedProcesses[i];
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
    let array = await fetchWorkstations(getToken());
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
    let userInput = getToken();
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
    data[1] = getToken();
    data[2] = selectedPart;
    data[3] = process;
    let updatedProcesses = await fetchProcesses(getToken(), selectedPart);
    setFetchedProcesses(updatedProcesses);
    let defaultMT = "";
    let defaultBS = "";
    let defaultRTY = "";
    let defaultWorkstation = fetchWorkstations(getToken())[0];
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
    data[1] = getToken();
    data[2] = selectedPart;
    data[3] = process;
    data[4] = item;
    let updatedProcesses = await fetchProcesses(getToken(), selectedPart);
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
    let username = getToken();
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
      let updatedProcesses = await fetchProcesses(getToken(), selectedPart);
      let resultStrings = [""];
      for (let i = 0; i < updatedProcesses.length; i++) {
        let array = updatedProcesses[i];
        resultStrings[i] = array["name"];
      }
      setMyprocesses(resultStrings);
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
      console.log("Result of updateProcess():" + result);
      return result;
    } catch (error) {
      console.error("Error updating process:", error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }

  // These fields show be set via DB queries and refreshed during item selection queries
  //let myparts = ["part 1", "part 2", "part 3"];
  useEffect(() => {
    updateMyParts().then((parts) => setMyParts(parts));
  }, []);
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#020300",
        color: "#FCFCFC",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div id="alertplaceholder">
        {showAlert && (
          <Alert color="danger" onClose={handleDismiss}>
            Sorry, I can't let you do that.
          </Alert>
        )}
      </div>
      <ListGroup
        items={myParts}
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
              onChange={(e) => updateSelectedOption(e)}
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
        <div className="container">
          <h2 style={{ color: "#1AFFD5" }}>{detailsHeader}</h2>
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
        </div>
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
        <>
          <Button
            color="success"
            onClick={() => {
              handleDismiss();
              handleOnClick();
            }}
          >
            + Add Process
          </Button>
        </>
      )}
      {showDeleteButton && (
        <>
          <Button
            color="danger"
            onClick={() => {
              handleDismiss();
              handleOnClick2();
            }}
          >
            - Delete Process
          </Button>
        </>
      )}
    </div>
  );
}

export default Processes;
