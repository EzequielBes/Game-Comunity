import mongoose from "mongoose";

const Message = new mongoose.Schema({
  message_id :{
   type: String,
   require: true,
  },
  sender_username : {
    type: String,
    require : true,
  },
  recipient_username : {
    type : String,
    require: true
  },
  message_content : {
    type: String,
    require: true,
  },
  date : {
    type : Date,
    require : true
  }

})
export const Mensagem = mongoose.model('Message', Message )
