import mongoose from 'mongoose';

const articalSchema = mongoose.Schema({
    artical_desc:{type:String},
    title:{type:String},
    username:{type:String},
    email:{type:String},
    creator: String,
    pic:{type:String},
    status:{type:String},
    comment:{type:['']},
    createdAt: {
        type: String,
       },
   
    
    Date:{
      type: String,
      } 
   
})
var Artical = mongoose.model('Artical', articalSchema);

export default Artical;