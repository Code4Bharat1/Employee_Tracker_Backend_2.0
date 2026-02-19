import Project from "../models/project.model.js";

export const createProject = async (req, res)=>{
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch {
       res.status(500).json({message:"Project creation failed"}); 
    }
};

export const getProjects = async(req, res)=>{
    try {
        const projects = await Project.find().populate("assignedTo", "name email");
        console.log(projects);
        res.status(200).json(projects);
    } catch {
        res.status(500).json({message:"Fetch failed"});
    }
};

export const getProjectById = async (req,res) =>{
    try {
        const project = await Project.findById(req.params.id);
        res.status(200).json(project);
    } catch {
        res.status(500).json({message:"Fetch failed"});
    }
};

export const updateProject = async(req, res)=>{
    try {
       const project = await Project.findByIdAndUpdate(req.params.id, req.body, {new:true});
       res.status(200).json(project); 
    } catch {
        res.status(500).json({message: "update Failed"})
    }
};

export const deleteProject = async(req,res)=>{
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        res.status(200).json(project);
    } catch {
        res.status(500).json({message: "Delete Failed"});
    }
};

export const updateProjectStatus = async (req, res)=>{
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            {status:req.body.status},
            {new: true}
        );
        res.status(200).json(project);
    } catch {
        res.status(500).json({message:"status  update failed"});
    }
};