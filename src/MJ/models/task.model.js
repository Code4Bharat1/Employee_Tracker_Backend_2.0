
// mangoose is a tool that helps Node.js talk to MongoDB. that is why we import mangoose so that we can use it
import mongoose from "mongoose";

// Structure of a document inside MongoDB
const taskSchema = new mongoose.Schema(
  {
    // task belong to which module
    module: {
      type: mongoose.Schema.Types.ObjectId,// it store the unique ID of the module that this task belongs to
      ref: "MJ_Module", //it connect this task to the MJ_Module collection in MongoDB
      required: true,
    },

    // Name of task
    title: {
      type: String,
      required: true,
    },

    // Description of task
    description: {
      type: String,
    },

    // which user is responsible for this task
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,//it store userID
      ref: "MJ_User",//Connected to MJ_User collection in MongoDB
      required: true,
    },


    deadline: {
      type: Date,
    },

    // task progress stage 
    // head/admin--> pending/approved/rejected
    // emp-->submitted
    // Note--> emp --> when task assign to emp by head/admin by defauls it shows pennding status
    status: {
      type: String,
      enum: ["PENDING", "SUBMITTED", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },

  { timestamps: true }
//   automatically creates "createdAt" and "updatedAt" fields so you dont need to manually create them

);

// this creates a Model called "MJ_Task
export default mongoose.model("MJ_Task", taskSchema);


// This does 2 things:
// Creates a Model
// Connects it to a MongoDB collection
// Here:
// "MJ_Task" → Model name inside mongoose--> converts in --> lowercase --> makes it plurral--> mj_tasks which is called Actual MongoDB collection --> inside database
// taskSchema → Structure of document

// When Mongoose creates that model, it automatically attaches many built-in methods to it.
// MJ_Task.create()
// MJ_Task.find()
// MJ_Task.updateOne()
// MJ_Task.deleteOne()
// MJ_Task.findOne()
// MJ_Task.findById()
// MJ_Task.findByIdAndUpdate()
// MJ_Task.findByIdAndDelete()


