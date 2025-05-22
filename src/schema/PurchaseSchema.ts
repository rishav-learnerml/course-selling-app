import {Schema, model, Types} from "mongoose";

const purchaseSchema = new Schema({
    userId: Types.ObjectId,
    courseId: Types.ObjectId
})

export const Purchase = model("Purchase",purchaseSchema);