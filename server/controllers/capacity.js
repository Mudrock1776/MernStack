const part = require("../models/parts");
const workstation = require("../models/workstations");
const process = require("../models/process");
const mongoose = require("mongoose")
const fileId = mongoose.Types.ObjectId;

//parts
//Create Part
exports.createPart = async (req, res) => {
    var newPart = new part(req.body);
    try {
        if(await part.exists({user: newPart.user, name: newPart.name})){
            res.status(406).send("Name taken");
        } else {
            await newPart.save();
            res.status(200).send("Created part");
        }
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
        res.status(500).send(err);
    }
}

//Update part
exports.updatePart = async (req, res) => {
    try{
        //You're proably wondering why this if statment is like this, it is because exist brings back the id as an ObjectID, which reads as undefined, but if we turn the returned code to a string, then the object becomes a string, which then we turn back to a json to make it easier
        if(await part.exists({user: req.body.user, name: req.body.name}) != null && JSON.parse(JSON.stringify(await part.exists({user: req.body.user, name: req.body.name})))._id != req.body.id){
            res.status(406).send("Name taken");
        } else {
            await part.findByIdAndUpdate(req.body.id, {
                name: req.body.name,
                months: req.body.months
            });
            res.status(200).send("Updated part");
        }
    } catch(err) {
        console.log(err);
        res.status(406).send("Failed to update part");
    }
}

//Delete part
exports.deletePart = async (req,res) => {
    try {
        await part.findByIdAndDelete(req.body.id);
        res.status(200).send("Part Deleted");
    } catch(err) {
        console.log(err);
        res.status(406).send(err);
    }
}

//Find part
exports.findPart = async (req, res) => {
    try {
        var searchedPart = await part.findById(req.body.id);
        res.json(searchedPart);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

//workstations
//Create Workstation
exports.createWorkstation = async (req, res) => {
    var newWorkstation = new workstation(req.body);
    newWorkstation.availability = newWorkstation.hours * 4 * newWorkstation.amount;
    try {
        if(await workstation.exists({user: req.body.user, name:req.body.name})){
            res.status(406).send("Name taken");
        } else {
            await newWorkstation.save();
            res.status(200).send("Created workstation");
        }
    } catch(err) {
        console.log(err);
        res.status(406).send("Failed to Create workstation");
    }
}

//Read workstations
exports.listWorkstations = async (req, res) => {
    try {
        var workstations = await workstation.find({user: req.body.user});
        res.json(workstations);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

//Update workstation
exports.updateWorkstation = async (req, res) => {
    try{
        if(await workstation.exists({user: req.body.user, name: req.body.name}) != null && JSON.parse(JSON.stringify(await workstation.exists({user: req.body.user, name: req.body.name})))._id != req.body.id){
            res.status(406).send("Name taken");
        } else {
            await workstation.findByIdAndUpdate(req.body.id, {
                name: req.body.name,
                amount: req.body.amount,
                hours: req.body.hours,
                availability: Number(req.body.hours) * Number(req.body.amount) * 4
            });
            res.status(200).send("Updated workstation");
        }
    } catch(err) {
        console.log(err);
        res.status(406).send("Failed to update workstation");
    }
}

//Delete workstation
exports.deleteWorkstation = async (req,res) => {
    try {
        await workstation.findByIdAndDelete(req.body.id);
        res.status(200).send("Workstation Deleted");
    } catch(err) {
        console.log(err);
        res.status(406).send(err);
    }
}

//Find workstation
exports.findWorkstation = async (req, res) => {
    try {
        var searchedWorkstation = await workstation.findById(req.body.id);
        res.json(searchedWorkstation);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

//processes
//Create Process
exports.createProcess = async (req, res) => {
    var newProcess = new process(req.body);
    try {
        if(await process.exists({user: req.body.user, name:req.body.name, part: req.body.part})){
            res.status(406).send("Name taken");
        } else {
            await newProcess.save();
            res.status(200).send("Created process");
        }
    } catch(err) {
        console.log(err);
        res.status(406).send("Failed to Create process");
    }
}

//Read process
exports.listProcesses = async (req, res) => {
    try {
        var processes = await process.find({user: req.body.user, part: req.body.part});
        res.json(processes);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

//Update process
exports.updateProcess = async (req, res) => {
    try{
        if(await process.exists({user: req.body.user, name: req.body.name, part: req.body.part}) != null && JSON.parse(JSON.stringify(await process.exists({user: req.body.user, name: req.body.name, part: req.body.part})))._id != req.body.id){
            res.status(406).send("Name taken");
        } else {
            await process.findByIdAndUpdate(req.body.id, {
                name: req.body.name,
                workstation: req.body.workstation,
                MT: req.body.MT,
                BS: req.body.BS,
                RTY: req.body.RTY
            });
            res.status(200).send("Updated process");
        }
    } catch(err) {
        console.log(err);
        res.status(406).send("Failed to update process");
    }
}

//Delete process
exports.deleteProcess = async (req,res) => {
    try {
        await process.findByIdAndDelete(req.body.id);
        res.status(200).send("Process Deleted");
    } catch(err) {
        console.log(err);
        res.status(406).send(err);
    }
}

//Find Process
exports.findProcess = async (req, res) => {
    try {
        var searchedProcess = await process.findById(req.body.id);
        res.json(searchedProcess);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

//capacity calculations
exports.getCapacity = async (req, res) => {
    try {
        
        await workstation.updateMany({user: req.body.user}, {
            capacity: [0]
        })
        var parts = await part.find({user: req.body.user});
        for (currentPart in parts) {
            var processes = await process.find({user: req.body.user, part: parts[currentPart].name});
            for (currentProcess in processes) {
                var currentWorkstation = await workstation.findOne({user: req.body.user, name: processes[currentProcess].workstation});
                if (currentWorkstation.capacity.length != parts[currentPart].months.length) {
                    var capacities = Array(parts[currentPart].months.length);
                    for (let i = 0; i < parts[currentPart].months.length; i++) {
                        capacities[i] = 0;
                    }
                } else {
                    var capacities = currentWorkstation.capacity;
                }
                for (let i = 0; i < parts[currentPart].months.length; i++){
                    capacities[i] = capacities[i] + ((parts[currentPart].months[i] * processes[currentProcess].MT ) / (processes[currentProcess].BS * processes[currentProcess].RTY));
                }
                await workstation.findOneAndUpdate({user: req.body.user, name: processes[currentProcess].workstation}, {
                    capacity: capacities
                });
            }
        }
        var workstations = await workstation.find({user: req.body.user});
        for (currentWorkstation in workstations) {
            for (i = 0; i < workstations[currentWorkstation].capacity.length; i++){
                workstations[currentWorkstation].capacity[i] = (workstations[currentWorkstation].capacity[i] / workstations[currentWorkstation].availability) * 100;
            }
        }
        res.json(workstations);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}