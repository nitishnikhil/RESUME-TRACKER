const express = require("express");
const multer = require("multer");
const { uploadToBlob } = require("../services/blobService");
const { saveCandidate, getCandidates, searchCandidatesBySkills, deleteCandidate } = require("../services/cosmosService");

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;

    const blobUrl = await uploadToBlob(
      file.originalname,
      file.buffer
    );

    const candidateData = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      education: req.body.education,
      experience: req.body.experience,
      skills: req.body.skills,
      tech: req.body.tech,
      resumeUrl: blobUrl,
      fileSize: file.size,
      uploadedAt: new Date(),
    };

    await saveCandidate(candidateData);

    res.json({
      message: "Resume uploaded successfully",
      url: blobUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/list", async (req, res) => {
  const data = await getCandidates();
  res.json(data);
});

// Search candidates by skills
router.get("/search", async (req, res) => {
  try {
    const skills = req.query.skills;

    if (!skills) {
      return res.status(400).json({ error: "Skills parameter is required" });
    }

    console.log("Searching for skills:", skills);
    const results = await searchCandidatesBySkills(skills);
    console.log("Search results:", results);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete candidate by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const candidateId = req.params.id;
    console.log("Delete request for ID:", candidateId);
    
    const result = await deleteCandidate(candidateId);
    
    res.json({ message: "Resume deleted successfully", result });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message || "Failed to delete resume" });
  }
});

module.exports = router;
