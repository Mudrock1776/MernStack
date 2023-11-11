const express = require("express");

const Routes = express.Router();
const capacity = require("../controllers/capacity");

//part routes

/*Create part takes in a post request, the body must be:
{
    user: <current user>,
    name: <name of part>,
    months: <a list of numbers pertaing to the amount of part made for a given month>
}
*/
Routes.route("/part/add").post((req,res) => {
    capacity.createPart(req,res);
});

/*Provides a list of parts registered to the user, takes a post request with body as follows:
{
    user: <current user>
}
*/
Routes.route("/part/list").post((req, res) => {
    capacity.listParts(req,res);
});

/*Updates a part, takes a post request with a body as follows:
{
    id: <part id>,
    name: <new name>,
    months: <new list of amounts>
}
*/
Routes.route("/part/update").post((req,res) => {
    capacity.updatePart(req,res);
});

/*deletes a part, takes a post request with a body as follows:
{
    id: <part id>
}
*/
Routes.route("/part/delete").post((req, res) => {
    capacity.deletePart(req,res);
});

/*Finds a part, takes a post request with a body as follows:
{
    id: <part id>
}
*/
Routes.route("/part/find").post((req,res) => {
    capacity.findPart(req,res);
});

//workstation routes

/*Create a workstation takes in a post request, the body must be:
{
    user: <current user>,
    name: <name of workstation>,
    amount: <amount of this workstation>,
    hours: <hours this workstation is available per week>
}
*/
Routes.route("/workstation/add").post((req,res) => {
    capacity.createWorkstation(req,res);
});

/*Provides a list of workstations registered to the user, takes a post request with body as follows:
{
    user: <current user>
}
*/
Routes.route("/workstation/list").post((req, res) => {
    capacity.listWorkstations(req,res);
});

/*Updates a workstation, takes a post request with a body as follows:
{
    id: <workstation id>,
    name: <new name>,
    amount: <new amount of workstations>
    hours: <new amount of hours>
}
*/
Routes.route("/workstation/update").post((req,res) => {
    capacity.updateWorkstation(req,res);
});

/*deletes a workstation, takes a post request with a body as follows:
{
    id: <workstation id>
}
*/
Routes.route("/workstation/delete").post((req, res) => {
    capacity.deleteWorkstation(req,res);
});

/*Finds a workstation, takes a post request with a body as follows:
{
    id: <workstation id>
}
*/
Routes.route("/workstation/find").post((req,res) => {
    capacity.findWorkstation(req,res);
})

//processes route

/*Create process takes in a post request, the body must be:
{
    user: <current user>,
    part: <name of part>,
    name: <name of process>,
    workstation: <name of a workstation>,
    MT: <Machine Time>,
    BS: <Batch Size>,
    RTY: <Rolled Throughput Yield>
}
*/
Routes.route("/process/add").post((req,res) => {
    capacity.createProcess(req,res);
});

/*Provides a list of processes registered to the user, takes a post request with body as follows:
{
    user: <current user>
}
*/
Routes.route("/process/list").post((req, res) => {
    capacity.listProcesses(req,res);
});

/*Updates a process, takes a post request with a body as follows:
{
    id: <process id>,
    name: <new name>,
    workstation: <name of a workstation>,
    MT: <Machine Time>,
    BS: <Batch Size>,
    RTY: <Rolled Throughput Yield>
}
*/
Routes.route("/process/update").post((req,res) => {
    capacity.updateProcess(req,res);
});

/*deletes a process, takes a post request with a body as follows:
{
    id: <process id>
}
*/
Routes.route("/process/delete").post((req, res) => {
    capacity.deleteProcess(req,res);
});

/*Finds a process, takes a post request with a body as follows:
{
    id: <process id>
}
*/
Routes.route("/process/find").post((req,res) => {
    capacity.findProcess(req,res);
});

/*Calculates capacity and returns a list of workstations with updated capacities, takes a post request with a body as follows:
{
    user: <current user>
}
*/
Routes.route("/capacity").post((req,res) => {
    capacity.getCapacity(req,res);
})

module.exports = Routes;