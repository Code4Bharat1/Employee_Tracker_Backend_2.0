import Testing from "../models/testing.model.js";
import Project from "../models/project.model.js";

/*
CREATE TESTING
Employee sends project for testing
*/

export const createTesting = async (req, res) => {

  try {

    const testing = await Testing.create({
      project: req.body.project,
      employee: req.body.employee,
      feedback: req.body.feedback,
    });

    res.status(201).json({
      message: "Testing created",
      testing,
    });

  } catch (error) {

    res.status(500).json({
      message: "Testing creation failed",
      error: error.message,
    });

  }

};


/*GET ALL TESTING
Manager can see all
*/

export const getAllTesting = async (req, res) => {

  try {

    const testing = await Testing.find()
      .populate("project", "title status")
      .populate("employee", "name email")
      .populate("testedBy", "name email");

    res.status(200).json(testing);

  } catch (error) {

    res.status(500).json({
      message: "Fetch failed",
      error: error.message,
    });

  }

};

/*
GET SINGLE TESTING
*/

export const getTestingById = async (req, res) => {

  try {

    const testing = await Testing.findById(req.params.id)
      .populate("project")
      .populate("employee")
      .populate("testedBy");

    res.status(200).json(testing);

  } catch (error) {

    res.status(500).json({
      message: "Fetch failed",
      error: error.message,
    });

  }

};

/*APPROVE TESTING
Manager approves project
*/

export const approveTesting = async (req, res) => {

  try {

    const testing = await Testing.findByIdAndUpdate(

      req.params.id,

      {
        status: "approved",
        feedback: req.body.feedback,
        testedBy: req.user.id,
      },

      { new: true }

    );


    // update project status

    await Project.findByIdAndUpdate(

      testing.project,

      { status: "completed" }

    );


    res.status(200).json({

      message: "Project Approved",

      testing,

    });

  } catch (error) {

    res.status(500).json({

      message: "Approval failed",

      error: error.message,

    });

  }

};

/*REJECT TESTING
Manager rejects project
*/

export const rejectTesting = async (req, res) => {

  try {

    const testing = await Testing.findByIdAndUpdate(

      req.params.id,

      {
        status: "rejected",
        feedback: req.body.feedback,
        testedBy: req.user.id,
      },

      { new: true }

    );


    await Project.findByIdAndUpdate(

      testing.project,

      { status: "in progress" }

    );


    res.status(200).json({

      message: "Project Rejected",

      testing,

    });

  } catch (error) {

    res.status(500).json({

      message: "Reject failed",

      error: error.message,

    });

  }

};



/*
DELETE TESTING
*/

export const deleteTesting = async (req, res) => {

  try {

    await Testing.findByIdAndDelete(req.params.id);

    res.status(200).json({

      message: "Testing deleted",

    });

  } catch (error) {

    res.status(500).json({

      message: "Delete failed",

      error: error.message,

    });

  }

};