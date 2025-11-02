// controllers/judgmentController.js
import Judgment from "../models/Judgment.js";

// Get all judgments (with search/filter support)
export const getJudgments = async (req, res) => {
  try {
    const { search, caseType, year, court, limit = 20, page = 1 } = req.query;
    const query = {};

    // Search by keywords, title, or case number
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { caseNumber: { $regex: search, $options: "i" } },
        { keywords: { $in: [new RegExp(search, "i")] } }
      ];
    }

    if (caseType) query.caseType = caseType;
    if (year) query.year = parseInt(year);
    if (court) query.court = { $regex: court, $options: "i" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const judgments = await Judgment.find(query)
      .sort({ dateOfJudgment: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select("-fullText"); // Exclude full text for list view
    
    const total = await Judgment.countDocuments(query);

    res.status(200).json({
      judgments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error("Get judgments error:", err);
    res.status(500).json({ message: "Failed to fetch judgments" });
  }
};

// Get a single judgment by ID
export const getJudgmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const judgment = await Judgment.findById(id)
      .populate("referencedCases", "title caseNumber dateOfJudgment");
    
    if (!judgment) {
      return res.status(404).json({ message: "Judgment not found" });
    }
    
    res.status(200).json(judgment);
  } catch (err) {
    console.error("Get judgment error:", err);
    res.status(500).json({ message: "Failed to fetch judgment" });
  }
};

// Create a new judgment (admin only in future, or via import)
export const createJudgment = async (req, res) => {
  try {
    const {
      caseNumber,
      title,
      court,
      judge,
      dateOfJudgment,
      fullText,
      caseType,
      keywords,
      jurisdiction,
      year
    } = req.body;

    if (!caseNumber || !title || !court || !dateOfJudgment || !fullText) {
      return res.status(400).json({ 
        message: "Case number, title, court, date, and full text are required" 
      });
    }

    const judgment = await Judgment.create({
      caseNumber,
      title,
      court,
      judge,
      dateOfJudgment,
      fullText,
      caseType,
      keywords: keywords || [],
      jurisdiction,
      year: year || new Date(dateOfJudgment).getFullYear()
    });

    res.status(201).json({
      message: "Judgment created successfully",
      judgment
    });
  } catch (err) {
    console.error("Create judgment error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Judgment with this case number already exists" });
    }
    res.status(500).json({ message: "Failed to create judgment" });
  }
};

