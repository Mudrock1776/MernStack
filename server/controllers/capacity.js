const part = require("../models/parts");
const workstation = require("../models/workstations");
const process = require("../models/process");

//parts
//Create Part
exports.createPart = async (req, res) => {
    var newPart = new part(req.body);
    try {
        await newPart.save();
        res.status(200).send("Created part");
    } catch(err) {
        console.log(err);
        res.status(400).send("Failed to Create part");
    }
}

//Read parts
exports.listParts = async (req, res) => {
    try {
        var parts = await part.find({user: req.body.user});
        res.json(parts);
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}

//Update part
exports.updatePart = async (req, res) => {
    try{
        await part.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
            months: req.body.months
        });
        res.send(200, "Updated part");
    } catch(err) {
        console.log(err);
        res.send(400, "Failed to update part");
    }
}

//Delete part
exports.deletePart = async (req,res) => {
    try {
        await part.findByIdAndDelete(req.body.id);
        res.send(200, "Part Deleted");
    } catch(err) {
        console.log(err);
        res.send(400, err);
    }
}

//Find part
exports.findPart = async (req, res) => {
    try {
        var searchedPart = await part.findById(req.body.id);
        res.json(searchedPart);
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}

//workstations
//Create Workstation
exports.createWorkstation = async (req, res) => {
    var newWorkstation = new workstation(req.body);
    newWorkstation.availability = newWorkstation.hours * 4 * newWorkstation.amount;
    try {
        await newWorkstation.save();
        res.status(200).send("Created workstation");
    } catch(err) {
        console.log(err);
        res.status(400).send("Failed to Create workstation");
    }
}

//Read workstations
exports.listWorkstations = async (req, res) => {
    try {
        var workstations = await workstation.find({user: req.body.user});
        res.json(workstations);
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}

//Update workstation
exports.updateWorkstation = async (req, res) => {
    try{
        await workstation.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
            amount: req.body.amount,
            hours: req.body.hours,
            availability: Number(req.body.hours) * Number(req.body.amount) * 4
        });
        res.send(200, "Updated workstation");
    } catch(err) {
        console.log(err);
        res.send(400, "Failed to update workstation");
    }
}

//Delete workstation
exports.deleteWorkstation = async (req,res) => {
    try {
        await workstation.findByIdAndDelete(req.body.id);
        res.send(200, "Workstation Deleted");
    } catch(err) {
        console.log(err);
        res.send(400, err);
    }
}

//Find workstation
exports.findWorkstation = async (req, res) => {
    try {
        var searchedWorkstation = await workstation.findById(req.body.id);
        res.json(searchedWorkstation);
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}

//processes
//Create Process
exports.createProcess = async (req, res) => {
    var newProcess = new process(req.body);
    try {
        await newProcess.save();
        res.status(200).send("Created process");
    } catch(err) {
        console.log(err);
        res.status(400).send("Failed to Create process");
    }
}

//Read process
exports.listProcesses = async (req, res) => {
    try {
        var processes = await process.find({user: req.body.user});
        res.json(processes);
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}

//Update process
exports.updateProcess = async (req, res) => {
    try{
        await process.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
            workstation: req.body.workstation,
            MT: req.body.MT,
            BS: req.body.BS,
            RTY: req.body.RTY
        });
        res.send(200, "Updated process");
    } catch(err) {
        console.log(err);
        res.send(400, "Failed to update process");
    }
}

//Delete process
exports.deleteProcess = async (req,res) => {
    try {
        await process.findByIdAndDelete(req.body.id);
        res.send(200, "Process Deleted");
    } catch(err) {
        console.log(err);
        res.send(400, err);
    }
}

//Find Process
exports.findProcess = async (req, res) => {
    try {
        var searchedProcess = await process.findById(req.body.id);
        res.json(searchedProcess);
    } catch(err) {
        console.log(err);
        res.send(500, err);
    }
}

//capacity calculations
exports.getCapacity = async (req, res) => {
    try {
        var parts = await part.find({user: req.body.user});
        for (currentPart in parts) {
            var processes = await process.find({user: req.body.user, part: currentPart.name});
            for (currentProcess in processes) {
                var currentWorkstation = workstation.find({user: req.body.user, name: currentProcess.workstation});
                if (currentWorkstation.capacity == null) {
                    var capacities = Array.apply(0, Array(currentPart.months.length)).map(function () {});
                } else {
                    var capacities = currentWorkstation.capacity;
                }
                for (let i = 0; i < currentPart.months.length; i++){
                    capacities[i] += (currentWorkstation.availability * currentProcess.BS * currentProcess.RTY) / (currentPart.amount * currentProcess.MT );
                }
                await workstation.findOneAndUpdate({user: req.body.user, name: currentProcess.workstation}, {
                    capacity: capacities
                });
            }
        }
        var workstations = await workstation.find({user: req.body.user});
        res.json(workstations);
    } catch(err) {
        console.log(err);
        res.send(400, err)
    }
}