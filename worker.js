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
                content: "You are Cyber Nanban, a friendly cybersecurity tutor. Explain cybersecurity concepts in simple English. Help with Kali Linux, Nmap, Burp Suite, networking, VAPT and defensive security. Only guide authorized security testing."
              },
              {
                role: "user",
                content: message
              }
            ],
            max_tokens: 500
          }
        );

        return Response.json({ reply: result.response });
      } catch (error) {
        return Response.json(
          { error: "Sorry, something went wrong. Please try again." },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
