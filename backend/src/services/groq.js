import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

let groqClient = null;
let warnedMissingKey = false;

function getGroqClient() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        if (!warnedMissingKey) {
            console.warn("GROQ_API_KEY is missing; Groq-powered features are disabled.");
            warnedMissingKey = true;
        }
        return null;
    }
    if (!groqClient) {
        groqClient = new Groq({ apiKey });
    }
    return groqClient;
}

/**
 * Assess the intensity of a reported issue based on its title and description.
 * Returns a score from 1 to 10.
 * 1-3: Minor (e.g., small pothole, flickering light)
 * 4-6: Moderate (e.g., deep pothole, garbage overflow)
 * 7-10: Severe/Emergency (e.g., major water pipe burst, open manhole, massive tree blocking road, bribery)
 */
export async function assessIntensity(title, description, category) {
    try {
        if (category === "BRIBERY") return 10; // Bribery is always max severity
        const groq = getGroqClient();
        if (!groq) return 5;

        const prompt = `
You are a civic issue severity evaluator. Read the following issue and assign it a severity score from 1 to 10.
1-3: Minor cosmetic or small inconvenience.
4-6: Moderate issue requiring standard maintenance.
7-9: Severe hazard posing risk of injury or major public disruption.
10: Absolute emergency, immediate life-threatening danger or massive infrastructure failure.

Issue Title: ${title}
Issue Description: ${description}

Respond with ONLY A SINGLE NUMBER from 1 to 10. Do not include any other text or explanation.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            max_completion_tokens: 5,
        });

        const numText = chatCompletion.choices[0]?.message?.content?.trim() || "5";
        const score = parseInt(numText.replace(/\D/g, ""), 10);

        return isNaN(score) ? 5 : Math.min(Math.max(score, 1), 10);
    } catch (error) {
        console.error("Groq Intensity Assessment Error:", error);
        return 5; // Default fallback
    }
}

/**
 * Checks if a newly reported issue is a likely duplicate of recently reported issues in the same area.
 * Returns true if a duplicate is found, otherwise false.
 */
export async function checkDuplicate(newTitle, newDescription, recentIssues) {
    if (!recentIssues || recentIssues.length === 0) return { isDuplicate: false };

    try {
        const groq = getGroqClient();
        if (!groq) return { isDuplicate: false };
        // Prepare list of existing issues
        const issueList = recentIssues.map((issue, index) =>
            `ID: ${issue.id}\nTitle: ${issue.title}\nDescription: ${issue.description}\n`
        ).join("\n---\n");

        const prompt = `
You are a duplicate detection system for a civic reporting app.
A user is trying to submit a new report. Compare their report to the list of recent reports in their area.
Determine if the new report is describing THE EXACT SAME physical problem as any of the recent reports.

Recent Reports:
${issueList}

New Report Title: ${newTitle}
New Report Description: ${newDescription}

Is the new report a duplicate of any recent report?
If YES, respond in this exact JSON format: {"isDuplicate": true, "duplicateId": "the_id_of_the_matching_issue"}
If NO, respond in this exact JSON format: {"isDuplicate": false}
Do not include any markdown formatting, backticks, or extra text. Just the JSON.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" },
        });

        const responseText = chatCompletion.choices[0]?.message?.content?.trim() || '{"isDuplicate": false}';
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Groq Duplicate Check Error:", error);
        return { isDuplicate: false };
    }
}

/**
 * Generates a comprehensive markdown report summarizing the recent issues in a specific city.
 * Includes direct links to the relevant issues.
 */
export async function generateCityReport(cityName, recentIssues, reqProtocol, reqHost) {
    if (!recentIssues || recentIssues.length === 0) {
        return `No recent issues found in ${cityName} to generate a report.`;
    }

    try {
        const groq = getGroqClient();
        if (!groq) {
            const issueList = recentIssues.map((issue) =>
                `- [${issue.title}](/issues/${issue.id}) (Category: ${issue.category}, Status: ${issue.status})`
            ).join("\n");
            return `## Recent Issues in ${cityName}\n\n${issueList}\n\nOverall civic health: **Unknown (AI report unavailable)**.`;
        }
        const issueList = recentIssues.map((issue) =>
            `- [${issue.title}](/issues/${issue.id}) (Category: ${issue.category}, Status: ${issue.status}) - ${issue.description.substring(0, 100)}...`
        ).join("\n");

        const prompt = `
You are a senior civic analyst. Write a concise, professional executive summary report of the recent civic issues reported in the locality/area of '${cityName}' in Bengaluru, India based on the following data.
Group the report logically by category (e.g., Infrastructure, Sanitation, Safety) or by severity.
You MUST include the exact markdown links provided to reference specific issues so the users can click them.

Here are the recent issues:
${issueList}

Format the report using clean Markdown. Keep it under 400 words. Conclude with a brief summary of the overall civic health of this locality.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
        });

        return chatCompletion.choices[0]?.message?.content?.trim() || "Failed to generate report.";
    } catch (error) {
        console.error("Groq City Report Error:", error);
        throw new Error("Failed to generate city report");
    }
}
