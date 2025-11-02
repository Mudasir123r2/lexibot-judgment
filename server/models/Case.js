// models/Case.js
import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  caseType: { 
    type: String, 
    enum: [
      "Civil", "Criminal", "Family", "Corporate", 
      "Property", "Contract", "Employment", "Intellectual Property", "Other"
    ],
    default: "Civil"
  },
  description: { type: String },
  status: { 
    type: String, 
    enum: ["Active", "Pending", "Closed", "Archived"],
    default: "Active"
  },
  // Key dates
  filingDate: { type: Date },
  hearingDate: { type: Date },
  deadline: { type: Date },
  // Parties involved
  plaintiff: { type: String },
  defendant: { type: String },
  // AI predictions (mock for MVP)
  predictedOutcome: {
    confidence: { type: Number, min: 0, max: 100 },
    predictedStatus: { type: String }, // e.g., "Likely to Win", "Uncertain"
    reasoning: { type: String }
  },
  // Extracted key information
  keyDetails: {
    obligations: [{ type: String }],
    deadlines: [{ type: String }],
    involvedParties: [{ type: String }]
  },
  // Metadata
  tags: [{ type: String }],
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model("Case", caseSchema);

