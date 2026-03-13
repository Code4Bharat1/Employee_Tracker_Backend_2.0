import mongoose from "mongoose";
import { MODULE_STATUS } from "../utils/constants.js";

const moduleSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true,
    trim:true
  },

  project:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"IT_Project",
    required:true
  },

  assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"IT_User"
  },

  deadline:{
    type:Date,
    required:true
  },

  completedAt:Date,

  reworkCount:{
    type:Number,
    default:0
  },

  bugCount:{
    type:Number,
    default:0
  },

  progress:{
    type:Number,
    default:0,
    min:0,
    max:100
  },

  priority:{
    type:String,
    enum:['LOW','MEDIUM','HIGH'],
    default:'MEDIUM'
  },

  status:{
    type:String,
    enum:Object.values(MODULE_STATUS),
    default:MODULE_STATUS.PENDING
  }

},{timestamps:true});

moduleSchema.pre("save", function(){

  if(this.status === "COMPLETED" && !this.completedAt){
    this.completedAt = new Date();
  }

  if(this.status === "PENDING") this.progress = 0;
  if(this.status === "IN_PROGRESS") this.progress = 50;
  if(this.status === "COMPLETED") this.progress = 90;
  if(this.status === "APPROVED") this.progress = 100;

});

moduleSchema.index({assignedTo:1});
moduleSchema.index({project:1});
moduleSchema.index({status:1});
moduleSchema.index({completedAt:1});

export default mongoose.model("IT_Module",moduleSchema);