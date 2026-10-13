import mongoose from "mongoose";
const { Schema, model } = mongoose;
const opts = { timestamps: true, toJSON: { virtuals: true } };

const User = model("User", new Schema({
  name: String,
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  photo: String,
  role: { type: String, enum: ["Worker", "Buyer", "Admin"], default: "Worker" },
  coin: { type: Number, default: 0, min: 0 },
  suspended: { type: Boolean, default: false },
  autoCreated: { type: Boolean, default: false },
}, opts));

const taskSchema = new Schema({
  task_title: { type: String, required: true },
  task_detail: { type: String, required: true },
  submission_info: String,
  task_image: String,
  required_workers: { type: Number, required: true, min: 1 },
  payable_amount: { type: Number, required: true, min: 1 }, // coins per worker
  completion_date: { type: String, required: true }, // YYYY-MM-DD
  buyer_email: { type: String, required: true, index: true },
  buyer_name: String,
  filled: { type: Number, default: 0 }, // pending + approved submissions
  approved: { type: Number, default: 0 },
  escrow: { type: Number, default: 0 }, // coins reserved for workers
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ["Active", "Completed"], default: "Active" },
}, opts);
// Aliases so older frontend components (MyTaskTable, BuyerHome) keep working
const alias = {
  title: "task_title", detail: "task_detail", worker: "required_workers",
  payableAmount: "payable_amount", completionDate: "completion_date", submissionInfo: "submission_info",
};
Object.entries(alias).forEach(([a, f]) => taskSchema.virtual(a).get(function () { return this[f]; }));
taskSchema.virtual("slots_left").get(function () { return Math.max(0, this.required_workers - this.filled); });
taskSchema.virtual("coin").get(function () { return this.required_workers * this.payable_amount; });
const Task = model("Task", taskSchema);

const subSchema = new Schema({
  task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  task_title: String,
  payable_amount: Number,
  worker_email: { type: String, required: true, index: true },
  worker_id: { type: Schema.Types.ObjectId, ref: "User" },
  worker_photo: String,
  worker_name: String,
  buyer_email: { type: String, required: true, index: true },
  buyer_name: String,
  submission_detail: String,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
}, opts);
subSchema.index({ task_id: 1, worker_email: 1 }, { unique: true });
const Submission = model("Submission", subSchema);

const Withdrawal = model("Withdrawal", new Schema({
  worker_email: { type: String, required: true, index: true },
  worker_name: String,
  withdrawal_coin: Number,
  withdrawal_amount: Number, // USD
  payment_system: String,
  account_number: String,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  processed_by: String,
}, opts));

const Payment = model("Payment", new Schema({
  email: { type: String, index: true },
  name: String,
  coins: Number,
  amount: Number, // cents
  method: String,
  transactionId: { type: String, unique: true, sparse: true },
  status: { type: String, default: "Completed" },
  dummy: { type: Boolean, default: false },
}, opts));

const Notification = model("Notification", new Schema({
  email: { type: String, index: true },
  message: String,
  actionRoute: { type: String, default: "/dashboard" },
  read: { type: Boolean, default: false },
  time: { type: Date, default: Date.now },
}));

const ActivityLog = model("ActivityLog", new Schema({
  actor: String, action: String, target: String, details: String,
}, opts));

export { User, Task, Submission, Withdrawal, Payment, Notification, ActivityLog };
