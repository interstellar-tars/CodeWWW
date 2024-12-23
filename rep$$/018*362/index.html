export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle CORS for preflight requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        if (url.pathname === "/admin/transcripts/") {
            return await fetchTranscripts(env.CHAT_LOGS);
        }

        if (request.method === "POST" && url.pathname === "/chat") {
            return await handleChatRequest(request, env);
        }

        // Default response for unsupported routes
        return new Response("Welcome to CodeWWW IT Support Chatbot!", {
            headers: { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" },
        });
    },
};

// Function to handle chat requests
async function handleChatRequest(request, env) {
    try {
        const body = await request.json();

        // Validate user input
        const userMessage = body.message;
        if (!userMessage) {
            return new Response(JSON.stringify({ error: "Message is required." }), {
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                status: 400,
            });
        }

        const userAgent = request.headers.get("User-Agent") || "Unknown";

        // Check for social engineering attempts
        const result = detectSocialEngineering(userMessage);
        const response = result.success
            ? "Exercise Finished"
            : generateITSupportResponse(userMessage);

        // Log the conversation
        await logConversation(env.CHAT_LOGS, body.sessionId, userMessage, response, userAgent);

        return new Response(JSON.stringify({ response }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Unable to process your message", details: error.message }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 500,
        });
    }
}

// Function to fetch all transcripts
async function fetchTranscripts(kvNamespace) {
    try {
        const keys = await kvNamespace.list();
        const transcripts = {};

        for (const key of keys.keys) {
            const logs = await kvNamespace.get(key.name, { type: "json" });
            transcripts[key.name] = logs || [];
        }

        // Return the transcripts as JSON
        return new Response(JSON.stringify(transcripts, null, 2), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
    } catch (error) {
        // Handle any errors gracefully and provide a helpful response
        return new Response(JSON.stringify({ error: "Unable to fetch transcripts", details: error.message }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 500,
        });
    }
}

// Function to generate IT support responses
function generateITSupportResponse(userMessage) {
    const keywords = [
        { keyword: "password", response: "It seems like you're having trouble with your password. Have you tried resetting it through our self-service portal?" },
        { keyword: "email", response: "If you're having issues with your email, please check if you're logged in and your internet connection is stable." },
        { keyword: "slow", response: "Performance issues can often be resolved by restarting your system. Have you tried that yet?" },
        { keyword: "printer", response: "Printer issues can be frustrating! Is the printer showing any error messages or is it out of paper?" },
        { keyword: "network", response: "Network issues might be caused by a local outage. Can you confirm if other devices are experiencing the same problem?" },
    ];

    // Default response
    let response = "I'm here to assist with any IT-related issues. Can you provide more details about your problem?";

    // Match keywords to user message
    for (const { keyword, response: keywordResponse } of keywords) {
        if (userMessage.toLowerCase().includes(keyword)) {
            response = keywordResponse;
            break;
        }
    }

    // Add escalation suggestion for unresolved issues
    response += " If this doesn't resolve your issue, I can escalate it to our technical team. Let me know!";
    return response;
}

// Function to detect social engineering attempts
function detectSocialEngineering(userMessage) {
    const suspiciousPatterns = [
        "can you give me the admin password",
        "what's the vpn login",
        "i forgot my credentials, can you reset",
        "i need access to the internal system",
        "can you share the server details",
    ];

    const threshold = 0.7; // Similarity threshold (70%)
    const userMessageLower = userMessage.toLowerCase();

    for (const pattern of suspiciousPatterns) {
        const similarity = calculateSimilarity(userMessageLower, pattern);
        if (similarity >= threshold) {
            return { success: true };
        }
    }

    return { success: false };
}

// Custom implementation of Levenshtein distance
function calculateSimilarity(input, pattern) {
    const len1 = input.length;
    const len2 = pattern.length;

    // Create a 2D array for the distance matrix
    const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

    // Initialize the distance matrix
    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;

    // Compute the Levenshtein distance
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = input[i - 1] === pattern[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1, // Deletion
                dp[i][j - 1] + 1, // Insertion
                dp[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    const distance = dp[len1][len2];
    const maxLength = Math.max(len1, len2);

    return 1 - distance / maxLength; // Similarity as a percentage
}

// Function to log conversations in KV
async function logConversation(kvNamespace, sessionId, userMessage, botResponse, userAgent) {
    const timestamp = new Date().toISOString();

    // Create a log entry
    const logEntry = {
        timestamp,
        userMessage,
        botResponse,
        userAgent,
    };

    // Fetch existing logs for the session
    const existingLogs = await kvNamespace.get(sessionId, { type: "json" }) || [];

    // Append the new log entry
    existingLogs.push(logEntry);

    // Save the updated logs back to KV
    await kvNamespace.put(sessionId, JSON.stringify(existingLogs));
}
