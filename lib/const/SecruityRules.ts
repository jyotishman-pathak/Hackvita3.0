export const SECURITY_RULES = {
    sqlInjection: {
      pattern: /(?:mysql2?|pg)\.(?:query|execute)\(.*?\$\{/gis,
      explanation: "SQL Injection Risk: Use parameterized queries",
      exampleFix: "const [users] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);"
    },
    xss: {
      pattern: /(?:res\.send|ReactDOM\.render)\(.*[^\\]<(?:script|iframe)/gis,
      explanation: "XSS Vulnerability: Sanitize with DOMPurify or escape output",
      exampleFix: "import DOMPurify from 'dompurify'; <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}} />"
    },
    secrets: {
      pattern: /(?:password|apiKey|jwtSecret)\s*:\s*['"].+['"]/gis,
      explanation: "Hardcoded Secret: Store in environment variables",
      exampleFix: "const apiKey = process.env.API_KEY;"
    }
  };
  
  // Helper to find line numbers
  export function getLineNumber(code: string, index: number): number {
    return code.substring(0, index).split('\n').length;
  }