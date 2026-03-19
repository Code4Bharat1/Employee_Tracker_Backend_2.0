import Project from "../models/project.model.js";

export const createProject = async (req, res)=>{
    try {

        const project = await Project.create(req.body);

        const populatedProject = await project.populate(
            "assignedTo",
            "name email"
        );

        res.status(201).json(populatedProject);

    } catch {
       res.status(500).json({message:"Project creation failed"}); 
    }
};

export const getProjects = async(req, res)=>{
    try {
        const projects = await Project.find().populate("assignedTo", "name email");
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

export const updateProjectStatus = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    // ✅ HANDLE NOT FOUND
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Status update failed" });
  }
};