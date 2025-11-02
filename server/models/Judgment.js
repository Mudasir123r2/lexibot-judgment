// models/Judgment.js
import mongoose from "mongoose";

const judgmentSchema = new mongoose.Schema({
  // Judgment identification
  caseNumber: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  court: { type: String, required: true },
  judge: { type: String },
  dateOfJudgment: { type: Date, required: true },
  
  // Full text content
  fullText: { type: String, required: true },
  
  // AI-generated summary (mock for MVP)
  summary: { type: String },
  
  // Extracted key information
  keyInformation: {
    parties: [{ name: String, role: String }],
    issues: [{ type: String }],
    decisions: [{ type: String }],
    deadlines: [{ type: String }],
    obligations: [{ type: String }]
  },
  
  // Categorization
  caseType: { 
    type: String, 
    enum: [
      "Civil", "Criminal", "Family", "Corporate", 
      "Property", "Contract", "Employment", "Intellectual Property", "Other"
    ]
  },
  keywords: [{ type: String, index: true }],
  
  // Citation and references
  citations: [{ type: String }],
  referencedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Judgment" }],
  
  // Metadata
  jurisdiction: { type: String },
  year: { type: Number, index: true },
  tags: [{ type: String, index: true }],
  
  // For vector search (when AI is integrated)
  embedding: { type: [Number] }
}, { timestamps: true });

export default mongoose.model("Judgment", judgmentSchema);

