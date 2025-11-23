# AI Copilot (Android + GitHub Pages)

This project lets you use a simple voice-based AI copilot from a web page (GitHub Pages) that connects directly to a Python backend running on your Android phone (via Termux).

## Structure

- `index.html` — Front-end UI for the copilot (host this on GitHub Pages)
- `app.js` — Browser logic: speech recognition + HTTP calls to your phone
- `backend/server.py` — Python backend that runs on your Android phone (Termux)
- `backend/requirements.txt` — Python dependencies

---

## 1. Front-end (GitHub Pages)

1. Create a new GitHub repository.
2. Put `index.html` and `app.js` in the root of that repo.
3. Commit and push.
4. Go to **Settings → Pages** and enable GitHub Pages from the `main` branch root.
5. Open the GitHub Pages URL in your phone browser.

Edit `PHONE_IP` in `app.js`:

```js
const PHONE_IP = "YOUR-PHONE-IP"; // e.g. 192.168.1.10
```

You can find your phone IP from Wi‑Fi settings.

Both your phone and the device opening the website must be on the same Wi‑Fi network.

---

## 2. Backend on Android (Termux)

### Install Termux

1. Install **Termux** from F-Droid or a trusted source.
2. Open Termux and run:

```bash
pkg update
pkg install python
pip install -r backend/requirements.txt
```

Or manually:

```bash
pip install flask
```

Optional: if you want Android integration, also install:

```bash
pkg install termux-api
```

### Run the server

Copy `backend/server.py` to your phone (Termux home directory) or clone the repo.

Then run:

```bash
python server.py
```

You should see something like:

```text
 * Serving Flask app 'server'
 * Running on http://0.0.0.0:5000
```

Now your phone is listening for `POST` requests at `/ai`.

---

## 3. Using the Copilot

1. Open your GitHub Pages URL on the device where you want to speak.
2. Allow microphone access.
3. Click **“Start speaking”** and talk.
4. Your speech is:
   - Converted to text in the browser.
   - Sent to your Android phone (`server.py`).
   - Processed and a reply is sent back.

Example commands supported in `server.py`:

- `create note buy milk and bread`  
  → appends `"buy milk and bread"` to `ai_note.txt` in the backend folder.

- `notify hello from copilot`  
  → sends an Android notification (if `termux-api` is installed).

Anything else:

- Returns a basic text reply from the fallback.

You can expand `server.py` to:
- Control Tasker via HTTP
- Call local LLMs
- Use online APIs (OpenAI, etc.)
- Manage files, messages, etc.

---

## 4. OpenAI or other AI models (optional)

In `backend/server.py`, there is a commented section where you can plug in OpenAI:

```python
# import openai
# openai.api_key = os.getenv("OPENAI_API_KEY")
```

Set the environment variable in Termux:

```bash
export OPENAI_API_KEY="sk-..."
python server.py
```

Then replace the fallback logic with a real API call.

---

## 5. Security notes

- This is intended for local Wi‑Fi usage.
- Do not expose your phone server directly to the internet without authentication.
- If you use API keys, store them in environment variables, not in source code.

---

Enjoy hacking your own personal AI copilot. Customize `server.py` to make it truly yours.
