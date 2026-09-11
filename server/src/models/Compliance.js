import mongoose from 'mongoose';

const complianceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  service: { type: String, required: true },
  period: String,
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending','In Progress','Waiting for Client','Filed','Completed','Overdue'], default: 'Pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acknowledgementNo: String,
  filedOn: Date,
  remarks: String,
  documentChecklist: [{ name: String, received: { type: Boolean, default: false } }]
}, { timestamps: true });

export default mongoose.model('Compliance', complianceSchema);
