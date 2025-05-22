import {Schema, model, Types} from "mongoose";

const courseSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:String,
    price:{
        type: Number,
        required:true
    },
    imageUrl: String,
    creatorId: Types.ObjectId
})

export const Course = model("Course",courseSchema);