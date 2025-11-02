// controllers/reminderController.js
import Reminder from "../models/Reminder.js";

// Get all reminders for the authenticated user
export const getReminders = async (req, res) => {
  try {
    const { upcoming, completed } = req.query;
    const query = { userId: req.user.id };

    if (upcoming === "true") {
      query.dueDate = { $gte: new Date() };
      query.isCompleted = false;
    }
    if (completed === "true") {
      query.isCompleted = true;
    }

    const reminders = await Reminder.find(query)
      .populate("caseId", "title caseType")
      .sort({ dueDate: 1 });
    
    res.status(200).json(reminders);
  } catch (err) {
    console.error("Get reminders error:", err);
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
};

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const {
      caseId,
      title,
      description,
      dueDate,
      priority,
      notifyBeforeDays
    } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and due date are required" });
    }

    const reminder = await Reminder.create({
      userId: req.user.id,
      caseId,
      title,
      description,
      dueDate,
      priority: priority || "medium",
      notifyBeforeDays: notifyBeforeDays || 1
    });

    res.status(201).json({
      message: "Reminder created successfully",
      reminder
    });
  } catch (err) {
    console.error("Create reminder error:", err);
    res.status(500).json({ message: "Failed to create reminder" });
  }
};

// Update a reminder
export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("caseId", "title");

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({
      message: "Reminder updated successfully",
      reminder
    });
  } catch (err) {
    console.error("Update reminder error:", err);
    res.status(500).json({ message: "Failed to update reminder" });
  }
};

// Mark reminder as completed
export const completeReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { 
        $set: { 
          isCompleted: true, 
          completedAt: new Date() 
        } 
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({
      message: "Reminder marked as completed",
      reminder
    });
  } catch (err) {
    console.error("Complete reminder error:", err);
    res.status(500).json({ message: "Failed to complete reminder" });
  }
};

// Delete a reminder
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (err) {
    console.error("Delete reminder error:", err);
    res.status(500).json({ message: "Failed to delete reminder" });
  }
};

