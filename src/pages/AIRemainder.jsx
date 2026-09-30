import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

function AIReminder() {
  // =====================================================
  // USER
  // =====================================================

  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = savedUser?.id || savedUser?._id;

  // =====================================================
  // STATES
  // =====================================================

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  // Form
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("Once Daily");
  const [startDate, setStartDate] = useState(() =>
    getLocalDate()
  );
  const [notes, setNotes] = useState("");

  // Language
  const [language, setLanguage] = useState("en-US");

  // Editing
  const [editingId, setEditingId] = useState(null);

  // Prevent duplicate speech
  const spokenReminders = useRef(new Set());

  // =====================================================
  // LOCAL DATE
  // =====================================================

  function getLocalDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // =====================================================
  // LOCAL TIME
  // =====================================================

  function getLocalTime() {
    const date = new Date();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  // =====================================================
  // LANGUAGE NAMES
  // =====================================================

  const languageNames = {
    "en-US": "English",
    "te-IN": "Telugu",
    "hi-IN": "Hindi",
    "ta-IN": "Tamil",
    "kn-IN": "Kannada",
    "ml-IN": "Malayalam",
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    const parts = String(timeStr).split(":");

    if (parts.length < 2) {
      return timeStr;
    }

    let hour = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (Number.isNaN(hour)) {
      return timeStr;
    }

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${String(hour).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // =====================================================
  // GET SPEECH VOICE
  // =====================================================

  const getVoice = useCallback((languageCode) => {
    if (!("speechSynthesis" in window)) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();

    if (!voices || voices.length === 0) {
      return null;
    }

    // Exact language match
    let voice = voices.find(
      (v) =>
        v.lang &&
        v.lang.toLowerCase() === languageCode.toLowerCase()
    );

    if (voice) {
      return voice;
    }

    // Same language match
    const shortLanguage = languageCode
      .split("-")[0]
      .toLowerCase();

    voice = voices.find(
      (v) =>
        v.lang &&
        v.lang.toLowerCase().startsWith(shortLanguage)
    );

    return voice || null;
  }, []);

  // =====================================================
  // SPEAK REMINDER
  // =====================================================

  const speakReminder = useCallback(
    (reminder) => {
      if (!("speechSynthesis" in window)) {
        console.error("Speech synthesis is not supported.");

        setMessage({
          text: "Your browser does not support voice reminders.",
          type: "danger",
        });

        return;
      }

      const reminderLanguage =
        reminder.language || "en-US";

      const timeText = formatTime(reminder.time);

      let messageText = "";

      // English
      if (reminderLanguage === "en-US") {
        messageText =
          `It's ${timeText}. ` +
          `It's time to take your ${reminder.medicineName}. ` +
          `Your dosage is ${reminder.dosage}.`;
      }

      // Telugu
      else if (reminderLanguage === "te-IN") {
        messageText =
          `ఇది ${timeText}. ` +
          `${reminder.medicineName} మందు తీసుకునే సమయం. ` +
          `మోతాదు ${reminder.dosage}.`;
      }

      // Hindi
      else if (reminderLanguage === "hi-IN") {
        messageText =
          `यह ${timeText} है। ` +
          `${reminder.medicineName} दवा लेने का समय है। ` +
          `खुराक ${reminder.dosage} है।`;
      }

      // Tamil
      else if (reminderLanguage === "ta-IN") {
        messageText =
          `இது ${timeText}. ` +
          `${reminder.medicineName} மருந்தை எடுத்துக்கொள்ள வேண்டிய நேரம். ` +
          `அளவு ${reminder.dosage}.`;
      }

      // Kannada
      else if (reminderLanguage === "kn-IN") {
        messageText =
          `ಇದು ${timeText}. ` +
          `${reminder.medicineName} ಔಷಧಿಯನ್ನು ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯ. ` +
          `ಪ್ರಮಾಣ ${reminder.dosage}.`;
      }

      // Malayalam
      else if (reminderLanguage === "ml-IN") {
        messageText =
          `ഇത് ${timeText}. ` +
          `${reminder.medicineName} മരുന്ന് കഴിക്കേണ്ട സമയമാണ്. ` +
          `ഡോസ് ${reminder.dosage}.`;
      }

      // Fallback
      else {
        messageText =
          `It's ${timeText}. ` +
          `It's time to take your ${reminder.medicineName}. ` +
          `Your dosage is ${reminder.dosage}.`;
      }

      console.log("================================");
      console.log("VOICE REMINDER");
      console.log("Medicine:", reminder.medicineName);
      console.log("Dosage:", reminder.dosage);
      console.log("Time:", timeText);
      console.log("Language:", reminderLanguage);
      console.log("Text:", messageText);
      console.log("================================");

      window.speechSynthesis.cancel();

      const speak = () => {
        const selectedVoice =
          getVoice(reminderLanguage);

        const utterance =
          new SpeechSynthesisUtterance(messageText);

        utterance.lang = reminderLanguage;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        if (selectedVoice) {
          utterance.voice = selectedVoice;

          console.log(
            "Using voice:",
            selectedVoice.name,
            selectedVoice.lang
          );
        } else {
          console.warn(
            `No voice installed for ${reminderLanguage}`
          );
        }

        utterance.onstart = () => {
          console.log("SPEECH STARTED");
        };

        utterance.onend = () => {
          console.log("SPEECH FINISHED");
        };

        utterance.onerror = (event) => {
          console.error("SPEECH ERROR:", event.error);
        };

        window.speechSynthesis.speak(utterance);
      };

      const voices =
        window.speechSynthesis.getVoices();

      if (voices.length > 0) {
        speak();
      } else {
        setTimeout(() => {
          speak();
        }, 500);
      }
    },
    [getVoice]
  );

  // =====================================================
  // LOAD BROWSER VOICES
  // =====================================================

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis unavailable.");
      return;
    }

    window.speechSynthesis.getVoices();

    const handleVoicesChanged = () => {
      const voices =
        window.speechSynthesis.getVoices();

      console.log(
        "Available speech voices:",
        voices.map(
          (voice) =>
            `${voice.name} (${voice.lang})`
        )
      );
    };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
    };
  }, []);

  // =====================================================
  // FETCH USER REMINDERS
  // =====================================================

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);

      if (!userId) {
        throw new Error("User not logged in.");
      }

      const res = await fetch(
        `${API_URL}/api/reminders?userId=${userId}`
      );

      if (!res.ok) {
        throw new Error("Failed to load reminders.");
      }

      const data = await res.json();

      console.log("User reminders loaded:", data);

      setReminders(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Error loading reminders:",
        err
      );

      setMessage({
        text:
          err.message ||
          "Unable to connect to reminder service.",
        type: "danger",
      });

    } finally {
      setLoading(false);
    }
  }, [userId]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // =====================================================
  // REAL-TIME REMINDER CHECKER
  // =====================================================

  useEffect(() => {
    if (!reminders || reminders.length === 0) {
      console.log("No reminders available.");
      return;
    }

    console.log("================================");
    console.log("AI REMINDER CHECKER STARTED");
    console.log("Number of reminders:", reminders.length);
    console.log("================================");

    const checkReminderTime = () => {
      const now = new Date();

      const currentDate =
        `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(
          now.getDate()
        ).padStart(2, "0")}`;

      const currentTime =
        `${String(
          now.getHours()
        ).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;

      reminders.forEach((reminder) => {

        const reminderTime = reminder.time
          ? String(reminder.time).slice(0, 5)
          : "";

        let reminderStartDate = currentDate;

        if (reminder.startDate) {
          const d = new Date(reminder.startDate);

          if (!Number.isNaN(d.getTime())) {
            reminderStartDate =
              `${d.getFullYear()}-${String(
                d.getMonth() + 1
              ).padStart(2, "0")}-${String(
                d.getDate()
              ).padStart(2, "0")}`;
          }
        }

        // Status check
        if (
          reminder.status &&
          String(reminder.status).toLowerCase() !==
            "active"
        ) {
          return;
        }

        // Time check
        if (!reminderTime) {
          return;
        }

        // Start date check
        if (currentDate < reminderStartDate) {
          return;
        }

        // Selected time check
        if (reminderTime !== currentTime) {
          return;
        }

        // Unique key
        const reminderKey =
          `${reminder._id}_${currentDate}_${currentTime}`;

        // Prevent duplicate speech
        if (
          spokenReminders.current.has(
            reminderKey
          )
        ) {
          return;
        }

        spokenReminders.current.add(
          reminderKey
        );

        console.log("================================");
        console.log("REMINDER TRIGGERED");
        console.log("Medicine:", reminder.medicineName);
        console.log("Dosage:", reminder.dosage);
        console.log("Time:", reminderTime);
        console.log("Language:", reminder.language);
        console.log("================================");

        speakReminder(reminder);

        setMessage({
          text:
            `🔊 Voice reminder: Time to take ${reminder.medicineName}.`,
          type: "success",
        });
      });
    };

    // Check immediately
    checkReminderTime();

    // Check every second
    const intervalId = setInterval(() => {
      checkReminderTime();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [reminders, speakReminder]);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setMedicineName("");
    setDosage("");
    setTime("");
    setFrequency("Once Daily");
    setStartDate(getLocalDate());
    setNotes("");
    setLanguage("en-US");
    setEditingId(null);
  };

  // =====================================================
  // SUBMIT REMINDER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage({
        text: "Please login first.",
        type: "danger",
      });

      return;
    }

    if (
      !medicineName.trim() ||
      !dosage.trim() ||
      !time ||
      !frequency ||
      !startDate
    ) {
      setMessage({
        text: "Please fill in all required fields.",
        type: "danger",
      });

      return;
    }

    try {
      setSubmitting(true);

      setMessage({
        text: "",
        type: "",
      });

      const payload = {
        userId,
        medicineName: medicineName.trim(),
        dosage: dosage.trim(),
        time,
        frequency,
        startDate,
        notes: notes.trim(),
        language,
      };

      let res;

      // UPDATE
      if (editingId) {
        res = await fetch(
          `${API_URL}/api/reminders/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      // CREATE
      else {
        res = await fetch(
          `${API_URL}/api/reminders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Operation failed."
        );
      }

      setMessage({
        text: editingId
          ? "Reminder updated successfully!"
          : "AI Medicine Reminder set successfully!",
        type: "success",
      });

      resetForm();

      await fetchReminders();

    } catch (err) {
      console.error(
        "Error saving reminder:",
        err
      );

      setMessage({
        text:
          err.message ||
          "Unable to connect to server.",
        type: "danger",
      });

    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // FORMAT DATE FOR INPUT
  // =====================================================

  const formatDateForInput = (dateValue) => {
    if (!dateValue) {
      return getLocalDate();
    }

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        String(dateValue)
      )
    ) {
      return String(dateValue);
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return getLocalDate();
    }

    const year = date.getFullYear();

    const month =
      String(date.getMonth() + 1).padStart(
        2,
        "0"
      );

    const day =
      String(date.getDate()).padStart(
        2,
        "0"
      );

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // EDIT REMINDER
  // =====================================================

  const handleStartEdit = (reminder) => {
    setEditingId(reminder._id);

    setMedicineName(
      reminder.medicineName || ""
    );

    setDosage(
      reminder.dosage || ""
    );

    setTime(
      reminder.time || ""
    );

    setFrequency(
      reminder.frequency || "Once Daily"
    );

    setLanguage(
      reminder.language || "en-US"
    );

    setStartDate(
      reminder.startDate
        ? formatDateForInput(
            reminder.startDate
          )
        : getLocalDate()
    );

    setNotes(
      reminder.notes || ""
    );

    setMessage({
      text:
        `Editing reminder for ${reminder.medicineName}`,
      type: "info",
    });

    window.scrollTo({
      top: 120,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE REMINDER
  // =====================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this reminder?"
      )
    ) {
      return;
    }

    if (!userId) {
      setMessage({
        text: "Please login first.",
        type: "danger",
      });

      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/reminders/${id}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to delete reminder."
        );
      }

      setMessage({
        text: "Reminder deleted successfully.",
        type: "success",
      });

      setReminders((prev) =>
        prev.filter(
          (reminder) =>
            reminder._id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }

    } catch (err) {
      console.error(
        "Error deleting reminder:",
        err
      );

      setMessage({
        text:
          err.message ||
          "Unable to connect to server.",
        type: "danger",
      });
    }
  };

  // =====================================================
  // TEST VOICE
  // =====================================================

  const handleTestVoice = () => {
    const testReminder = {
      medicineName:
        medicineName || "Paracetamol",

      dosage:
        dosage || "1 tablet",

      time:
        time || getLocalTime(),

      language:
        language || "en-US",
    };

    speakReminder(testReminder);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg">
        <div className="container">

          <Link
            className="navbar-brand"
            to="/dashboard"
          >
            💊 Online Pharmacy
          </Link>

          <div className="ms-auto d-flex align-items-center">

            <Link
              to="/dashboard"
              className="nav-link me-3"
            >
              Dashboard
            </Link>

            <Link
              to="/medicines"
              className="btn btn-custom"
            >
              Medicines
            </Link>

          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <section className="py-5">

        <div className="container">

          {/* HEADER */}

          <div className="text-center mb-5">

            <div className="register-icon">
              🎤
            </div>

            <h1>
              AI Medicine Reminder
            </h1>

            <p className="text-muted">
              Set smart reminders and never
              miss your medicine schedule.
            </p>

          </div>

          {/* MESSAGE */}

          {message.text && (
            <div className="row justify-content-center mb-4">

              <div className="col-lg-6 col-md-8">

                <div
                  className={`alert alert-${message.type} alert-dismissible fade show d-flex justify-content-between align-items-center`}
                  role="alert"
                >

                  <div>

                    {message.type === "success"
                      ? "✅ "
                      : message.type === "danger"
                      ? "❌ "
                      : "ℹ️ "}

                    {message.text}

                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setMessage({
                        text: "",
                        type: "",
                      })
                    }
                    aria-label="Close"
                  />

                </div>

              </div>

            </div>
          )}

          {/* FORM */}

          <div className="row justify-content-center">

            <div className="col-lg-6 col-md-8">

              <div className="card shadow-sm p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <h3 className="mb-0">

                    {editingId
                      ? "✏️ Edit Reminder"
                      : "🔔 Set Your Reminder"}

                  </h3>

                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={resetForm}
                    >
                      Cancel Edit
                    </button>
                  )}

                </div>

                <form onSubmit={handleSubmit}>

                  {/* MEDICINE */}

                  <div className="mb-3">

                    <label className="form-label">
                      Medicine Name{" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter medicine name"
                      value={medicineName}
                      onChange={(e) =>
                        setMedicineName(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* DOSAGE */}

                  <div className="mb-3">

                    <label className="form-label">
                      Dosage{" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Example: 1 tablet, 5ml"
                      value={dosage}
                      onChange={(e) =>
                        setDosage(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* TIME */}

                  <div className="mb-3">

                    <label className="form-label">
                      Reminder Time{" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      value={time}
                      onChange={(e) =>
                        setTime(
                          e.target.value
                        )
                      }
                      required
                    />

                    <small className="text-muted">
                      Keep this reminder page open
                      when the reminder time arrives.
                    </small>

                  </div>

                  {/* LANGUAGE */}

                  <div className="mb-3">

                    <label className="form-label">
                      Reminder Language{" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <select
                      className="form-select"
                      value={language}
                      onChange={(e) =>
                        setLanguage(
                          e.target.value
                        )
                      }
                    >

                      <option value="en-US">
                        🇬🇧 English
                      </option>

                      <option value="te-IN">
                        🇮🇳 తెలుగు - Telugu
                      </option>

                      <option value="hi-IN">
                        🇮🇳 हिन्दी - Hindi
                      </option>

                      <option value="ta-IN">
                        🇮🇳 தமிழ் - Tamil
                      </option>

                      <option value="kn-IN">
                        🇮🇳 ಕನ್ನಡ - Kannada
                      </option>

                      <option value="ml-IN">
                        🇮🇳 മലയാളം - Malayalam
                      </option>

                    </select>

                    <small className="text-muted">
                      The selected language will
                      be used for the voice reminder.
                    </small>

                    <br />

                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm mt-2"
                      onClick={handleTestVoice}
                    >
                      🔊 Test Voice
                    </button>

                  </div>

                  {/* FREQUENCY */}

                  <div className="mb-3">

                    <label className="form-label">
                      Frequency{" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <select
                      className="form-select"
                      value={frequency}
                      onChange={(e) =>
                        setFrequency(
                          e.target.value
                        )
                      }
                      required
                    >

                      <option value="Once Daily">
                        Once Daily
                      </option>

                      <option value="Twice Daily">
                        Twice Daily
                      </option>

                      <option value="Three Times Daily">
                        Three Times Daily
                      </option>

                      <option value="Every 8 Hours">
                        Every 8 Hours
                      </option>

                      <option value="Every 12 Hours">
                        Every 12 Hours
                      </option>

                    </select>

                  </div>

                  {/* START DATE */}

                  <div className="mb-3">

                    <label className="form-label">
                      Start Date{" "}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) =>
                        setStartDate(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* NOTES */}

                  <div className="mb-4">

                    <label className="form-label">
                      Notes (Optional)
                    </label>

                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="e.g. Take after meals with warm water"
                      value={notes}
                      onChange={(e) =>
                        setNotes(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fs-5"
                    disabled={submitting}
                  >

                    {submitting
                      ? "Saving..."
                      : editingId
                      ? "💾 Update Reminder"
                      : "🎤 Set AI Reminder"}

                  </button>

                </form>

              </div>

            </div>

          </div>

          {/* SAVED REMINDERS */}

          <div className="mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h3>
                📋 Active Reminders (
                {reminders.length}
                )
              </h3>

              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={fetchReminders}
              >
                🔄 Refresh
              </button>

            </div>

            {/* LOADING */}

            {loading ? (

              <div className="card shadow-sm p-4 text-center">

                <div
                  className="spinner-border text-primary mx-auto mb-2"
                  role="status"
                />

                <p className="text-muted mb-0">
                  Loading your reminders
                  from database...
                </p>

              </div>

            ) : reminders.length === 0 ? (

              /* NO REMINDERS */

              <div className="card shadow-sm p-5 text-center">

                <div className="display-4 mb-3">
                  🔔
                </div>

                <h3>
                  No reminders set yet
                </h3>

                <p className="text-muted">
                  Use the form above to schedule
                  smart AI reminders for your medicines.
                </p>

              </div>

            ) : (

              /* REMINDER CARDS */

              <div className="row g-4">

                {reminders.map((reminder) => (

                  <div
                    className="col-md-6 col-lg-4"
                    key={reminder._id}
                  >

                    <div className="card h-100 shadow-sm">

                      <div className="card-body d-flex flex-column">

                        <div className="d-flex justify-content-between align-items-start mb-2">

                          <div>

                            <div className="medicine-icon mb-2">
                              🎤
                            </div>

                            <h4 className="card-title mb-1">
                              {reminder.medicineName}
                            </h4>

                          </div>

                          <span className="badge bg-success">
                            {reminder.status ||
                              "Active"}
                          </span>

                        </div>

                        <hr className="my-2" />

                        <p className="mb-2 small">

                          <strong>
                            💊 Dosage:
                          </strong>{" "}

                          {reminder.dosage}

                        </p>

                        <p className="mb-2 small">

                          <strong>
                            🕐 Time:
                          </strong>{" "}

                          {formatTime(
                            reminder.time
                          )}

                        </p>

                        <p className="mb-2 small">

                          <strong>
                            🔄 Frequency:
                          </strong>{" "}

                          {reminder.frequency}

                        </p>

                        <p className="mb-2 small">

                          <strong>
                            🌐 Language:
                          </strong>{" "}

                          {languageNames[
                            reminder.language
                          ] || "English"}

                        </p>

                        <p className="mb-2 small">

                          <strong>
                            📅 Starts:
                          </strong>{" "}

                          {reminder.startDate
                            ? new Date(
                                reminder.startDate
                              ).toLocaleDateString()
                            : "Today"}

                        </p>

                        {reminder.notes && (
                          <p className="mb-3 small text-muted fst-italic">

                            <strong>
                              📝 Note:
                            </strong>{" "}

                            {reminder.notes}

                          </p>
                        )}

                        <div className="mt-auto d-flex gap-2 pt-2 border-top">

                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm flex-fill"
                            onClick={() =>
                              handleStartEdit(
                                reminder
                              )
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() =>
                              speakReminder(
                                reminder
                              )
                            }
                            title="Test this reminder"
                          >
                            🔊
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm flex-fill"
                            onClick={() =>
                              handleDelete(
                                reminder._id
                              )
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* BACK BUTTON */}

          <div className="text-center mt-5">

            <Link
              to="/dashboard"
              className="btn btn-outline-primary"
            >
              ← Back to Dashboard
            </Link>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="text-center">

        <p>
          💊 Online Pharmacy &
          AI Medicine Reminder System
        </p>

        <p>
          © 2026 All Rights Reserved
        </p>

      </footer>
    </>
  );
}

export default AIReminder;