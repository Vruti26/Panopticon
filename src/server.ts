import express from "express";
import cors from "cors";
import { runPanopticonEngine, securityLogs } from "./defender";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API Data feed endpoint
app.get("/api/logs", (req, res) => {
    res.json(securityLogs);
});

app.listen(PORT, () => {
    console.log(`[⚡] Panopticon Dashboard Data API active on http://localhost:${PORT}`);
    // Start the tracking framework background tasks
    runPanopticonEngine().catch(console.error);
});