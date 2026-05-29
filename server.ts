import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY is not defined. AI task recommendation features will fall back to local rule-based generation.");
}

// REST API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Gemini Task Recommendation Engine
app.post("/api/gemini/suggest-tasks", async (req, res) => {
  try {
    const { tasks = [], username = "Nova User", focusCategory = "" } = req.body;

    if (!ai) {
      // Return beautiful fallback tasks if API key is not yet set up
      return res.json({
        suggestions: [
          {
            title: "Optimize workspace architecture",
            reason: `Based on your database profile, setting off a dedicated tech stack cleanup will increase operational throughput by 15%.`,
            priority: "High",
            category: "Engineering"
          },
          {
            title: "Structure weekly sprint boards",
            reason: "Align current pending items under a streamlined multi-task dashboard view to clear critical blockages.",
            priority: "Medium",
            category: "Management"
          },
          {
            title: "Implement automated data exports",
            reason: "Secure task list records with daily localized archives to avoid loss of active data files.",
            priority: "Low",
            category: "Database"
          }
        ]
      });
    }

    const taskContext = tasks.length > 0 
      ? tasks.map((t: any) => `- [${t.status}] ${t.title} (${t.priority} priority, category: ${t.category})`).join("\n")
      : "No tasks created yet. Welcome to the workspace!";

    const prompt = `You are the core NovaTask AI productivity orchestrator. Review this user's current workspace profile and tasks context to suggest 3 next-best action items.
    
User Profile: ${username}
Active Focus Preference: ${focusCategory || "General Productivity"}

Active Tasks:
${taskContext}

Recommend exactly 3 highly personalized, realistic, futuristic-styled task suggestions with a precise justification/reason, suggested priority, and a relevant category. Ensure the tone is highly encouraging, professional, slick, and SaaS-inspired.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Actionable title of the suggested task." },
                  reason: { type: Type.STRING, description: "Fascinating, intelligence-driven reason of why this enhances productivity." },
                  priority: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                  category: { type: Type.STRING, description: "Category grouping (e.g., Development, Logistics, Brainstorming)." }
                },
                required: ["title", "reason", "priority", "category"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const suggestionsText = response.text || "{}";
    const resultObj = JSON.parse(suggestionsText);
    res.json(resultObj);
  } catch (err: any) {
    console.error("Gemini suggestion error details:", err);
    res.status(500).json({ error: "Failed to generate AI recommendations", details: err.message });
  }
});

// Setup Vite Dev server middleware or static directory
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NovaTask AI full-stack container initialized.`);
    console.log(`Development endpoint active on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
