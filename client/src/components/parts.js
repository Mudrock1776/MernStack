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
    <div>
      <h2>Part Management</h2>
      <div>
        <input
          type="text"
          placeholder="Search Parts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={searchParts}>Search</button>
        <button onClick={resetSearch}>Reset</button>
      </div>

      <div>
      <h3>Create New Part</h3>
        <label>
          Name:
          <input
            type="text"
            value={newPart.name}
            onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
          />
        </label>
        {Array.from({ length: 12 }, (_, index) => (
          <label key={index}>
            {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(0, index))}
            <input
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
        <button onClick={createPart}>Create Part</button>
      </div>

      <div>
      <h3>Existing Parts</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              {Array.from({ length: 12 }, (_, index) => (
                <th key={index}>
                  {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(0, index))}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part._id}>
                <td>{editingPart?.id === part._id ? (
                  <input
                    type="text"
                    value={editingPart.name}
                    onChange={(e) => setEditingPart({ ...editingPart, name: e.target.value })}
                  />
                ) : part.name}</td>
                {part.months.map((quantity, index) => (
                  <td key={index}>{quantity}</td>
                ))}
                <td>
                  {editingPart?.id === part._id ? (
                    <button onClick={() => updatePart(part._id)}>Save</button>
                  ) : (
                    <>
                      <button onClick={() => setEditingPart({ id: part._id, name: part.name, months: part.months })}>
                        Edit
                      </button>
                      <button onClick={() => deletePart(part._id)}>Delete</button>
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