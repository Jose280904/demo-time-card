import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVsbugDlLYIiN7D70OrzZ94wdzOV2CVgk",
  authDomain: "fir-time-card.firebaseapp.com",
  projectId: "fir-time-card",
  storageBucket: "fir-time-card.firebasestorage.app",
  messagingSenderId: "329685379883",
  appId: "1:329685379883:web:249ce9cbef76b49b4f736e",
  measurementId: "G-GKV8F9SBBN"
};

const adminEmails = [
  "centralwebservices@outlook.com"
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appLayout = document.querySelector(".app-layout");

const authBox = document.getElementById("authBox");
const signupBox = document.getElementById("signupBox");
const clockBox = document.getElementById("clockBox");
const adminBox = document.getElementById("adminBox");
const welcomeText = document.getElementById("welcomeText");
const records = document.getElementById("records");
const settingsName = document.getElementById("settingsName");
const weekPicker = document.getElementById("weekPicker");
const settingsIconBtn = document.getElementById("settingsIconBtn");
const settingsModal = document.getElementById("settingsModal");

const employeeLeftColumn = document.getElementById("employeeLeftColumn");
const employeeRightPanel = document.getElementById("employeeRightPanel");

const myHistoryBox = document.getElementById("myHistoryBox");
const myWeekPicker = document.getElementById("myWeekPicker");
const myHistoryRecords = document.getElementById("myHistoryRecords");

const myScheduleBox = document.getElementById("myScheduleBox");
const myScheduleWeekPicker = document.getElementById("myScheduleWeekPicker");
const loadMyScheduleBtn = document.getElementById("loadMyScheduleBtn");
const myScheduleRecords = document.getElementById("myScheduleRecords");

const adminScheduleBuilderWeekPicker = document.getElementById("adminScheduleBuilderWeekPicker");
const buildScheduleWeekBtn = document.getElementById("buildScheduleWeekBtn");
const scheduleWeekGrid = document.getElementById("scheduleWeekGrid");
const selectedScheduleDayBox = document.getElementById("selectedScheduleDayBox");
const selectedScheduleDayTitle = document.getElementById("selectedScheduleDayTitle");

const scheduleEmployeeEmail = document.getElementById("scheduleEmployeeEmail");
const scheduleEmployeeName = document.getElementById("scheduleEmployeeName");
const scheduleDate = document.getElementById("scheduleDate");
const scheduleStartTime = document.getElementById("scheduleStartTime");
const scheduleEndTime = document.getElementById("scheduleEndTime");
const scheduleLocation = document.getElementById("scheduleLocation");
const scheduleNotes = document.getElementById("scheduleNotes");
const postScheduleBtn = document.getElementById("postScheduleBtn");

const adminScheduleWeekPicker = document.getElementById("adminScheduleWeekPicker");
const loadAdminSchedulesBtn = document.getElementById("loadAdminSchedulesBtn");
const adminScheduleRecords = document.getElementById("adminScheduleRecords");

const timeEditBox = document.getElementById("timeEditBox");
const editDate = document.getElementById("editDate");
const editTime = document.getElementById("editTime");
const editType = document.getElementById("editType");
const editReason = document.getElementById("editReason");
const myTimeEditRequests = document.getElementById("myTimeEditRequests");
const timeEditRequests = document.getElementById("timeEditRequests");

const signatureBox = document.getElementById("signatureBox");
const signatureAdminBox = document.getElementById("signatureAdminBox");
const signatureStatus = document.getElementById("signatureStatus");
const signatureInput = document.getElementById("signatureInput");
const submitSignatureBtn = document.getElementById("submitSignatureBtn");
const weeklySignatures = document.getElementById("weeklySignatures");

const adminPunchEditorBtn = document.getElementById("adminPunchEditorBtn");
const adminPunchModal = document.getElementById("adminPunchModal");
const closeAdminPunchBtn = document.getElementById("closeAdminPunchBtn");
const adminEditWeekPicker = document.getElementById("adminEditWeekPicker");
const loadAdminPunchesBtn = document.getElementById("loadAdminPunchesBtn");
const adminPunchEditorRecords = document.getElementById("adminPunchEditorRecords");

const editPunchModal = document.getElementById("editPunchModal");
const closeEditPunchBtn = document.getElementById("closeEditPunchBtn");
const editingPunchId = document.getElementById("editingPunchId");
const adminEditPunchDate = document.getElementById("adminEditPunchDate");
const adminEditPunchTime = document.getElementById("adminEditPunchTime");
const adminEditPunchType = document.getElementById("adminEditPunchType");
const saveEditedPunchBtn = document.getElementById("saveEditedPunchBtn");

let currentUserName = "";

setCurrentWeek();
setTodayDate();

document.getElementById("showPasswordBtn").addEventListener("click", () => {
  togglePassword("password", "showPasswordBtn");
});

document.getElementById("showSignupPasswordBtn").addEventListener("click", () => {
  togglePassword("signupPassword", "showSignupPasswordBtn");
});

document.getElementById("showConfirmPasswordBtn").addEventListener("click", () => {
  togglePassword("confirmPassword", "showConfirmPasswordBtn");
});

document.getElementById("openSignupBtn").addEventListener("click", () => {
  authBox.classList.add("hidden");
  signupBox.classList.remove("hidden");
});

document.getElementById("backToLoginBtn").addEventListener("click", () => {
  signupBox.classList.add("hidden");
  authBox.classList.remove("hidden");
});

document.getElementById("forgotPasswordLink").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim().toLowerCase();

  if (!email) {
    alert("Enter your email first, then click forgot password.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent.");
  } catch (error) {
    alert(error.message);
  }
});

settingsIconBtn.addEventListener("click", () => {
  settingsModal.classList.remove("hidden");
});

document.getElementById("closeSettingsBtn").addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

settingsModal.addEventListener("click", (event) => {
  if (event.target === settingsModal) {
    settingsModal.classList.add("hidden");
  }
});

adminPunchEditorBtn.addEventListener("click", () => {
  adminPunchModal.classList.remove("hidden");
  adminEditWeekPicker.value = weekPicker.value || getCurrentWeekValue();
});

closeAdminPunchBtn.addEventListener("click", () => {
  adminPunchModal.classList.add("hidden");
});

adminPunchModal.addEventListener("click", (event) => {
  if (event.target === adminPunchModal) {
    adminPunchModal.classList.add("hidden");
  }
});

closeEditPunchBtn.addEventListener("click", () => {
  editPunchModal.classList.add("hidden");
});

editPunchModal.addEventListener("click", (event) => {
  if (event.target === editPunchModal) {
    editPunchModal.classList.add("hidden");
  }
});

loadAdminPunchesBtn.addEventListener("click", async () => {
  await loadAdminPunchEditor();
});

adminPunchEditorRecords.addEventListener("click", async (event) => {
  const editBtn = event.target.closest(".admin-edit-punch-btn");
  const deleteBtn = event.target.closest(".admin-delete-punch-btn");

  if (editBtn) {
    openEditPunchModal(editBtn);
  }

  if (deleteBtn) {
    await softDeletePunch(deleteBtn.dataset.id);
  }
});

saveEditedPunchBtn.addEventListener("click", async () => {
  await saveEditedPunch();
});

postScheduleBtn.addEventListener("click", async () => {
  await postEmployeeSchedule();
});

loadAdminSchedulesBtn.addEventListener("click", async () => {
  await loadAdminSchedules();
});

loadMyScheduleBtn.addEventListener("click", async () => {
  await loadMySchedule();
});

buildScheduleWeekBtn.addEventListener("click", () => {
  buildScheduleWeekGrid();
});

scheduleWeekGrid.addEventListener("click", (event) => {
  const dayButton = event.target.closest(".schedule-day-btn");

  if (!dayButton) return;

  document.querySelectorAll(".schedule-day-btn").forEach((button) => {
    button.classList.remove("active-day");
  });

  dayButton.classList.add("active-day");

  scheduleDate.value = dayButton.dataset.date;
  selectedScheduleDayTitle.textContent = `${dayButton.dataset.day} · ${dayButton.dataset.display}`;
  selectedScheduleDayBox.classList.remove("hidden");
});

document.getElementById("signupBtn").addEventListener("click", async () => {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Enter name, email, password, and confirm password.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await saveEmployeeName(user.uid, email, name, true);

    currentUserName = name;
    alert("Account created!");
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter your email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("saveNameBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  const newName = settingsName.value.trim();

  if (!user) return;

  if (!newName) {
    alert("Enter a name first.");
    return;
  }

  try {
    const cleanEmail = user.email.toLowerCase().trim();

    await saveEmployeeName(user.uid, cleanEmail, newName, false);

    currentUserName = newName;
    welcomeText.innerHTML = `Welcome, <span>${escapeHTML(currentUserName)}</span>`;
    settingsModal.classList.add("hidden");

    alert("Name updated!");
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("resetPasswordBtn").addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) return;

  try {
    await sendPasswordResetEmail(auth, user.email);
    alert("Password reset email sent.");
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
});

document.getElementById("clockInBtn").addEventListener("click", async () => {
  await savePunch("Clock In");
});

document.getElementById("startLunchBtn").addEventListener("click", async () => {
  await savePunch("Start Lunch");
});

document.getElementById("endLunchBtn").addEventListener("click", async () => {
  await savePunch("End Lunch");
});

document.getElementById("clockOutBtn").addEventListener("click", async () => {
  await savePunch("Clock Out");
});

document.getElementById("submitTimeEditBtn").addEventListener("click", async () => {
  await submitTimeEditRequest();
});

document.getElementById("loadTimeEditRequestsBtn").addEventListener("click", async () => {
  await loadPendingTimeEditRequests();
});

document.getElementById("loadWeeklySignaturesBtn").addEventListener("click", async () => {
  await loadWeeklySignatures();
});

submitSignatureBtn.addEventListener("click", async () => {
  await submitWeeklySignature();
});

timeEditRequests.addEventListener("click", async (event) => {
  const approveBtn = event.target.closest(".approve-request-btn");
  const rejectBtn = event.target.closest(".reject-request-btn");

  if (approveBtn) {
    await approveTimeEditRequest(approveBtn.dataset.id);
  }

  if (rejectBtn) {
    await rejectTimeEditRequest(rejectBtn.dataset.id);
  }
});

document.getElementById("loadRecordsBtn").addEventListener("click", async () => {
  await loadWeeklyRecords();
});

document.getElementById("loadMyHistoryBtn").addEventListener("click", async () => {
  await loadMyHistory();
});

function buildScheduleWeekGrid() {
  const selectedWeek = adminScheduleBuilderWeekPicker.value;

  if (!selectedWeek) {
    alert("Please choose a week first.");
    return;
  }

  const employeeEmail = scheduleEmployeeEmail.value.trim().toLowerCase();
  const employeeName = scheduleEmployeeName.value.trim();

  if (!employeeEmail || !employeeName) {
    alert("Enter the employee email and employee name first.");
    return;
  }

  const { startOfWeek } = getWeekDateRange(selectedWeek);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let html = "";

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);

    const dateValue = formatDateInputValue(dayDate);
    const displayDate = dayDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    html += `
      <button
        type="button"
        class="schedule-day-btn"
        data-date="${dateValue}"
        data-day="${dayNames[i]}"
        data-display="${displayDate}"
      >
        <strong>${dayNames[i]}</strong>
        <span>${displayDate}</span>
      </button>
    `;
  }

  scheduleWeekGrid.innerHTML = html;
  selectedScheduleDayBox.classList.add("hidden");
}

async function postEmployeeSchedule() {
  const adminUser = auth.currentUser;

  if (!adminUser) return;

  const employeeEmail = scheduleEmployeeEmail.value.trim().toLowerCase();
  const employeeName = scheduleEmployeeName.value.trim();
  const dateValue = scheduleDate.value;
  const startTimeValue = scheduleStartTime.value;
  const endTimeValue = scheduleEndTime.value;
  const locationValue = scheduleLocation.value.trim();
  const notesValue = scheduleNotes.value.trim();

  if (!employeeEmail || !employeeName || !dateValue || !startTimeValue || !endTimeValue) {
    alert("Enter employee email, employee name, choose a day, start time, and end time.");
    return;
  }

  const scheduleDateObj = new Date(`${dateValue}T${startTimeValue}`);

  if (Number.isNaN(scheduleDateObj.getTime())) {
    alert("Please enter a valid schedule date and time.");
    return;
  }

  try {
    const weekValue = getWeekValueFromDate(scheduleDateObj);

    await addDoc(collection(db, "schedules"), {
      employeeEmail,
      employeeName,
      date: dateValue,
      startTime: startTimeValue,
      endTime: endTimeValue,
      location: locationValue,
      notes: notesValue,
      week: weekValue,
      scheduleDateTime: scheduleDateObj,
      postedBy: adminUser.email.toLowerCase().trim(),
      postedAt: serverTimestamp(),
      deleted: false
    });

    scheduleStartTime.value = "";
    scheduleEndTime.value = "";
    scheduleLocation.value = "";
    scheduleNotes.value = "";

    alert("Schedule posted for this day. You can click another day and keep using the same employee info.");

    adminScheduleWeekPicker.value = weekValue;
    await loadAdminSchedules();
  } catch (error) {
    alert(error.message);
  }
}

async function loadAdminSchedules() {
  adminScheduleRecords.innerHTML = "";

  const selectedWeek = adminScheduleWeekPicker.value;

  if (!selectedWeek) {
    alert("Please choose a week first.");
    return;
  }

  try {
    const q = query(collection(db, "schedules"), orderBy("scheduleDateTime", "asc"));
    const snapshot = await getDocs(q);

    let html = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.deleted === true) return;
      if (data.week !== selectedWeek) return;

      html += buildScheduleCard(data, true);
    });

    adminScheduleRecords.innerHTML =
      html || `<p class="info-box">No schedules found for this week.</p>`;
  } catch (error) {
    alert(error.message);
  }
}

async function loadMySchedule() {
  const user = auth.currentUser;

  if (!user) return;

  myScheduleRecords.innerHTML = "";

  const selectedWeek = myScheduleWeekPicker.value;

  if (!selectedWeek) {
    alert("Please choose a week first.");
    return;
  }

  try {
    const cleanEmail = user.email.toLowerCase().trim();
    const q = query(collection(db, "schedules"), orderBy("scheduleDateTime", "asc"));
    const snapshot = await getDocs(q);

    let html = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.deleted === true) return;
      if (!data.employeeEmail) return;
      if (data.employeeEmail.toLowerCase().trim() !== cleanEmail) return;
      if (data.week !== selectedWeek) return;

      html += buildScheduleCard(data, false);
    });

    myScheduleRecords.innerHTML =
      html || `<p class="info-box">No schedule posted for this week.</p>`;
  } catch (error) {
    alert(error.message);
  }
}

function buildScheduleCard(data, showEmployee) {
  return `
    <div class="schedule-card">
      <h3>${escapeHTML(formatDateDisplay(data.date))}</h3>
      ${showEmployee ? `<p><strong>Employee:</strong> ${escapeHTML(data.employeeName || data.employeeEmail)}</p>` : ""}
      ${showEmployee ? `<p><strong>Email:</strong> ${escapeHTML(data.employeeEmail)}</p>` : ""}
      <p><strong>Time:</strong> ${formatTimeFrom24Hour(data.startTime)} - ${formatTimeFrom24Hour(data.endTime)}</p>
      <p><strong>Job Site:</strong> ${escapeHTML(data.location || "Not listed")}</p>
      <p><strong>Work Notes:</strong> ${escapeHTML(data.notes || "No notes")}</p>
    </div>
  `;
}

async function loadWeeklyRecords() {
  records.innerHTML = "";

  const selectedWeek = weekPicker.value;

  if (!selectedWeek) {
    alert("Please choose a week first.");
    return;
  }

  try {
    const { startOfWeek, endOfWeek } = getWeekDateRange(selectedWeek);
    const weekDates = getWeekDates(startOfWeek);
    const employeeNamesByEmail = await getEmployeeNamesByEmail();

    const q = query(collection(db, "punches"), orderBy("time", "asc"));
    const snapshot = await getDocs(q);

    const grouped = {};

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.deleted === true) return;
      if (!data.time || !data.employeeEmail) return;

      const dateObj = data.time.toDate();

      if (dateObj < startOfWeek || dateObj >= endOfWeek) return;

      const cleanEmail = data.employeeEmail.toLowerCase().trim();

      const employeeName =
        employeeNamesByEmail[cleanEmail] ||
        data.employeeName ||
        cleanEmail;

      if (!grouped[cleanEmail]) {
        grouped[cleanEmail] = {
          name: employeeName,
          days: emptyWeek()
        };
      }

      addPunchToDay(grouped[cleanEmail].days, data, dateObj);
    });

    const employees = Object.values(grouped);

    if (employees.length === 0) {
      records.innerHTML = `<p class="no-records">No records found for this week.</p>`;
      return;
    }

    employees.forEach((employee) => {
      const totalMinutes = calculateWeeklyMinutes(employee.days);

      records.innerHTML += buildWeekTable(
        employee.name,
        employee.days,
        totalMinutes,
        weekDates
      );
    });
  } catch (error) {
    alert(error.message);
  }
}

async function loadMyHistory() {
  myHistoryRecords.innerHTML = "";

  const user = auth.currentUser;

  if (!user) return;

  const selectedWeek = myWeekPicker.value;

  if (!selectedWeek) {
    alert("Please choose a week first.");
    return;
  }

  try {
    const cleanEmail = user.email.toLowerCase().trim();
    const { startOfWeek, endOfWeek } = getWeekDateRange(selectedWeek);
    const weekDates = getWeekDates(startOfWeek);

    const q = query(collection(db, "punches"), orderBy("time", "asc"));
    const snapshot = await getDocs(q);

    const days = emptyWeek();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.deleted === true) return;
      if (!data.time || !data.employeeEmail) return;

      const punchEmail = data.employeeEmail.toLowerCase().trim();

      if (punchEmail !== cleanEmail) return;

      const dateObj = data.time.toDate();

      if (dateObj < startOfWeek || dateObj >= endOfWeek) return;

      addPunchToDay(days, data, dateObj);
    });

    const totalMinutes = calculateWeeklyMinutes(days);

    myHistoryRecords.innerHTML = `
      <table class="my-history-table">
        <tr>
          ${createHeaderCell("Sunday", weekDates[0])}
          ${createHeaderCell("Monday", weekDates[1])}
          ${createHeaderCell("Tuesday", weekDates[2])}
          ${createHeaderCell("Wednesday", weekDates[3])}
          ${createHeaderCell("Thursday", weekDates[4])}
          ${createHeaderCell("Friday", weekDates[5])}
          ${createHeaderCell("Saturday", weekDates[6])}
          <th>Total<br>Hours</th>
        </tr>

        <tr>
          ${createDayCell(days.Sunday)}
          ${createDayCell(days.Monday)}
          ${createDayCell(days.Tuesday)}
          ${createDayCell(days.Wednesday)}
          ${createDayCell(days.Thursday)}
          ${createDayCell(days.Friday)}
          ${createDayCell(days.Saturday)}
          <td class="total-hours">${formatMinutes(totalMinutes)}</td>
        </tr>
      </table>
    `;
  } catch (error) {
    alert(error.message);
  }
}

async function loadAdminPunchEditor() {
  adminPunchEditorRecords.innerHTML = "";

  const selectedWeek = adminEditWeekPicker.value;

  if (!selectedWeek) {
    alert("Please choose a week first.");
    return;
  }

  try {
    const { startOfWeek, endOfWeek } = getWeekDateRange(selectedWeek);
    const employeeNamesByEmail = await getEmployeeNamesByEmail();

    const q = query(collection(db, "punches"), orderBy("time", "asc"));
    const snapshot = await getDocs(q);

    let html = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.deleted === true) return;
      if (!data.time || !data.employeeEmail) return;

      const dateObj = data.time.toDate();

      if (dateObj < startOfWeek || dateObj >= endOfWeek) return;

      const cleanEmail = data.employeeEmail.toLowerCase().trim();

      const employeeName =
        employeeNamesByEmail[cleanEmail] ||
        data.employeeName ||
        cleanEmail;

      html += buildAdminPunchRow(docSnap.id, data, employeeName, dateObj);
    });

    adminPunchEditorRecords.innerHTML =
      html || `<p class="info-box">No punches found for this week.</p>`;
  } catch (error) {
    alert(error.message);
  }
}

function buildAdminPunchRow(punchId, data, employeeName, dateObj) {
  const dateValue = formatDateInputValue(dateObj);
  const timeValue = `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

  const displayTime = dateObj.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return `
    <div class="admin-punch-row">
      <p><strong>Employee:</strong> ${escapeHTML(employeeName)}</p>
      <p><strong>Email:</strong> ${escapeHTML(data.employeeEmail)}</p>
      <p><strong>Punch:</strong> ${escapeHTML(data.type)}</p>
      <p><strong>Time:</strong> ${escapeHTML(displayTime)}</p>

      <div class="admin-punch-actions">
        <button
          class="edit-small-btn admin-edit-punch-btn"
          data-id="${escapeHTML(punchId)}"
          data-date="${escapeHTML(dateValue)}"
          data-time="${escapeHTML(timeValue)}"
          data-type="${escapeHTML(data.type)}"
        >
          Edit
        </button>

        <button
          class="danger-btn admin-delete-punch-btn"
          data-id="${escapeHTML(punchId)}"
        >
          Delete
        </button>
      </div>
    </div>
  `;
}

function openEditPunchModal(button) {
  editingPunchId.value = button.dataset.id;
  adminEditPunchDate.value = button.dataset.date;
  adminEditPunchTime.value = button.dataset.time;
  adminEditPunchType.value = button.dataset.type;

  editPunchModal.classList.remove("hidden");
}

async function saveEditedPunch() {
  const adminUser = auth.currentUser;

  if (!adminUser) return;

  const punchId = editingPunchId.value;
  const dateValue = adminEditPunchDate.value;
  const timeValue = adminEditPunchTime.value;
  const typeValue = adminEditPunchType.value;

  if (!punchId || !dateValue || !timeValue || !typeValue) {
    alert("Please enter date, time, and punch type.");
    return;
  }

  const newDateTime = new Date(`${dateValue}T${timeValue}`);

  if (Number.isNaN(newDateTime.getTime())) {
    alert("Please enter a valid date and time.");
    return;
  }

  const confirmEdit = confirm("Save changes to this employee punch?");

  if (!confirmEdit) return;

  try {
    const punchRef = doc(db, "punches", punchId);

    await updateDoc(punchRef, {
      type: typeValue,
      time: newDateTime,
      source: "Admin Modified Punch",
      editedBy: adminUser.email.toLowerCase().trim(),
      editedAt: serverTimestamp()
    });

    alert("Punch updated.");

    editPunchModal.classList.add("hidden");

    await loadAdminPunchEditor();

    if (weekPicker.value) {
      await loadWeeklyRecords();
    }

    if (myWeekPicker.value) {
      await loadMyHistory();
    }
  } catch (error) {
    alert(error.message);
  }
}

async function softDeletePunch(punchId) {
  const adminUser = auth.currentUser;

  if (!adminUser) return;

  const confirmDelete = confirm(
    "Are you sure you want to delete this punch? It will disappear from records, but it will still be saved in Firebase as deleted."
  );

  if (!confirmDelete) return;

  try {
    const punchRef = doc(db, "punches", punchId);

    await updateDoc(punchRef, {
      deleted: true,
      deletedBy: adminUser.email.toLowerCase().trim(),
      deletedAt: serverTimestamp()
    });

    alert("Punch deleted.");

    await loadAdminPunchEditor();

    if (weekPicker.value) {
      await loadWeeklyRecords();
    }

    if (myWeekPicker.value) {
      await loadMyHistory();
    }
  } catch (error) {
    alert(error.message);
  }
}

async function submitTimeEditRequest() {
  const user = auth.currentUser;

  if (!user) return;

  const dateValue = editDate.value;
  const timeValue = editTime.value;
  const typeValue = editType.value;
  const reasonValue = editReason.value.trim();

  if (!dateValue || !timeValue || !typeValue || !reasonValue) {
    alert("Please enter the date, time, punch type, and reason.");
    return;
  }

  const requestedDateTime = new Date(`${dateValue}T${timeValue}`);

  if (Number.isNaN(requestedDateTime.getTime())) {
    alert("Please enter a valid date and time.");
    return;
  }

  try {
    const cleanEmail = user.email.toLowerCase().trim();

    if (!currentUserName) {
      currentUserName = await getEmployeeName(user.uid, cleanEmail);
    }

    await addDoc(collection(db, "timeEditRequests"), {
      employeeId: user.uid,
      employeeName: currentUserName || cleanEmail,
      employeeEmail: cleanEmail,
      requestedType: typeValue,
      requestedDate: dateValue,
      requestedTime: timeValue,
      requestedDateTime: requestedDateTime,
      reason: reasonValue,
      status: "Pending",
      requestedAt: serverTimestamp()
    });

    editReason.value = "";
    alert("Time edit request submitted for admin approval.");

    await loadMyTimeEditRequests();
  } catch (error) {
    alert(error.message);
  }
}

async function loadMyTimeEditRequests() {
  const user = auth.currentUser;

  if (!user) return;

  try {
    const cleanEmail = user.email.toLowerCase().trim();
    const q = query(collection(db, "timeEditRequests"), orderBy("requestedAt", "desc"));
    const snapshot = await getDocs(q);

    let html = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (!data.employeeEmail) return;

      if (data.employeeEmail.toLowerCase().trim() !== cleanEmail) return;

      html += buildMyRequestCard(data);
    });

    myTimeEditRequests.innerHTML = html || `<p class="info-box">No time edit requests found.</p>`;
  } catch (error) {
    myTimeEditRequests.innerHTML = `<p class="info-box">Unable to load time edit requests.</p>`;
  }
}

async function loadPendingTimeEditRequests() {
  try {
    const q = query(collection(db, "timeEditRequests"), orderBy("requestedAt", "desc"));
    const snapshot = await getDocs(q);

    let html = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.status !== "Pending") return;

      html += buildAdminRequestCard(docSnap.id, data);
    });

    timeEditRequests.innerHTML = html || `<p class="info-box">No pending time edit requests.</p>`;
  } catch (error) {
    alert(error.message);
  }
}

async function loadWeeklySignatures() {
  weeklySignatures.innerHTML = "";

  const selectedWeek = weekPicker.value;

  if (!selectedWeek) {
    alert("Please choose a week first.");
    return;
  }

  try {
    const q = query(collection(db, "weeklySignatures"), orderBy("signedAt", "desc"));
    const snapshot = await getDocs(q);

    let html = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.week !== selectedWeek) return;

      let signedAtText = "Signed";

      if (data.signedAt && data.signedAt.toDate) {
        signedAtText = data.signedAt.toDate().toLocaleString([], {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }

      html += `
        <div class="request-card">
          <h3>${escapeHTML(data.employeeName || data.employeeEmail)}</h3>
          <p><strong>Email:</strong> ${escapeHTML(data.employeeEmail)}</p>
          <p><strong>Week:</strong> ${escapeHTML(data.week)}</p>
          <p><strong>Signature:</strong> ${escapeHTML(data.signature)}</p>
          <p><strong>Signed At:</strong> ${escapeHTML(signedAtText)}</p>
          <span class="status-pill status-approved">Signed</span>
        </div>
      `;
    });

    weeklySignatures.innerHTML = html || `<p class="info-box">No signatures found for this week.</p>`;
  } catch (error) {
    alert(error.message);
  }
}

async function approveTimeEditRequest(requestId) {
  const adminUser = auth.currentUser;

  if (!adminUser) return;

  const confirmApprove = confirm("Approve this time edit request and add it to the employee punch records?");

  if (!confirmApprove) return;

  try {
    const requestRef = doc(db, "timeEditRequests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      alert("Request not found.");
      return;
    }

    const requestData = requestSnap.data();

    if (requestData.status !== "Pending") {
      alert("This request has already been handled.");
      return;
    }

    const approvedDateTime = requestData.requestedDateTime.toDate
      ? requestData.requestedDateTime.toDate()
      : new Date(requestData.requestedDateTime);

    await addDoc(collection(db, "punches"), {
      employeeId: requestData.employeeId,
      employeeName: requestData.employeeName,
      employeeEmail: requestData.employeeEmail,
      type: requestData.requestedType,
      time: approvedDateTime,
      source: "Admin Approved Time Edit",
      timeEditRequestId: requestId,
      approvedBy: adminUser.email.toLowerCase().trim(),
      approvedAt: serverTimestamp(),
      deleted: false
    });

    await updateDoc(requestRef, {
      status: "Approved",
      reviewedBy: adminUser.email.toLowerCase().trim(),
      reviewedAt: serverTimestamp()
    });

    alert("Time edit approved and added to punch records.");

    await loadPendingTimeEditRequests();
    await loadWeeklyRecords();
  } catch (error) {
    alert(error.message);
  }
}

async function rejectTimeEditRequest(requestId) {
  const adminUser = auth.currentUser;

  if (!adminUser) return;

  const confirmReject = confirm("Reject this time edit request?");

  if (!confirmReject) return;

  try {
    const requestRef = doc(db, "timeEditRequests", requestId);

    await updateDoc(requestRef, {
      status: "Rejected",
      reviewedBy: adminUser.email.toLowerCase().trim(),
      reviewedAt: serverTimestamp()
    });

    alert("Time edit request rejected.");

    await loadPendingTimeEditRequests();
  } catch (error) {
    alert(error.message);
  }
}

async function submitWeeklySignature() {
  const user = auth.currentUser;

  if (!user) return;

  const typedSignature = signatureInput.value.trim();

  if (!typedSignature) {
    alert("Please type your full name before submitting.");
    return;
  }

  const cleanEmail = user.email.toLowerCase().trim();
  const currentWeek = getCurrentWeekValue();
  const signatureId = `${user.uid}_${currentWeek}`;

  if (!currentUserName) {
    currentUserName = await getEmployeeName(user.uid, cleanEmail);
  }

  try {
    await setDoc(doc(db, "weeklySignatures", signatureId), {
      employeeId: user.uid,
      employeeName: currentUserName || cleanEmail,
      employeeEmail: cleanEmail,
      week: currentWeek,
      signature: typedSignature,
      signedAt: serverTimestamp()
    });

    signatureInput.value = "";
    await checkWeeklySignature();

    alert("Weekly e-signature submitted.");
  } catch (error) {
    alert(error.message);
  }
}

async function checkWeeklySignature() {
  const user = auth.currentUser;

  if (!user) return;

  const currentWeek = getCurrentWeekValue();
  const signatureId = `${user.uid}_${currentWeek}`;

  try {
    const signatureDoc = await getDoc(doc(db, "weeklySignatures", signatureId));

    if (signatureDoc.exists()) {
      const data = signatureDoc.data();

      signatureStatus.className = "info-box signature-complete";
      signatureStatus.innerHTML = `
        Signed for this week.<br>
        <strong>Signature:</strong> ${escapeHTML(data.signature)}
      `;

      signatureInput.disabled = true;
      submitSignatureBtn.disabled = true;
      submitSignatureBtn.textContent = "Signature Complete";
    } else {
      signatureStatus.className = "info-box signature-needed";
      signatureStatus.textContent = "You have not signed for this week yet.";

      signatureInput.disabled = false;
      submitSignatureBtn.disabled = false;
      submitSignatureBtn.textContent = "Submit Weekly Signature";
    }
  } catch (error) {
    signatureStatus.className = "info-box";
    signatureStatus.textContent = "Unable to check signature status.";
  }
}

function buildMyRequestCard(data) {
  const statusClass = getStatusClass(data.status);

  return `
    <div class="request-card">
      <h3>${escapeHTML(data.requestedType)}</h3>
      <p><strong>Date:</strong> ${escapeHTML(data.requestedDate)}</p>
      <p><strong>Time:</strong> ${formatTimeFrom24Hour(data.requestedTime)}</p>
      <p><strong>Reason:</strong> ${escapeHTML(data.reason)}</p>
      <span class="status-pill ${statusClass}">${escapeHTML(data.status)}</span>
    </div>
  `;
}

function buildAdminRequestCard(requestId, data) {
  return `
    <div class="request-card">
      <h3>${escapeHTML(data.employeeName || data.employeeEmail)}</h3>
      <p><strong>Email:</strong> ${escapeHTML(data.employeeEmail)}</p>
      <p><strong>Requested Punch:</strong> ${escapeHTML(data.requestedType)}</p>
      <p><strong>Date:</strong> ${escapeHTML(data.requestedDate)}</p>
      <p><strong>Time:</strong> ${formatTimeFrom24Hour(data.requestedTime)}</p>
      <p><strong>Reason:</strong> ${escapeHTML(data.reason)}</p>
      <span class="status-pill status-pending">Pending</span>

      <div class="request-actions">
        <button class="approve-btn approve-request-btn" data-id="${requestId}">Approve</button>
        <button class="danger-btn reject-request-btn" data-id="${requestId}">Reject</button>
      </div>
    </div>
  `;
}

function togglePassword(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "Hide";
  } else {
    input.type = "password";
    button.textContent = "Show";
  }
}

async function saveEmployeeName(uid, email, name, isNewAccount) {
  const cleanEmail = email.toLowerCase().trim();

  const employeeData = {
    name: name,
    email: cleanEmail,
    updatedAt: serverTimestamp()
  };

  if (isNewAccount) {
    employeeData.createdAt = serverTimestamp();
  }

  await setDoc(doc(db, "employees", uid), employeeData, { merge: true });

  await setDoc(doc(db, "employeeNames", cleanEmail), {
    name: name,
    email: cleanEmail,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

async function savePunch(type) {
  const user = auth.currentUser;

  if (!user) return;

  const cleanEmail = user.email.toLowerCase().trim();

  if (!currentUserName) {
    currentUserName = await getEmployeeName(user.uid, cleanEmail);
  }

  await addDoc(collection(db, "punches"), {
    employeeId: user.uid,
    employeeName: currentUserName || cleanEmail,
    employeeEmail: cleanEmail,
    type: type,
    time: serverTimestamp(),
    source: "Employee Clock Button",
    deleted: false
  });

  alert(`${type} saved!`);
}

async function getEmployeeName(uid, email) {
  const cleanEmail = email.toLowerCase().trim();

  const employeeDoc = await getDoc(doc(db, "employees", uid));

  if (employeeDoc.exists() && employeeDoc.data().name) {
    return employeeDoc.data().name;
  }

  const employeeNameDoc = await getDoc(doc(db, "employeeNames", cleanEmail));

  if (employeeNameDoc.exists() && employeeNameDoc.data().name) {
    return employeeNameDoc.data().name;
  }

  return "";
}

async function getEmployeeNamesByEmail() {
  const namesSnapshot = await getDocs(collection(db, "employeeNames"));
  const employeeNamesByEmail = {};

  namesSnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (data.email && data.name) {
      employeeNamesByEmail[data.email.toLowerCase().trim()] = data.name;
    }
  });

  return employeeNamesByEmail;
}

function emptyWeek() {
  return {
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
  };
}

function addPunchToDay(days, data, dateObj) {
  const dayName = dateObj.toLocaleDateString("en-US", {
    weekday: "long"
  });

  const timeText = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  const sourceText =
    data.source === "Admin Approved Time Edit" ||
    data.source === "Admin Modified Punch"
      ? "<br><small>Admin Edit</small>"
      : "";

  days[dayName].push({
    type: data.type,
    time: dateObj,
    display: `${timeText}<br>${escapeHTML(data.type)}${sourceText}`
  });
}

function buildWeekTable(employeeName, days, totalMinutes, weekDates) {
  return `
    <div class="employee-card">
      <h3>${escapeHTML(employeeName)}</h3>

      <table class="week-table">
        <tr>
          ${createHeaderCell("Sunday", weekDates[0])}
          ${createHeaderCell("Monday", weekDates[1])}
          ${createHeaderCell("Tuesday", weekDates[2])}
          ${createHeaderCell("Wednesday", weekDates[3])}
          ${createHeaderCell("Thursday", weekDates[4])}
          ${createHeaderCell("Friday", weekDates[5])}
          ${createHeaderCell("Saturday", weekDates[6])}
          <th>Total<br>Hours</th>
        </tr>

        <tr>
          ${createDayCell(days.Sunday)}
          ${createDayCell(days.Monday)}
          ${createDayCell(days.Tuesday)}
          ${createDayCell(days.Wednesday)}
          ${createDayCell(days.Thursday)}
          ${createDayCell(days.Friday)}
          ${createDayCell(days.Saturday)}
          <td class="total-hours">${formatMinutes(totalMinutes)}</td>
        </tr>
      </table>
    </div>
  `;
}

function createHeaderCell(dayName, dateText = "") {
  return `
    <th>
      <div>${dayName.slice(0, 3)}</div>
      <small>${dateText}</small>
    </th>
  `;
}

function createDayCell(punches) {
  const punchText = punches.length
    ? punches.map((punch) => punch.display).join("<br><br>")
    : "—";

  const dailyMinutes = calculateDailyMinutes(punches);

  return `
    <td>
      ${punchText}
      <div class="day-total">${formatMinutes(dailyMinutes)}</div>
    </td>
  `;
}

function calculateDailyMinutes(punches) {
  let totalMinutes = 0;
  let workStartTime = null;
  let lunchStartTime = null;

  const sortedPunches = [...punches].sort((a, b) => a.time - b.time);

  sortedPunches.forEach((punch) => {
    if (punch.type === "Clock In") {
      workStartTime = punch.time;
      lunchStartTime = null;
    }

    if (punch.type === "Start Lunch" && workStartTime) {
      totalMinutes += Math.round((punch.time - workStartTime) / 60000);
      workStartTime = null;
      lunchStartTime = punch.time;
    }

    if (punch.type === "End Lunch" && lunchStartTime) {
      workStartTime = punch.time;
      lunchStartTime = null;
    }

    if (punch.type === "Clock Out" && workStartTime) {
      totalMinutes += Math.round((punch.time - workStartTime) / 60000);
      workStartTime = null;
      lunchStartTime = null;
    }
  });

  return totalMinutes;
}

function calculateWeeklyMinutes(days) {
  let total = 0;

  Object.values(days).forEach((punches) => {
    total += calculateDailyMinutes(punches);
  });

  return total;
}

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours}h ${mins}m`;
}

function getWeekDateRange(weekValue) {
  const [yearText, weekText] = weekValue.split("-W");
  const year = Number(yearText);
  const week = Number(weekText);

  const janFirst = new Date(year, 0, 1);
  janFirst.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(janFirst);
  startOfWeek.setDate(janFirst.getDate() + (week - 1) * 7);

  while (startOfWeek.getDay() !== 0) {
    startOfWeek.setDate(startOfWeek.getDate() - 1);
  }

  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return { startOfWeek, endOfWeek };
}

function getWeekDates(startOfWeek) {
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);

    dates.push(formatDateShort(currentDate));
  }

  return dates;
}

function getCurrentWeekValue() {
  return getWeekValueFromDate(new Date());
}

function getWeekValueFromDate(dateObj) {
  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);

  const currentSunday = new Date(dateObj);
  currentSunday.setHours(0, 0, 0, 0);

  while (currentSunday.getDay() !== 0) {
    currentSunday.setDate(currentSunday.getDate() - 1);
  }

  const firstSunday = new Date(startOfYear);

  while (firstSunday.getDay() !== 0) {
    firstSunday.setDate(firstSunday.getDate() - 1);
  }

  const weekNumber =
    Math.floor((currentSunday - firstSunday) / 604800000) + 1;

  return `${dateObj.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function setCurrentWeek() {
  const currentWeek = getCurrentWeekValue();

  if (weekPicker) weekPicker.value = currentWeek;
  if (myWeekPicker) myWeekPicker.value = currentWeek;
  if (adminEditWeekPicker) adminEditWeekPicker.value = currentWeek;
  if (myScheduleWeekPicker) myScheduleWeekPicker.value = currentWeek;
  if (adminScheduleWeekPicker) adminScheduleWeekPicker.value = currentWeek;
  if (adminScheduleBuilderWeekPicker) adminScheduleBuilderWeekPicker.value = currentWeek;
}

function setTodayDate() {
  const today = new Date();

  if (editDate) editDate.value = formatDateInputValue(today);
  if (scheduleDate) scheduleDate.value = formatDateInputValue(today);
}

function formatDateInputValue(dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

function formatDateShort(dateObj) {
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const yy = String(dateObj.getFullYear()).slice(-2);

  return `${mm}-${dd}-${yy}`;
}

function formatDateDisplay(dateValue) {
  if (!dateValue) return "Scheduled Day";

  const dateObj = new Date(`${dateValue}T00:00`);

  return dateObj.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTimeFrom24Hour(timeValue) {
  if (!timeValue) return "";

  const [hoursText, minutesText] = timeValue.split(":");
  const date = new Date();

  date.setHours(Number(hoursText), Number(minutesText), 0, 0);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getStatusClass(status) {
  if (status === "Approved") return "status-approved";
  if (status === "Rejected") return "status-rejected";
  return "status-pending";
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function moveScheduleAndHistoryForUser(isAdmin) {
  if (isAdmin) {
    employeeLeftColumn.appendChild(myScheduleBox);
    employeeLeftColumn.appendChild(myHistoryBox);
  } else {
    employeeRightPanel.appendChild(myScheduleBox);
    employeeRightPanel.appendChild(myHistoryBox);
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    authBox.classList.add("hidden");
    signupBox.classList.add("hidden");

    employeeLeftColumn.classList.remove("hidden");
    settingsIconBtn.classList.remove("hidden");

    clockBox.classList.remove("hidden");
    myScheduleBox.classList.remove("hidden");
    myHistoryBox.classList.remove("hidden");
    timeEditBox.classList.remove("hidden");
    signatureBox.classList.remove("hidden");

    const cleanEmail = user.email.toLowerCase().trim();

    currentUserName = await getEmployeeName(user.uid, cleanEmail);
    settingsName.value = currentUserName;

    if (currentUserName) {
      welcomeText.innerHTML = `Welcome, <span>${escapeHTML(currentUserName)}</span>`;
    } else {
      welcomeText.innerHTML = `Welcome, <span>Add your name in settings</span>`;
    }

    const cleanAdminEmails = adminEmails.map((email) =>
      email.toLowerCase().trim()
    );

    const isCurrentUserAdmin = cleanAdminEmails.includes(cleanEmail);

    if (isCurrentUserAdmin) {
      appLayout.classList.remove("employee-only");

      moveScheduleAndHistoryForUser(true);

      employeeRightPanel.classList.add("hidden");
      adminBox.classList.remove("hidden");
      signatureAdminBox.classList.remove("hidden");
      adminPunchEditorBtn.classList.remove("hidden");

      await loadPendingTimeEditRequests();
      await loadWeeklySignatures();
      await loadAdminSchedules();
    } else {
      appLayout.classList.add("employee-only");

      moveScheduleAndHistoryForUser(false);

      employeeRightPanel.classList.remove("hidden");
      adminBox.classList.add("hidden");
      signatureAdminBox.classList.add("hidden");
      adminPunchEditorBtn.classList.add("hidden");
    }

    await checkWeeklySignature();
    await loadMySchedule();
    await loadMyHistory();
    await loadMyTimeEditRequests();
  } else {
    authBox.classList.remove("hidden");
    signupBox.classList.add("hidden");

    employeeLeftColumn.classList.add("hidden");
    employeeRightPanel.classList.add("hidden");

    clockBox.classList.add("hidden");
    myScheduleBox.classList.add("hidden");
    myHistoryBox.classList.add("hidden");
    timeEditBox.classList.add("hidden");
    signatureBox.classList.add("hidden");
    signatureAdminBox.classList.add("hidden");
    adminBox.classList.add("hidden");

    settingsIconBtn.classList.add("hidden");
    settingsModal.classList.add("hidden");
    adminPunchEditorBtn.classList.add("hidden");
    adminPunchModal.classList.add("hidden");
    editPunchModal.classList.add("hidden");

    appLayout.classList.add("employee-only");

    currentUserName = "";
  }
});