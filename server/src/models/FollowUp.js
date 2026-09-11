import mongoose from 'mongoose';
const followUpSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mode: { type: String, enum: ['Call','WhatsApp','Email','Meeting','Other'], default: 'Call' },
  summary: { type: String, required: true },
  outcome: String,
  nextFollowUp: Date
}, { timestamps: true });
export default mongoose.model('FollowUp', followUpSchema);
