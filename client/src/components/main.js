import React, { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const rval = tokenString?.token || JSON.stringify('Test');
}

const res = await fetch("/workstation/list", {
	 method: "POST",
	 headers: {
                "Content-Type": "application/json",
     },
     body: getToken(),
});
const workstations = await res.json();

export default function Main() {
  useEffect(() => {
    const chart1Ctx = document.getElementById("myChart1").getContext("2d");
    const chart2Ctx = document.getElementById("myChart2").getContext("2d");

    // Initialize the two charts (empty initially)
    const chart1 = new Chart(chart1Ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Chart 1",
            data: [],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: "All Workstation Capacities",
          },
        },
      },
    });

    const chart2 = new Chart(chart2Ctx, {
      type: "bar",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
          {
            label: 'Dataset1',
            data: [],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: "Selected Workstation Capacities over Year",
          },
        },
      },
    });
	
	function getMonthWorkstations(month) {
	const monthlyCapacities = [].concat(...workstations.map((workstation) => {
		const obj = {};
		obj[workstation.name] = workstation.capacity[month];
		return obj;
	})
	);
	}
	const [month, setMonth] = useState([]);

    // ... Fetch and process data for the charts based on dropdown selections
	const handleMonthChange = (event) => {
		const selectedMonth = parseInt(event.target.value, 10);
		setMonth(selectedMonth);
		const monthlyCapacities = workspaces.map(workspace => workspace.capacity[selectedMonth]);
		const monthlyWorkstations = workspaces.map(workspace => workspace.name);
		chart1.data.labels = monthlyWorkstations;
		chart1.data.datasets[0].data = monthlyCapacities;
		chart1.update();
	};
	
	const handleWorkstationChange = (event) => {
		const selectedStation = event.target.value;
		const selectedWorkstation = workstations.find((workstation) => workstation.name == selectedStation);
		chart1.data.datasets[0].data = selectedWorkstation.capacity;
		chart1.update();
	};

  }, []); // Empty dependency array ensures this useEffect runs only once

  return (
    <div>
      <div>
        <h3>All Workspace Capacities</h3>
        <select id="dropdown1" onChange={handleMonthChange} value={setMonth}>
          {/* Dropdown options for Chart 1 */}
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
		  <option value="3">April</option>
		  <option value="4">May</option>
		  <option value="5">June</option>
		  <option value="6">July</option>
		  <option value="7">August</option>
		  <option value="8">September</option>
		  <option value="9">October</option>
		  <option value="10">November</option>
		  <option value="11">December</option>
        </select>
        <canvas id="myChart1" width="400" height="200"></canvas>
      </div>
      <div>
        <h3>Selected Workspace Capacity Over Year</h3>
        <select id="dropdown2" onChange={handleWorkstationChange}>
			{workstations.map((workstation) => (
				<option value={workstation.name}>{workstation.name}</option>
			))}
        </select>
        <canvas id="myChart2" width="400" height="200"></canvas>
      </div>
    </div>
  );
}