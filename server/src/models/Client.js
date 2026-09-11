import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  clientCode: { type: String, unique: true, required: true },
  name: { type: String, required: true, trim: true },
  entityType: { type: String, enum: ['Individual','Proprietorship','Partnership','LLP','Private Limited','Public Limited','Trust/Society','Other'], default: 'Individual' },
  pan: String,
  gstin: String,
  tan: String,
  email: String,
  phone: String,
  address: String,
  services: [{ type: String }],
  status: { type: String, enum: ['Lead','Active','On Hold','Closed'], default: 'Lead' },
  source: { type: String, default: 'Referral' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  nextFollowUp: Date
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);
