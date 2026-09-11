import mongoose from 'mongoose';
const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['Present','Absent','Leave','Half Day'], default: 'Present' }
}, { timestamps: true });
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
export default mongoose.model('Attendance', attendanceSchema);
