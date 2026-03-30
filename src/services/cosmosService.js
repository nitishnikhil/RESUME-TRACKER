const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});

const database = client.database(process.env.COSMOS_DATABASE);
const container = database.container(process.env.COSMOS_CONTAINER);

async function saveCandidate(data) {
  const { resource } = await container.items.create(data);
  return resource;
}

async function getCandidates() {
  const { resources } = await container.items
    .query("SELECT * FROM c")
    .fetchAll();
  return resources;
}

async function searchCandidatesBySkills(skillsQuery) {
  try {
    // Get all candidates
    const { resources } = await container.items
      .query("SELECT * FROM c")
      .fetchAll();

    // Filter candidates by skills (case-insensitive partial match)
    const searchTerms = skillsQuery
      .toLowerCase()
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const filteredCandidates = resources.filter(candidate => {
      const candidateSkills = candidate.skills
        ? candidate.skills.toLowerCase()
        : "";

      // Check if any search term matches any candidate skill
      return searchTerms.some(term => candidateSkills.includes(term));
    });

    return filteredCandidates;
  } catch (err) {
    console.error("Error searching candidates:", err);
    throw err;
  }
}

module.exports = { saveCandidate, getCandidates, searchCandidatesBySkills };
