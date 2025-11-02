// models/ChatLog.js
import mongoose from "mongoose";

const chatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", index: true }, // Optional: link to specific case
  messages: [{
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  // Context for the conversation
  context: {
    queryType: { 
      type: String, 
      enum: ["general", "case_analysis", "judgment_search", "summarization", "guidance"],
      default: "general"
    },
    relatedJudgmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Judgment" },
    relatedCaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" }
  },
  // Session metadata
  sessionId: { type: String, index: true },
  status: { type: String, enum: ["active", "completed"], default: "active" }
}, { timestamps: true });

export default mongoose.model("ChatLog", chatLogSchema);

