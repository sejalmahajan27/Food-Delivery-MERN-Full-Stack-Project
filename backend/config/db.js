import mongoose from "mongoose";

export const connectDB = async ()=> {
    await mongoose.connect('mongodb+srv://sejalmahajan272005:sejalmahajan272005@cluster0.eccx1vz.mongodb.net/food-del').then(()=>console.log('DB Connected'));
    
}