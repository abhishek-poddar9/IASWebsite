import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Client from "./models/Client.js";
import Compliance from "./models/Compliance.js";
import Task from "./models/Task.js";

await connectDB();
await Promise.all([
  User.deleteMany({}),
  Client.deleteMany({}),
  Compliance.deleteMany({}),
  Task.deleteMany({}),
]);
const admin = await User.create({
  name: "Office Admin",
  email: "admin@caoffice.local",
  password: "Admin@123",
  role: "admin",
  designation: "Proprietor / Admin",
});
const emp = await User.create({
  name: "Amit Sharma",
  email: "amit@caoffice.local",
  password: "Employee@123",
  role: "employee",
  designation: "Accounts Executive",
});
const c1 = await Client.create({
  clientCode: "CL-1001",
  name: "ABC Traders",
  entityType: "Proprietorship",
  phone: "9876543210",
  services: ["GST Return", "Income Tax Return", "Bookkeeping"],
  status: "Active",
  assignedTo: emp._id,
  nextFollowUp: new Date(Date.now() + 3 * 86400000),
});
const c2 = await Client.create({
  clientCode: "CL-1002",
  name: "Rohan Verma",
  entityType: "Individual",
  phone: "9898989898",
  services: ["Income Tax Return"],
  status: "Lead",
  assignedTo: emp._id,
});
await Compliance.create({
  client: c1._id,
  service: "GST Return",
  period: "Monthly",
  dueDate: new Date(Date.now() + 7 * 86400000),
  assignedTo: emp._id,
  documentChecklist: [
    { name: "Sales Register" },
    { name: "Purchase Register" },
    { name: "Bank Statement" },
  ],
});
await Task.create({
  title: "Collect GST documents",
  description: "Call client and collect monthly records",
  client: c1._id,
  assignedTo: emp._id,
  createdBy: admin._id,
  dueDate: new Date(Date.now() + 2 * 86400000),
  priority: "High",
});
console.log("Seed complete");
console.log("Admin: admin@caoffice.local / Admin@123");
console.log("Employee: amit@caoffice.local / Employee@123");
process.exit(0);
