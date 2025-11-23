let recognizing = false;
let recognition;

const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");
const startBtn = document.getElementById("start");
const btnLabel = document.getElementById("btn-label");

// Change this to your phone's local IP address on Wi‑Fi
// For local testing on the same machine, use "localhost" or "127.0.0.1"
// For network access, use your machine's IP (e.g., "192.168.1.10")
const PHONE_IP = "localhost";
const API_URL = `http://${PHONE_IP}:5000/ai`;

function setStatus(text) {
  statusEl.textContent = text;
}

function setOutput(text) {
  outputEl.textContent = text;
}

function initSpeech() {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    startBtn.disabled = true;
    setStatus("Speech recognition is not supported in this browser.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    recognizing = true;
    btnLabel.textContent = "Listening...";
    setStatus("Listening...");
  };

  recognition.onerror = (event) => {
    recognizing = false;
    btnLabel.textContent = "Start speaking";
    setStatus("Error: " + event.error);
  };

  recognition.onend = () => {
    recognizing = false;
    btnLabel.textContent = "Start speaking";
    if (!statusEl.textContent.startsWith("Error")) {
      setStatus("Stopped listening.");
    }
  };

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    setStatus("You said: \"" + text + "\". Sending to phone…");
    setOutput("");

    const answer = await sendToAI(text);
    setOutput(answer);
  };
}

startBtn.addEventListener("click", () => {
  if (!recognition) {
    initSpeech();
  }
  if (!recognition) return;

  if (!recognizing) {
    recognition.start();
  } else {
    recognition.stop();
  }
});

async function sendToAI(text) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: text })
    });

    if (!res.ok) {
      throw new Error("Server error: " + res.status);
    }

    const data = await res.json();
    setStatus("Reply from phone received.");
    return data.reply || "(No reply field in response)";
  } catch (err) {
    console.error(err);
    setStatus("Could not connect to your phone.");
    return "Cannot connect to your phone. Check:
• PHONE_IP in app.js
• Phone and browser on same Wi‑Fi
• Python server running";
  }
}

// Initialize immediately so we can show unsupported status if needed
initSpeech();
