import React, { useState, useEffect } from 'react';
import axios from 'axios';

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
}

const PartList = () => {
  const [parts, setParts] = useState([]);
  const [newPart, setNewPart] = useState({ name: '', months: Array(12).fill(0) });
  const [editingPart, setEditingPart] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const token = getToken();
      const response = await axios.post('/part/list', { user: token });
      setParts(response.data);
    } catch (error) {
      console.error('Error fetching parts:', error);
    }
  };

  const createPart = async () => {
    try {
      const token = getToken();  
      await axios.post('/part/add', {
        user: token,
        name: newPart.name,
        months: newPart.months,
      });
      setNewPart({ name: '', months: Array(12).fill(0) });
      fetchParts();
    } catch (error) {
      console.error('Error creating part:', error);
    }
  };

  const updatePart = async (id) => {
    try {
      const token = getToken();
      await axios.post('/part/update', {
        user: token,
        id: id,
        name: editingPart.name,
        months: editingPart.months,
      });
      setEditingPart(null);
      fetchParts();
    } catch (error) {
      console.error('Error updating part:', error);
    }
  };

  const deletePart = async (id) => {
    try {
      const token = getToken();
      await axios.post('/part/delete', { id: id, user:token });
      fetchParts();
    } catch (error) {
      console.error('Error deleting part:', error);
    }
  };

  const searchParts = async () => {
    try {
      const token = getToken();
      const response = await axios.post('/part/find', {
        user: token,
        searchTerm: searchTerm,
      });
      setParts(response.data);
    } catch (error) {
      console.error('Error searching for parts:', error);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    fetchParts();
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#020300', color: '#FCFCFC', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#1AFFD5' }}>Part Management</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Parts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button style={{ backgroundColor: '#3626A7', color: '#FCFCFC', padding: '5px 10px', marginLeft: '10px' }} onClick={searchParts}>Search</button>
        <button style={{ backgroundColor: '#3626A7', color: '#FCFCFC', padding: '5px 10px', marginLeft: '10px' }} onClick={resetSearch}>Reset</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#1AFFD5' }}>Create New Part</h3>
        <label style={{ marginRight: '10px' }}>
          Name:
          <input style={{marginLeft: '5px'}}
            type="text"
            value={newPart.name}
            onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
          />
        </label>
        {Array.from({ length: 12 }, (_, index) => (
          <label style={{ marginRight: '10px' }} key={index}>
            {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(0, index))}
            <input style={{marginLeft: '5px'}}
              type="text"
              value={newPart.months[index]}
              onChange={(e) => {
                const newMonths = [...newPart.months];
                newMonths[index] = parseInt(e.target.value, 10) || 0;
                setNewPart({ ...newPart, months: newMonths });
              }}
            />
          </label>
        ))}
        <button style={{ backgroundColor: '#8B8BAE', color: '#020300', padding: '5px 10px', marginLeft: '10px' }} onClick={createPart}>Create Part</button>
      </div>

      <div>
      <h3>Existing Parts</h3>
        <table style={{ width: '80%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>Name</th>
              {Array.from({ length: 12 }, (_, index) => (
                <th style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }} key={index}>
                  {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(0, index))}
                </th>
              ))}
              <th style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part._id}>
                <td style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>{editingPart?.id === part._id ? (
                  <input
                    type="text"
                    value={editingPart.name}
                    onChange={(e) => setEditingPart({ ...editingPart, name: e.target.value })}
                  />
                ) : part.name}</td>
                {part.months.map((quantity, index) => (
                  <td style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }} key={index}>{quantity}</td>
                ))}
                <td style={{ border: '1px solid #FCFCFC', padding: '8px', textAlign: 'left' }}>
                  {editingPart?.id === part._id ? (
                    <button style={{ backgroundColor: '#3626A7', color: '#FCFCFC', padding: '5px 10px', marginRight: '5px' }} onClick={() => updatePart(part._id)}>Save</button>
                  ) : (
                    <>
                      <button style={{ backgroundColor: '#3626A7', color: '#FCFCFC', padding: '5px 10px', marginRight: '5px' }} onClick={() => setEditingPart({ id: part._id, name: part.name, months: part.months })}>
                        Edit
                      </button>
                      <button style={{ backgroundColor: '#FCFCFC', color: '#020300', padding: '5px 10px' }} onClick={() => deletePart(part._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartList;