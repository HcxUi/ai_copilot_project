from flask import Flask, request, jsonify
import os
import subprocess

# Optional: if you want online AI like OpenAI, uncomment and configure:
# import openai
# openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

@app.route("/ai", methods=["POST"])
def ai():
    data = request.get_json(force=True)
    msg = data.get("message", "").strip()

    if not msg:
        return jsonify({"reply": "I did not receive any text."})

    # Very simple intent handling example
    # You can extend this with real AI or local LLMs.
    if msg.lower().startswith("create note"):
        # Example: create a text file in Termux
        note_text = msg[len("create note"):].strip() or "Empty note"
        filename = "ai_note.txt"
        path = os.path.join(os.getcwd(), filename)
        with open(path, "a", encoding="utf-8") as f:
            f.write(note_text + "\n")
        reply = f"Note saved to {filename}."
    elif msg.lower().startswith("notify"):
        # Example: send Android notification via termux-api (if installed)
        content = msg[len("notify"):].strip() or "AI notification"
        try:
            subprocess.run(
                ["termux-notification", "--title", "AI Copilot", "--content", content],
                check=True
            )
            reply = "Notification sent on your phone."
        except Exception as e:
            reply = f"Tried to send notification but got an error: {e}"
    else:
        # Fallback basic reply (replace this with real AI call if you want)
        reply = f"You said: "{msg}". I am your local copilot. Configure me to run more actions."

        # Example of where to plug OpenAI or any other model:
        # completion = openai.ChatCompletion.create(
        #     model="gpt-4o-mini",
        #     messages=[{"role": "user", "content": msg}]
        # )
        # reply = completion.choices[0].message["content"]

    return jsonify({"reply": reply})

if __name__ == "__main__":
    # 0.0.0.0 makes it visible to other devices on the same Wi‑Fi
    app.run(host="0.0.0.0", port=5000)
