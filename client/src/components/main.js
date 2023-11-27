import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import "../styles/main.css";

function getToken(){
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

const res = await fetch("/capacity", {
  method: "POST",
  headers: {
               "Content-Type": "application/json",
    },
    body: JSON.stringify({
     user: getToken()
    }),
});
const workstations = await res.json();

export default function Main() {
  //const workstations = dummydata;
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  
  let chart1;
  let chart2;
  let chartmax = 50;

  function getMonthWorkstations(month) {
	const monthlyCapacities = [].concat(...workstations.map((workstation) => {
		const obj = {};
		obj[workstation.name] = workstation.capacity[month];
		return obj;
	})
	);
	}

    // ... Fetch and process data for the charts based on dropdown selections
	const handleMonthChange = (event) => {
		const selectedMonth = parseInt(event.target.value, 10);
		console.log(selectedMonth);
		const monthlyCapacities = workstations.map(workstation => workstation.capacity[selectedMonth]);
		const monthlyWorkstations = workstations.map((workstation) => workstation.name);
		chart1.data.labels = monthlyWorkstations;
		chart1.data.datasets[0].data = monthlyCapacities;
		let localmax = Math.max(...monthlyCapacities) + 20;
		console.log(localmax);
		if (localmax > chartmax) {
			console.log(localmax);
			chartmax = localmax;
		}
		else if (localmax < chartmax - 50) { 
			chartmax = localmax;
		}
		console.log(monthlyCapacities);
		chart1.options.scales.y.max = chartmax;
		chart1.update();
	};
	
	const handleWorkstationChange = (event) => {
		const selectedStation = event.target.value;
		const selectedWorkstation = workstations.find((workstation) => workstation.name == selectedStation);
		chart2.data.datasets[0].data = selectedWorkstation.capacity;
		let localmax = Math.max(...selectedWorkstation.capacity) + 20;
		if (localmax > chartmax) {
			chartmax = localmax;
		}
		else if (localmax < chartmax - 50) { 
			chartmax = localmax;
		}
		chart2.options.scales.y.max = chartmax;
		chart2.update();
	};
	
  useEffect(() => {
    const chart1Ctx = chart1Ref.current.getContext("2d");
    const chart2Ctx = chart2Ref.current.getContext("2d");
	
    chart1 = new Chart(chart1Ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Workstation Capacity",
            data: [],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
		scales: {
			y: {
			  suggestedmin: 0,
			  suggestedmax: 200,
			}
		},
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "All Workstation Capacities",
			font: {
			 family: "Arial",
			 size: 16,
			},
          },
        },
      },
    });

    chart2 = new Chart(chart2Ctx, {
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
		scales: {
			y: {
			  suggestedmin: 0,
			  suggestedmax: 200,
			}
		},
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Selected Workstation Capacities over Year",
			font: {
			 family: "Arial",
			 size: 16,
			},
          },
        },
      },
    });
	
	handleMonthChange({ target: {value: "0"} });
	const firstWorkstationName = workstations.length > 0 ? workstations[0].name : '';
	handleWorkstationChange({ target: { value: firstWorkstationName} });
	
  }, []); // Empty dependency array ensures this useEffect runs only once

  return (
    <div className="main">
      <div>
        <h3>All Workstation Capacities</h3>
        <select id="dropdown1" onChange={handleMonthChange}>
          <option value="0" key="0">January</option>
          <option value="1" key="1">February</option>
          <option value="2" key="2">March</option>
		  <option value="3" key="3">April</option>
		  <option value="4" key="4">May</option>
		  <option value="5" key="5">June</option>
		  <option value="6" key="6">July</option>
		  <option value="7" key="7">August</option>
		  <option value="8" key="8">September</option>
		  <option value="9" key="9">October</option>
		  <option value="10" key="10">November</option>
		  <option value="11" key="11">December</option>
        </select>
        <canvas id="myChart1" ref={chart1Ref} width="400" height="200"></canvas>
      </div>
      <div>
        <h3>Selected Workstation Capacity Over Year</h3>
        <select id="dropdown2" onChange={handleWorkstationChange}>
			{workstations.map((workstation) => (
				<option value={workstation.name} key={workstation.name}>{workstation.name}</option>
			))}
        </select>
        <canvas id="myChart2" ref={chart2Ref} width="400" height="200"></canvas>
      </div>
    </div>
  );
}