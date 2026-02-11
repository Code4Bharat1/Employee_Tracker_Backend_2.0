import  Model  from "../models/module.model";
export const createModule = async (req, res) =>{
try {
    const module = await Module.create(req.body);
    res.status(201).json(module);
} catch {
    res.status(500).json({ message: "Cretion Failed" });
}
};

export  const getModules = async (req,res) => {
    try {
        const modules = await Module.find().populate("project assignedTo");
        res.status(200).json(modules);
    } catch {
        res.status(500).json({ message: "Fetch failed" });
        
    }
};

export const updateModule = async (req,res)=>{
    try {
        const module = await Module.findByIdAndUpadte(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(module);
    } catch {
        res.status(500).json({ message: "Upadte failed" });
        
    }
};

export const deleteModule = async (req,res) =>{
    try {
        await module.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Delete" });
    } catch{
        res.status(500).json({message: "Delete failed" });
    }
};