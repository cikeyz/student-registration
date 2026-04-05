/* --- 1. INITIALIZATION ---
   I wrapped the setup functions here to run only once the DOM is fully loaded.
   I also added a quick auto-focus on the first name field to save the user a click.
*/
document.addEventListener("DOMContentLoaded", () => {
  // A. Generate and assign the Submission ID
  const submissionId = "SUB-" + Date.now();
  document.getElementById("submission_id").value = submissionId;
  document.getElementById("submission_id_bottom").value = submissionId;

  // B. Auto-focus the first required input
  const fnameInput = document.getElementById("fname");
  if (fnameInput) fnameInput.focus();

  // Initialize features
  initFloatingLabels();
  initSectionStepper();
});

/* --- 2. PROFILE PHOTO PREVIEW ---
   I added this so users can immediately see the photo they selected.
   It reads the file input and swaps out the placeholder for a circular image preview.
*/
const profilePhotoInput = document.getElementById("profile_photo");
profilePhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const previewImg = document.getElementById("photo-preview");
  const placeholder = document.getElementById("photo-placeholder");

  if (file && file.type.startsWith("image/")) {
    const previewUrl = URL.createObjectURL(file);
    previewImg.src = previewUrl;
    previewImg.style.display = "block";
    placeholder.style.display = "none";
  } else {
    previewImg.style.display = "none";
    placeholder.style.display = "block";
  }
});

/* --- 3. UPLOAD SCHOOL DOCUMENTS ---
   Since I hid the ugly default file input text, I wrote this to extract
   the selected file's name and display it clearly within the UI.
*/
const schoolDocsInput = document.getElementById("school_docs");
const schoolDocsName = document.getElementById("school-docs-filename");
schoolDocsInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    schoolDocsName.textContent = e.target.files[0].name;
  } else {
    schoolDocsName.textContent = "no file selected";
  }
});

/* --- 4. LIVE CHARACTER COUNTERS ---
   I made this a generic function so I could easily bind character limits to 
   both the bio and notes textareas. It turns red when they hit the limit.
*/
function setupCharCounter(inputId, counterId, limit) {
  const inputEl = document.getElementById(inputId);
  const counterEl = document.getElementById(counterId);

  inputEl.addEventListener("input", () => {
    const currentLength = inputEl.value.length;
    counterEl.textContent = `${currentLength} / ${limit} characters`;
    
    if (currentLength > limit) {
      counterEl.classList.add("limit-reached");
    } else {
      counterEl.classList.remove("limit-reached");
    }
  });
}
setupCharCounter("short_bio", "bio-counter", 200);
setupCharCounter("additional_notes", "notes-counter", 300);

/* --- 5. PASSWORD TOGGLE ---
   Just a simple script to swap the input type between 'password' and 'text' 
   so users can double-check what they typed.
*/
const pwdToggles = document.querySelectorAll(".pwd-toggle");
pwdToggles.forEach(toggle => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.getAttribute("data-target");
    const inputEl = document.getElementById(targetId);
    
    if (inputEl.type === "password") {
      inputEl.type = "text";
      toggle.textContent = "hide";
    } else {
      inputEl.type = "password";
      toggle.textContent = "show";
    }
  });
});

/* --- 6. PASSWORD STRENGTH INDICATOR ---
   I added this to give visual feedback on password strength. 
   It scores the password length and character complexity, then updates the UI bars.
*/
const pwdInput = document.getElementById("password");
const strengthBars = document.querySelectorAll("#pwd-strength .bar");
const strengthLabel = document.querySelector("#pwd-strength .strength-label");

pwdInput.addEventListener("input", () => {
  const val = pwdInput.value;
  let score = 0;
  
  if (val.length > 0 && val.length < 8) score = 1;
  else if (val.length >= 8) {
    score = 2;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score = 3;
    if (/[^a-zA-Z0-9]/.test(val)) score = 4;
  }

  // Reset colors
  strengthBars.forEach(bar => bar.style.backgroundColor = "var(--color-border)");
  strengthLabel.style.color = "var(--color-text-muted)";
  strengthLabel.textContent = "";

  // Apply colors based on score
  if (score === 1) {
    strengthBars[0].style.backgroundColor = "var(--color-error)";
    strengthLabel.style.color = "var(--color-error)";
    strengthLabel.textContent = "too short";
  } else if (score === 2) {
    for(let i=0; i<2; i++) strengthBars[i].style.backgroundColor = "var(--color-accent)";
    strengthLabel.style.color = "var(--color-accent)";
    strengthLabel.textContent = "weak";
  } else if (score === 3) {
    for(let i=0; i<3; i++) strengthBars[i].style.backgroundColor = "#D4A017";
    strengthLabel.style.color = "#D4A017";
    strengthLabel.textContent = "fair";
  } else if (score === 4) {
    for(let i=0; i<4; i++) strengthBars[i].style.backgroundColor = "var(--color-success)";
    strengthLabel.style.color = "var(--color-success)";
    strengthLabel.textContent = "strong";
  }
});

/* --- 7. RESET LOGIC ---
   The native form.reset() doesn't clear my custom UI states (like the photo preview or errors).
   I wrote this to make sure the reset button actually cleans up everything I added.
*/
const form = document.getElementById("registration-form");
const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", () => {
  form.reset();
  
  // Clear error visuals
  document.querySelectorAll(".error-msg").forEach(el => el.remove());
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
  
  // Reset custom states
  document.getElementById("photo-preview").style.display = "none";
  document.getElementById("photo-placeholder").style.display = "block";
  document.getElementById("school-docs-filename").textContent = "no file selected";
  document.getElementById("bio-counter").textContent = "0 / 200 characters";
  document.getElementById("notes-counter").textContent = "0 / 300 characters";
  document.getElementById("bio-counter").classList.remove("limit-reached");
  document.getElementById("notes-counter").classList.remove("limit-reached");
  
  // Reset password strength
  strengthBars.forEach(bar => bar.style.backgroundColor = "var(--color-border)");
  strengthLabel.textContent = "";
  
  // Reset floating labels
  document.querySelectorAll(".floating-group").forEach(group => group.classList.remove("float-active"));
  
  updateProgress();
});

/* --- 8. CLIENT-SIDE VALIDATION ---
   I'm intercepting the form submission here to check for empty fields, passwords that don't match,
   and to ensure they selected at least one tech interest before allowing a real submit.
*/
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent standard POST for local logic execution
  
  // Clear previous errors
  document.querySelectorAll(".error-msg").forEach(el => el.remove());
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

  let isValid = true;
  let firstErrorField = null;

  // Utility to mark error
  const markError = (inputEl, message, isGroup = false) => {
    isValid = false;
    
    // Check if handling the checkbox group exception
    if (isGroup) {
      const anchor = document.getElementById("interests-error-anchor");
      const err = document.createElement("span");
      err.className = "error-msg";
      err.textContent = message;
      anchor.appendChild(err);
      if (!firstErrorField) firstErrorField = document.querySelector(".checkbox-grid");
      return;
    }
    
    inputEl.classList.add("input-error");
    const err = document.createElement("span");
    err.className = "error-msg";
    err.textContent = message;
    
    // If it's part of floating group, append properly
    const parentGroup = inputEl.closest('.input-group') || inputEl.parentNode;
    parentGroup.appendChild(err);

    if (!firstErrorField) firstErrorField = inputEl;
  };

  // Required text/date/number items
  const requiredIds = ["fname", "lname", "dob", "email", "username", "age", "password", "confirm_password"];
  
  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      markError(el, "This field is required.");
    }
  });

  // Specific validations if theoretically filled
  const emailEl = document.getElementById("email");
  if (emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    markError(emailEl, "Please enter a valid email.");
  }

  const passEl = document.getElementById("password");
  if (passEl.value.trim() && passEl.value.length < 8) {
    if (!passEl.classList.contains("input-error")) {
      markError(passEl, "Password must be at least 8 characters.");
    }
  }

  const confirmEl = document.getElementById("confirm_password");
  if (confirmEl.value.trim() && confirmEl.value !== passEl.value) {
    if (!confirmEl.classList.contains("input-error")) {
      markError(confirmEl, "Passwords do not match.");
    }
  }

  // Checkbox group validation (tech interests required)
  const interests = document.querySelectorAll('input[name="interests[]"]:checked');
  if (interests.length === 0) {
    markError(null, "Please select at least one interest.", true);
  }

  // Execution result
  if (!isValid && firstErrorField) {
    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (isValid) {
    // Proceed with native submission since form is valid
    form.submit();
  }
});

/* --- 9. BONUS FEATURES ---  */

// Floating Labels
// I wrote this to track if an input has focus or holds text, so I can float the placeholder label up.
function initFloatingLabels() {
  const floatingGroups = document.querySelectorAll(".floating-group");
  
  floatingGroups.forEach(group => {
    const input = group.querySelector("input");
    if (!input) return;

    const checkState = () => {
      if (input.value.trim() !== "" || document.activeElement === input || input.type === "date" || input.hasAttribute("placeholder")) {
        group.classList.add("float-active");
      } else {
        group.classList.remove("float-active");
      }
    };
    
    // Initial check
    checkState();
    
    // Bind events
    input.addEventListener("focus", checkState);
    input.addEventListener("blur", checkState);
    input.addEventListener("input", checkState);
  });
}

// Copy Submission ID
const copyBtn = document.getElementById("copy-id-btn");
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    const id = document.getElementById("submission_id").value;
    navigator.clipboard.writeText(id).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "copied!";
      setTimeout(() => copyBtn.textContent = originalText, 2000);
    });
  });
}

// Mini Section Stepper
// [AI Assisted] This is the bonus sticky side navigation.
// The AI helped me figure out the IntersectionObserver so the active number updates as they scroll.
function initSectionStepper() {
  const sections = document.querySelectorAll("fieldset.form-section");
  const navBtns = document.querySelectorAll("#section-stepper button");
  
  if (sections.length === 0 || navBtns.length === 0) return;

  let isClickScrolling = false;
  let scrollTimeout = null;
  let currentIntersectingId = null;

  function setActiveNav(targetId) {
    const currentActive = document.querySelector(".fixed-nav .nav-btn.active");
    if (currentActive && currentActive.getAttribute("data-target") === targetId) return;

    navBtns.forEach(btn => {
      if (btn.getAttribute("data-target") === targetId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (isClickScrolling) return;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentIntersectingId = entry.target.id;
        
        // Prevent flashing back to native target if we accurately hit the bottom
        const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5;
        if (!isAtBottom) {
          setActiveNav(currentIntersectingId);
        }
      }
    });
  }, { rootMargin: "-10% 0px -60% 0px" });

  sections.forEach(sec => observer.observe(sec));

  // Click to scroll
  navBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      
      isClickScrolling = true;
      clearTimeout(scrollTimeout);
      
      const targetId = btn.getAttribute("data-target");
      setActiveNav(targetId);
      
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      
      scrollTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  });

  // Guarantee last section highlights if page is fully scrolled to the bottom
  window.addEventListener("scroll", () => {
    if (isClickScrolling) return; 

    const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5;
    
    if (isAtBottom) {
      if (navBtns.length > 0) {
        const lastTargetId = navBtns[navBtns.length - 1].getAttribute("data-target");
        setActiveNav(lastTargetId);
      }
    } else if (currentIntersectingId) {
      setActiveNav(currentIntersectingId);
    }
  });
}
