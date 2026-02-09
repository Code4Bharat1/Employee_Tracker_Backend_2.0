import Module from "../models/module.model.js";

export const createModule = async (req, res)=>{
    try {
        const module = await Module.create(req.body);
        res.status(201).json(module);
    } catch (error) {
        res.status(500).json({message: "Module creations failed"});
    }
};
export const getModules = async (req,res)=>{
    try {
        const module = await Module.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(module);
    } catch (error) {
        res.status(500).json({message:"Module update failed"});
        
    }
};

export const deleteModule = async (req,res)=>{
    try {
        await Module.findByIdAndUpdate(req.params.id);
        res.status(200).json({message:"Module delated"});
    } catch (error) {
        res.status(500).json({message:"Module deletion failed"});
    }
};