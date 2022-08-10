
import mongoose from "mongoose";

import moment from "moment";
import Artical from "../models/articals.js";

export const createArtical = async (req, res) => {
  const { title, artical_desc, creator, username,pic,status,email } = req.body;
  console.log(req.body);

  const newArtical = new Artical({
    artical_desc: artical_desc,
    email:email,
    title: title,
    creator: creator,
    createdAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
    username: username,
    pic:pic,
    status:status,
    Date: moment().toISOString(),
  });

  try {
    await newArtical.save();
    res.status(201).json(newArtical);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getArticals = async (req, res) => {
  try {
    const artical = await Artical.find().sort({Date:-1});
    res.status(200).json(artical);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateArtical = async (req, res) => {
  const artical = req.body;
  const { id } = req.params;
  const { title, artical_desc, creator } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No artical with id: ${id}`);

  const updatedArtical = {
    ...artical,
    creator,
    title,
    artical_desc,
    updatedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
    _id: id,
  };

  const newArtical = await Artical.findByIdAndUpdate(id, updatedArtical, { new: true });
  
  res.json(newArtical);
  console.log(newArtical)
};


export const updateStatus = async (req, res) =>{
 
  const { id } = req.params;
 

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No artical with id: ${id}`);

  const updatedArtical = {
   status:"Approved"
  };

  const newArtical = await Artical.findByIdAndUpdate(id, updatedArtical, { new: true });
 
  res.json(newArtical);
}

export const updateComment = async (req, res) =>{
  
 
  const { id } = req.params;
  console.log(id)
   const { comment } = req.body;
   
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No artical with id: ${id}`);

 
  const newArtical=await Artical.findByIdAndUpdate(id,{
    $push:{comment:comment}},{ new: true }
  )
 
  res.json(newArtical);
  
}

export const deleteArtical=async(request,response)=>{
    try{
        await Artical.deleteOne({_id:request.params.id});
        response.status(201).json("User Deleted Successfully");
    }catch(error){
        response.status(409).json({message:error.message});
    }
}

export const getarticalById = async(request,response)=>{
 
  console.log(request.params)
  try{
      const ti=await Artical.findById(request.params.id);
      response.status(200).json(ti);
      
  }catch(error){
      response.status(404).json({message:error.message})
  }
  
}



