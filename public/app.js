const form = document.getElementById("resumeForm");
const list = document.getElementById("resumeList");

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

// ===== PAGE NAVIGATION =====
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
  loginPage.style.display = "block";
  candidatePage.style.display = "none";
  adminPage.style.display = "none";
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
        <span>${item.name || "Candidate"} - ${item.email}</span>
        <a href="${item.resumeUrl}" target="_blank">Download</a>
      `;
      list.appendChild(li);
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
    } else {
      displayAdminResumes(data);
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
    
    console.log("Resume item:", item);
    console.log("Resume URL:", item.resumeUrl);
    
    li.innerHTML = `
      <div class="candidate-card">
        <div class="candidate-info">
          <h3>${item.name || "Candidate"}</h3>
          <p><strong>Email:</strong> ${item.email}</p>
          ${skillsText ? `<p>${skillsText}</p>` : ""}
        </div>
        <a href="${item.resumeUrl}" target="_blank" class="download-link">Download Resume</a>
      </div>
    `;
    adminResumeList.appendChild(li);
  });
}

// Initial load
loginPage.style.display = "block";
candidatePage.style.display = "none";
adminPage.style.display = "none";
