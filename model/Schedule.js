const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=Schema.ObjectId;
const eventSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    location:{type:String,required:true},
    startTime:{type:String,required:true},
    endTime:{type:String,default:""}
})
const eventModel=mongoose.model("Event",eventSchema);
module.exports=eventModel;