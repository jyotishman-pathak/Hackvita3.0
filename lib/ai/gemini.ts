import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_AI_KEY ?? "AIzaSyCLjB-9eIk0A4xpN2aQ_haRrxVMwphuf1k";
if (!API_KEY) {
  throw new Error("Missing Google AI API key. Set GOOGLE_AI_KEY in your environment.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Issue {
  type: "security" | "bug" | "smell";
  description: string;
  line: string;
  severity: "low" | "medium" | "high";
  fix: string | null;
}

interface AnalysisResult {
  issues: Issue[];
}

export const AisummarizeCommit = async (diff: string): Promise<AnalysisResult | { error: string; details?: string }> => {
  const prompt = `
    Analyze this GitHub Actions workflow diff for security and best practices:

    1. Security Checks:
       - Permission overprivileging
       - Unsafe input handling
       - Secret exposure
       - Insecure script injections
       - Proper error handling
       - Workflow pinning
    
    2. Code Quality:
       - Proper step naming
       - Job dependencies
       - Condition validation
       - Proper failure handling
       - Resource cleanup
       - Workflow organization

    Return findings in this JSON format:
    \`\`\`json
    {
      "issues": [{
        "type": "security"|"bug"|"smell",
        "description": "Specific problem description",
        "line": "Diff line number (e.g., +L23/-L15)",
        "severity": "low"|"medium"|"high",
        "fix": "Concrete code example or null"
      }]
    }
    \`\`\`

    Diff:
    ${diff}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extracting JSON response
    const jsonMatch = text.match(/```json\n([\s\S]+?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    return JSON.parse(jsonString) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    return { error: "AI analysis failed", details: error instanceof Error ? error.message: String(error) };
  }
};

// Example usage
test();
async function test() {
  console.log(
    await AisummarizeCommit(`
      +console.log("Hello, world!");
      +
      +function greet(name) {
      +    return "Hello, " + name;
      +}
    `)
  );
}
