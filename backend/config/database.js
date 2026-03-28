const mongoose  = require("mongoose")

exports.connect = () =>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>console.log("DB connected"))
    .catch((err)=>{
        console.log("DB connection Failed")
        console.log(err);
        process.exit(1);
    })
};