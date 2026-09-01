// Example controller file
// Location: controllers/exampleController.js

// const Example = require('../models/Example');

// Get all
exports.getAll = async (req, res) => {
  try {
    // const data = await Example.find();
    // res.json(data);
    res.json({ message: 'Get all - add your logic here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by ID
exports.getById = async (req, res) => {
  try {
    // const data = await Example.findById(req.params.id);
    // res.json(data);
    res.json({ message: 'Get by ID - add your logic here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create
exports.create = async (req, res) => {
  try {
    // const newData = new Example(req.body);
    // await newData.save();
    // res.status(201).json(newData);
    res.json({ message: 'Create - add your logic here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    // const updatedData = await Example.findByIdAndUpdate(req.params.id, req.body);
    // res.json(updatedData);
    res.json({ message: 'Update - add your logic here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.delete = async (req, res) => {
  try {
    // await Example.findByIdAndDelete(req.params.id);
    // res.json({ message: 'Deleted' });
    res.json({ message: 'Delete - add your logic here' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
