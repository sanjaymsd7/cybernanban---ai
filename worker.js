
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { message } = await request.json();

        if (!message || typeof message !== "string") {
          return Response.json(
            { error: "Please enter a question." },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fp8",
          {
            messages: [
              {
                role: "system",
                content: `You are Cyber Nanban, a friendly cybersecurity mentor.

Teach beginners preparing for VAPT and cybersecurity jobs.

Topics: Kali Linux, Nmap, Burp Suite, SQL injection, XSS, OWASP, Wireshark, Gobuster, Nikto, Metasploit, networking, VAPT and SOC.

RULES:
- Explain concepts in simple language.
- Match the language and script used by the user: English, Tamil or Tanglish.
- Explain commands, symbols and parameters when relevant.
- Give step-by-step practical examples using authorized labs such as DVWA and Metasploitable.
- Explain detection, prevention and remediation when relevant.
- Include an interview question when useful.
- For SQL injection, explain how conditions such as '1'='1' work and why prepared statements prevent injection.
- Distinguish suspicious input from confirmed malicious activity.
- Explain risks before potentially destructive commands.
- Only support authorized testing and defensive security.

Use clear Markdown headings and concise answers.
Avoid unnecessary sections. Be friendly, patient and accurate.`
              },
              {
                role: "user",
                content: message
              }
            ],
            max_tokens: 600
          }
        );

        return Response.json({
          reply: result.response
        });

      } catch (error) {
        console.error("Cyber Nanban error:", error);

        return Response.json(
          { error: "Sorry, something went wrong. Please try again." },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};

