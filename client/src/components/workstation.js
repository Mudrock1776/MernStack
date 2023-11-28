import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import axios from 'axios';

//Components

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
}



const WorkStation = () => {
  const [workstations, setWorkstations] = useState([]);
  const [newWorkstation, setNewWorkstation] = useState({
    name: '',
    amount: 0,
    hours: 0,
  });
  const [updatingWorkstation, setupdatingWorkstation] = useState({
    name: "",
    amount: "",
    hours: ""
  })
  const [searchTerm, setSearchTerm] = useState('');
  const [editPartID, setEditingPart] = useState('');

  useEffect(() => {
    fetchWorkstations();
  }, []);

  const fetchWorkstations = async () => {
    try {
      const token = getToken();
      const response = await axios.post('/workstation/list', { user: token });
      setWorkstations(response.data);
    } catch (error) {
      console.error('Error fetching workstations:', error);
    }
  };

  const handleCreateWorkstation = async () => {
    try {
      const token = getToken();  
      await axios.post('/workstation/add', { ...newWorkstation, user: token });
      fetchWorkstations();
      setNewWorkstation({ name: '', amount: 0, hours: 0 });
    } catch (error) {
      console.error('Error creating workstation:', error);
    }
  };

  const handleUpdateWorkstation = async () => {
    try {
      const token = getToken();  
      await axios.post('/workstation/update', { id: editPartID, user: token, ...updatingWorkstation });
      setEditingPart("")
      fetchWorkstations();
    } catch (error) {
      console.error('Error updating workstation:', error);
    }
  };

  function updatingworkstationupdation(value){
    return setupdatingWorkstation((prev) => {
        return {...prev, ...value};
    });
  }

  const handleDeleteWorkstation = async (id) => {
    try {
      const token = getToken();  
      await axios.post('/workstation/delete', { id, user:token });
      fetchWorkstations();
    } catch (error) {
      console.error('Error deleting workstation:', error);
    }
  };

  const handleSearchWorkstation = async () => {
    try {
      const token = getToken();  
      const response = await axios.post('/workstation/list', { user: token });
      const filteredWorkstations = response.data.filter(workstation =>
        workstation.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setWorkstations(filteredWorkstations);
    } catch (error) {
      console.error('Error searching workstations:', error);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#020300', color: '#FCFCFC', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#1AFFD5' }}>Workstation Management</h2>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Name:</label>
        <input
          type="text"
          value={newWorkstation.name}
          onChange={(e) => setNewWorkstation({ ...newWorkstation, name: e.target.value })}
        />
        <label style={{ margin: '0 10px' }}>Amount:</label>
        <input
          type="number"
          value={newWorkstation.amount}
          onChange={(e) => setNewWorkstation({ ...newWorkstation, amount: e.target.value })}
        />
        <label style={{ margin: '0 10px' }}>Hours:</label>
        <input
          type="number"
          value={newWorkstation.hours}
          onChange={(e) => setNewWorkstation({ ...newWorkstation, hours: e.target.value })}
        />
        <button style={{ backgroundColor: '#8B8BAE', color: '#020300', padding: '5px 10px', marginLeft: '10px' }} onClick={handleCreateWorkstation}>
          Create Workstation
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Search:</label>
        <input type="text" onChange={(e) => setSearchTerm(e.target.value)} />
        <button style={{ backgroundColor: '#3626A7', color: '#FCFCFC', padding: '5px 10px', marginLeft: '10px' }} onClick={handleSearchWorkstation}>
          Search
        </button>
      </div>

      <table style={{ width: '80%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>Amount</th>
            <th style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>Hours</th>
            <th style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>Availability</th>
            <th style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workstations.map(workstation => (
            <tr key={workstation._id}>
              <td style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>{editPartID == workstation._id ? (
                <input
                type="text"
                value={updatingWorkstation.name}
                onChange={(e) => updatingworkstationupdation({name: e.target.value})}
              />
              ) : workstation.name}</td>
              <td style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>{editPartID == workstation._id ? (
                <input
                type="text"
                value={updatingWorkstation.amount}
                onChange={(e) => updatingworkstationupdation({amount: e.target.value})}
              />
              ) : workstation.amount}</td>
              <td style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>{editPartID == workstation._id ? (
                <input
                type="text"
                value={updatingWorkstation.hours}
                onChange={(e) => updatingworkstationupdation({hours: e.target.value})}
              />
              ) : workstation.hours}</td>
              <td style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>{workstation.availability}</td>
              <td style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>{editPartID == workstation._id ? (
                <button style={{ backgroundColor: '#3626A7', color: '#FCFCFC', padding: '5px 10px', marginRight: '5px' }} onClick={() => handleUpdateWorkstation()}>Update</button>
              ) : ( <>
                <button style={{ backgroundColor: '#3626A7', color: '#FCFCFC', padding: '5px 10px', marginRight: '5px' }} onClick={() => {setEditingPart(workstation._id)}}>
                  Edit
                </button>
                <button style={{ backgroundColor: '#FCFCFC', color: '#020300', padding: '5px 10px' }} onClick={() => handleDeleteWorkstation(workstation._id)}>
                  Delete
                </button>
                </>
                )
              }
              </td>
            </tr> 
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkStation;
