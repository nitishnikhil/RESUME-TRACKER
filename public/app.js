const form = document.getElementById("resumeForm");
const list = document.getElementById("resumeList");

// Landing Page Elements
const landingPage = document.getElementById("landingPage");
const getStartedBtn = document.getElementById("getStartedBtn");
const desktopLoginBtn = document.getElementById("desktopLoginBtn");
const backToLandingBtn = document.getElementById("backToLandingBtn");

// Login Page Elements
const loginPage = document.getElementById("loginPage");
const candidatePage = document.getElementById("candidatePage");
const adminPage = document.getElementById("adminPage");
const candidateBtn = document.getElementById("candidateBtn");
const adminBtn = document.getElementById("adminBtn");
const logoutCandidateBtn = document.getElementById("logoutCandidateBtn");
const logoutAdminBtn = document.getElementById("logoutAdminBtn");

// Admin Page Elements
const skillsSearchInput = document.getElementById("skillsSearchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const adminResumeList = document.getElementById("adminResumeList");

// Theme Toggle Elements
const themeToggleBtn = document.getElementById("themeToggleBtn");

// ===== THEME TOGGLE =====
// Initialize theme from localStorage
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.textContent = "☀️ Light Mode";
  }
}

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  themeToggleBtn.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Initialize theme on load
initializeTheme();

// ===== ANALYTICS FUNCTIONS =====
function calculateAnalytics(candidates) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let weeksUploads = 0;
  let monthUploads = 0;
  const skillsMap = {};

  candidates.forEach(candidate => {
    const uploadDate = new Date(candidate.uploadedAt);
    
    // Count uploads this week and month
    if (uploadDate >= oneWeekAgo) {
      weeksUploads++;
    }
    if (uploadDate >= oneMonthAgo) {
      monthUploads++;
    }

    // Collect skills
    if (candidate.skills) {
      const skillsArray = candidate.skills
        .split(",")
        .map(skill => skill.trim().toLowerCase())
        .filter(skill => skill.length > 0);

      skillsArray.forEach(skill => {
        skillsMap[skill] = (skillsMap[skill] || 0) + 1;
      });
    }
  });

  // Get top 5 skills
  const topSkills = Object.entries(skillsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    total: candidates.length,
    weeksUploads,
    monthUploads,
    topSkills
  };
}

function displayAnalytics(candidates) {
  const analytics = calculateAnalytics(candidates);

  // Update stats
  document.getElementById("totalResumes").textContent = analytics.total;
  document.getElementById("weeksUploads").textContent = analytics.weeksUploads;
  document.getElementById("monthUploads").textContent = analytics.monthUploads;

  // Display top skills
  const topSkillsList = document.getElementById("topSkillsList");
  topSkillsList.innerHTML = "";

  if (analytics.topSkills.length === 0) {
    topSkillsList.innerHTML = "<p style='color: #999; text-align: center;'>No skills data available</p>";
  } else {
    analytics.topSkills.forEach(([skill, count]) => {
      const skillItem = document.createElement("div");
      skillItem.className = "skill-item";
      skillItem.innerHTML = `
        <span class="skill-name">${skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
        <span class="skill-count">${count} ${count === 1 ? "resume" : "resumes"}</span>
      `;
      topSkillsList.appendChild(skillItem);
    });
  }
}

// ===== PAGE NAVIGATION =====
// Landing Page Navigation
getStartedBtn.addEventListener("click", () => {
  landingPage.style.display = "none";
  loginPage.style.display = "flex";
});

desktopLoginBtn.addEventListener("click", () => {
  landingPage.style.display = "none";
  loginPage.style.display = "flex";
});

backToLandingBtn.addEventListener("click", () => {
  loginPage.style.display = "none";
  landingPage.style.display = "block";
});

// Login to Candidate/Admin
candidateBtn.addEventListener("click", () => {
  loginPage.style.display = "none";
  candidatePage.style.display = "block";
  loadResumes();
});

adminBtn.addEventListener("click", () => {
  loginPage.style.display = "none";
  adminPage.style.display = "block";
  loadAdminResumes();
});

logoutCandidateBtn.addEventListener("click", logout);
logoutAdminBtn.addEventListener("click", logout);

function logout() {
  loginPage.style.display = "none";
  candidatePage.style.display = "none";
  adminPage.style.display = "none";
  landingPage.style.display = "block";
  form.reset();
  skillsSearchInput.value = "";
  adminResumeList.innerHTML = "";
}

// ===== CANDIDATE UPLOAD SECTION =====
// Upload resume
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(form);

    const res = await fetch("/api/resumes/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Upload failed");
      return;
    }

    alert(data.message || "Resume uploaded successfully");

    form.reset();
    loadResumes();
  } catch (err) {
    console.error(err);
    alert("Something went wrong while uploading");
  }
});

// Load uploaded resumes for candidate view
async function loadResumes() {
  list.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch("/api/resumes/list");
    const data = await res.json();

    list.innerHTML = "";

    if (!data || data.length === 0) {
      list.innerHTML = "<li>No resumes uploaded yet</li>";
      return;
    }

    data.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="candidate-name-email">${item.name || "Candidate"} - ${item.email}</span>
        <button class="download-btn-restricted" data-resume-name="${item.name || 'Resume'}">Download</button>
      `;
      list.appendChild(li);
    });

    // Add event listeners to all download buttons
    document.querySelectorAll(".download-btn-restricted").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        showAccessDeniedModal();
      });
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = "<li>Error loading resumes</li>";
  }
}

// ===== ADMIN SEARCH SECTION =====
// Load all resumes for admin
async function loadAdminResumes() {
  adminResumeList.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch("/api/resumes/list");
    const data = await res.json();

    // Display analytics
    displayAnalytics(data);

    displayAdminResumes(data);
  } catch (err) {
    console.error(err);
    adminResumeList.innerHTML = "<li>Error loading resumes</li>";
  }
}

// Search candidates by skills
searchBtn.addEventListener("click", async () => {
  const skills = skillsSearchInput.value.trim();

  if (!skills) {
    alert("Please enter at least one skill");
    return;
  }

  adminResumeList.innerHTML = "<li>Searching...</li>";

  try {
    const res = await fetch(`/api/resumes/search?skills=${encodeURIComponent(skills)}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();

    if (!data || data.length === 0) {
      adminResumeList.innerHTML = `<li>No candidates found with skills: "${skills}"</li>`;
    } else {      displayAnalytics(data);      displayAdminResumes(data);
    }
  } catch (err) {
    console.error("Search error:", err);
    adminResumeList.innerHTML = "<li>Error searching resumes</li>";
  }
});

// Clear search and show all
clearSearchBtn.addEventListener("click", () => {
  skillsSearchInput.value = "";
  loadAdminResumes();
});

// Display resumes in admin panel
function displayAdminResumes(data) {
  adminResumeList.innerHTML = "";

  if (!data || data.length === 0) {
    adminResumeList.innerHTML = "<li>No resumes found</li>";
    return;
  }

  data.forEach(item => {
    const li = document.createElement("li");
    const skillsText = item.skills ? `<strong>Skills:</strong> ${item.skills}` : "";
    
    li.innerHTML = `
      <div class="candidate-card" data-candidate-id="${item.id}" data-candidate-json='${JSON.stringify(item)}'>
        <div class="candidate-info">
          <h3>${item.name || "Candidate"}</h3>
          <p><strong>Email:</strong> ${item.email}</p>
          ${skillsText ? `<p>${skillsText}</p>` : ""}
        </div>
        <button class="card-action" style="border: none; background: none; cursor: pointer; padding: 0; font-size: 12px; color: #1a4ed8; font-weight: bold;">📋 View Details</button>
      </div>
    `;
    adminResumeList.appendChild(li);
    
    // Add click handler only to View Details button
    const viewBtn = li.querySelector(".card-action");
    viewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = e.target.closest(".candidate-card");
      const candidateData = JSON.parse(card.dataset.candidateJson);
      showCandidateDetailModal(candidateData);
    });
  });
}

// ===== MODAL FUNCTIONS =====
const accessDeniedModal = document.getElementById("accessDeniedModal");
const closeModal = accessDeniedModal.querySelector(".close-modal");
const goToAdminBtn = document.getElementById("goToAdminBtn");
const candidateDetailModal = document.getElementById("candidateDetailModal");
const closeDetailModal = document.getElementById("closeDetailModal");
const detailDownloadBtn = document.getElementById("detailDownloadBtn");
const detailDeleteBtn = document.getElementById("detailDeleteBtn");

let currentCandidateData = null;

function showAccessDeniedModal() {
  accessDeniedModal.style.display = "block";
}

function hideAccessDeniedModal() {
  accessDeniedModal.style.display = "none";
}

function showCandidateDetailModal(candidateData) {
  currentCandidateData = candidateData;
  
  document.getElementById("detailModalName").textContent = candidateData.name || "Candidate";
  document.getElementById("detailName").textContent = candidateData.name || "N/A";
  document.getElementById("detailEmail").textContent = candidateData.email || "N/A";
  document.getElementById("detailSkills").textContent = candidateData.skills || "N/A";
  
  // Format file size - try from fileSize field first, then from blob URL
  if (candidateData.fileSize && candidateData.fileSize > 0) {
    const sizeInKB = (candidateData.fileSize / 1024).toFixed(2);
    document.getElementById("detailFileSize").textContent = `${sizeInKB} KB`;
  } else if (candidateData.resumeUrl) {
    // Try to fetch size from blob URL headers
    fetch(candidateData.resumeUrl, { method: "HEAD" })
      .then(response => {
        const contentLength = response.headers.get("content-length");
        if (contentLength) {
          const sizeInKB = (parseInt(contentLength) / 1024).toFixed(2);
          document.getElementById("detailFileSize").textContent = `${sizeInKB} KB`;
        } else {
          document.getElementById("detailFileSize").textContent = "File info unavailable";
        }
      })
      .catch(err => {
        console.error("Error fetching file size:", err);
        document.getElementById("detailFileSize").textContent = "File info unavailable";
      });
  } else {
    document.getElementById("detailFileSize").textContent = "File info unavailable";
  }
  
  const uploadDate = new Date(candidateData.uploadedAt).toLocaleDateString();
  document.getElementById("detailUploadedAt").textContent = uploadDate;
  
  detailDownloadBtn.href = candidateData.resumeUrl;
  detailDownloadBtn.download = `${candidateData.name || "resume"}.pdf`;
  
  candidateDetailModal.style.display = "block";
}

function hideCandidateDetailModal() {
  candidateDetailModal.style.display = "none";
  currentCandidateData = null;
}

closeModal.addEventListener("click", hideAccessDeniedModal);
closeDetailModal.addEventListener("click", hideCandidateDetailModal);

goToAdminBtn.addEventListener("click", () => {
  hideAccessDeniedModal();
  logout();
  adminBtn.click();
});

detailDeleteBtn.addEventListener("click", async () => {
  if (!currentCandidateData) return;
  
  const confirmDelete = confirm(
    `Are you sure you want to delete the resume for ${currentCandidateData.name}? This action cannot be undone.`
  );
  
  if (!confirmDelete) return;
  
  try {
    detailDeleteBtn.disabled = true;
    detailDeleteBtn.textContent = "Deleting...";
    
    const res = await fetch(`/api/resumes/delete/${currentCandidateData.id}`, {
      method: "DELETE"
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      alert(data.error || "Failed to delete resume");
      detailDeleteBtn.disabled = false;
      detailDeleteBtn.textContent = "🗑️ Delete Resume";
      return;
    }
    
    alert("Resume deleted successfully!");
    hideCandidateDetailModal();
    
    // Reload the appropriate list
    if (skillsSearchInput.value.trim()) {
      searchBtn.click();
    } else {
      loadAdminResumes();
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("Error deleting resume");
    detailDeleteBtn.disabled = false;
    detailDeleteBtn.textContent = "🗑️ Delete Resume";
  }
});

// Close modal when clicking outside of it
accessDeniedModal.addEventListener("click", (e) => {
  if (e.target === accessDeniedModal) {
    hideAccessDeniedModal();
  }
});

candidateDetailModal.addEventListener("click", (e) => {
  if (e.target === candidateDetailModal) {
    hideCandidateDetailModal();
  }
});

// Initial load
loginPage.style.display = "block";
candidatePage.style.display = "none";
adminPage.style.display = "none";
