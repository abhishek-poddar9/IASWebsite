import mongoose from 'mongoose';
const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true, min: 0 },
  paymentMode: { type: String, enum: ['Cash','UPI','Bank','Card','Other'], default: 'UPI' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
export default mongoose.model('Expense', expenseSchema);
