// models/Reminder.js
import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", index: true },
  
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true, index: true },
  
  // Reminder settings
  priority: { 
    type: String, 
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
  
  // Notification settings
  notifyBeforeDays: { type: Number, default: 1 }, // Days before to notify
  notificationSent: { type: Boolean, default: false },
  notificationSentAt: { type: Date },
  
  // Recurrence (optional)
  isRecurring: { type: Boolean, default: false },
  recurrencePattern: { type: String } // e.g., "weekly", "monthly"
}, { timestamps: true });

export default mongoose.model("Reminder", reminderSchema);

