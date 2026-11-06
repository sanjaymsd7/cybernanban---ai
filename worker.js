
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { message, stream } = await request.json();

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
- Explain commands and symbols when relevant.
- Give safe practical examples using authorized labs such as DVWA and Metasploitable.
- Explain detection, prevention and remediation when relevant.
- Include interview questions when useful.
- Explain SQL injection conditions and prepared statements.
- Distinguish suspicious input from confirmed malicious activity.
- Explain risks before destructive commands.
- Only support authorized security testing.

Use clear Markdown and concise answers.
Be friendly, patient and accurate.`
              },
              {
                role: "user",
                content: message
              }
            ],
            max_tokens: 600,
            stream: stream === true
          }
        );

        if (stream === true) {
          return new Response(result, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
            }
          });
        }

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
