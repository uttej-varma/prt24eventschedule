const express=require("express");
const app=express();
const conn=require("./connection/connect");
const EVENT=require("./model/Schedule")
conn();
const bodyparser=require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
const {body,validationResult}=require("express-validator");
//creating an event using post request
app.post("/v1/events",body("title").isLength({min:1,max:15}).withMessage("validationError:Title is required and it's length should be less than 16 characters"),
body("description").isLength({min:1,max:30}).withMessage("validationError:Description is required and its length should be less than 31 characters")
,body("location").isLength({min:1,max:15}).withMessage("validationError:Location field is required and it's length should be less than 15 characters")
,body("startTime").isLength({min:24,max:24}).withMessage("validationError:startTime is required")
,async (req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            })
        }
        const data=await EVENT.create(req.body);
        res.status(201).json({
            msg:"event created successfully",
            data
        })
    }
    catch(e){
        res.status(400).json({
            message:e.message
        })
    }

})
//getting all existing events from the database
app.get("/v1/events",async (req,res)=>{
   try{
    const data=await EVENT.find();
    res.status(200).json({
        data
    })
   }
   catch(e){
    res.status(400).json({
        msg:e.message
    })
   }
})
//getting a particular request based on id of the event sent in the form of params
app.get("/v1/events/:id",async (req,res)=>{
    try{
        const data=await EVENT.find({_id:req.params.id});
        if(data.length>0){
            res.status(200).json({
                data
            })
        }
        else{
            res.status(404).json({
                error:"There is no event with that ID"
            })
        }
    }
    catch(e){
        res.status(400).json({
            msg:e.message
        })
    }
})
//Deleting a particular event based on id of the event that was sent as params in the url
app.delete("/v1/events/:id", async (req,res)=>{
    await EVENT.findByIdAndDelete({_id:req.params.id});
    res.status(204).json({})
})
//updating an event using put request and id passed as param to url along with validations
app.put("/v1/events/:id",body("title").isLength({min:1,max:15}).withMessage("validationError:Title is required and it's length should be less than 16 characters"),
body("description").isLength({min:1,max:30}).withMessage("validationError:Description is required and its length should be less than 31 characters")
,body("location").isLength({min:1,max:15}).withMessage("validationError:Location field is required and it's length should be less than 15 characters")
,body("startTime").isLength({min:24,max:24}).withMessage("validationError:startTime is required"),async (req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            })
        }
          const data=await EVENT.findByIdAndUpdate({_id:req.params.id},req.body,{new:true});
          if(data){
            res.status(200).json({
                data
            })
          }
          else{
            res.status(200).json({
              msg:"no event in the database has the ID that you provided"
            })
          }
          
          
    }
    catch(e){
            res.status(400).json({
                message:e.message
            })
    }
})
app.listen(3200,()=>{console.log("server is running at 3200 port")});