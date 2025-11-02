// controllers/caseController.js
import Case from "../models/Case.js";

// Get all cases for the authenticated user
export const getCases = async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    
    res.status(200).json(cases);
  } catch (err) {
    console.error("Get cases error:", err);
    res.status(500).json({ message: "Failed to fetch cases" });
  }
};

// Get a single case by ID
export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const caseData = await Case.findOne({ _id: id, userId: req.user.id })
      .populate("userId", "name email");
    
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    
    res.status(200).json(caseData);
  } catch (err) {
    console.error("Get case error:", err);
    res.status(500).json({ message: "Failed to fetch case" });
  }
};

// Create a new case
export const createCase = async (req, res) => {
  try {
    const {
      title,
      caseType,
      description,
      filingDate,
      hearingDate,
      deadline,
      plaintiff,
      defendant,
      tags
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newCase = await Case.create({
      userId: req.user.id,
      title,
      caseType: caseType || "Civil",
      description,
      filingDate,
      hearingDate,
      deadline,
      plaintiff,
      defendant,
      tags: tags || []
    });

    res.status(201).json({
      message: "Case created successfully",
      case: newCase
    });
  } catch (err) {
    console.error("Create case error:", err);
    res.status(500).json({ message: "Failed to create case" });
  }
};

// Update a case
export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const caseData = await Case.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json({
      message: "Case updated successfully",
      case: caseData
    });
  } catch (err) {
    console.error("Update case error:", err);
    res.status(500).json({ message: "Failed to update case" });
  }
};

// Delete a case
export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const caseData = await Case.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error("Delete case error:", err);
    res.status(500).json({ message: "Failed to delete case" });
  }
};

