import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCLjB-9eIk0A4xpN2aQ_haRrxVMwphuf1k");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const AisummarizeCommit = async (diff: string) => {
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
    const text = (await result.response).text();

    // Extract valid JSON from AI response
    const jsonMatch = text.match(/```json\n([\s\S]+?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Analysis failed:", error);
    return { error: "AI analysis failed", details: error.message };
  }
};


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





async function analyzeCode(code: string) {
    // Step 1: Retrieve relevant context
    const relevantDocs = await collection.query({
      queryTexts: [code],
      nResults: 3 // Get top 3 relevant documents
    });
  
    // Step 2: Build enhanced prompt
    const ragContext = relevantDocs.documents[0].join("\n---\n");
    
    const prompt = `
      Analyze this code for issues using these guidelines:
      ${ragContext}
  
      Code:
      ${code}
  
      Format response as JSON with: 
      { issues: { type: string, description: string, line: number, references: string[] }[] }
    `;
  
    // Step 3: Generate with Gemini
    const result = await model.generateContent(prompt);
    return parseResponse(result);
  }