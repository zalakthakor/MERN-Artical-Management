import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import UserModal from "../models/user.js";
import mongoose from "mongoose";

import moment from "moment";
const secret = process.env.SECRET;

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });
    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
    const isPswCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPswCorrect) return res.status(400).json({ message: "Invalid Password" });
    console.log(res.json)
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "2h" });
    
    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    console.log(message)
    res.status(500).json({ message: "Something went wrong!" });
  }
};



export const createUser = async (req, res) => {

  const { email, password, status, name } = req.body;
  try {
    const oldUser = await UserModal.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "User already available" });
    
    const hashedPsw = await bcrypt.hash(password, 12);
    const result = await UserModal.create({ email:email, password: hashedPsw, name: name,status:status });
    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "2h" } );
    
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const user = await UserModal.find().sort({Date:-1});
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserById = async(request,response)=>{
  
  console.log(request.params)
  try{
      const c=await UserModal.findById(request.params.id);
      response.status(200).json(c);
      
  }catch(error){
      response.status(404).json({message:error.message})
  }
  
}


export const updateUser = async (req, res) => {
  const artical = req.body;
  const { id } = req.params;
  const { name, email, password ,status} = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No artical with id: ${id}`);

  const updatedArtical = {
    ...artical,
    name,
    email,
    password,
    status,
    updatedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
    _id: id,
  };

  const newArtical = await UserModal.findByIdAndUpdate(id, updatedArtical, { new: true });
  
  res.json(newArtical);
};




export const deleteUser=async(request,response)=>{
    try{
        await UserModal.deleteOne({_id:request.params.id});
        response.status(201).json("User Deleted Successfully");
    }catch(error){
        response.status(409).json({message:error.message});
    }
}