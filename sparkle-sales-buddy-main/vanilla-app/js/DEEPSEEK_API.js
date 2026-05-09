// DeepSeek API - Optimized for Speed
// Get your API key from: https://platform.deepseek.com

const DEEPSEEK_API_KEY = "sk-b4e905c65a694db8af74ac34f5cfeb83";
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

// Optimized system prompt (shorter = faster)
const DEEPSEEK_SYSTEM_PROMPT = `You are SalesAI for SalesPredix. Rules:
- Be concise: max 80 words unless asked for detail
- Use bullet points and bold (**text**) for clarity
- Be data-driven, no greetings or filler
- Focus on actionable insights`;

// Optimized non-streaming call with timeout
async function askDeepSeek(question, context = "") {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
        const response = await fetch(DEEPSEEK_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: DEEPSEEK_SYSTEM_PROMPT + "\n" + context },
                    { role: "user", content: question }
                ],
                max_tokens: 500,
                temperature: 0.3,
                stream: false
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorBody = await response.text().catch(() => "Unknown error");
            throw new Error(`API Error: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('TIMEOUT: Request took too long');
        }
        console.error("DeepSeek API Error:", error);
        throw error;
    }
}

// Streaming call for real-time text display
async function askDeepSeekStream(question, context = "", onChunk, onDone) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s total timeout
    let fullResponse = '';

    try {
        const response = await fetch(DEEPSEEK_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: DEEPSEEK_SYSTEM_PROMPT + "\n" + context },
                    { role: "user", content: question }
                ],
                max_tokens: 500,
                temperature: 0.3,
                stream: true
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorBody = await response.text().catch(() => "Unknown error");
            throw new Error(`API Error: ${response.status} - ${errorBody}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.slice(6).trim();
                    if (jsonStr === '[DONE]') break;

                    try {
                        const parsed = JSON.parse(jsonStr);
                        const content = parsed.choices?.[0]?.delta?.content || '';
                        if (content) {
                            fullResponse += content;
                            if (onChunk) onChunk(content, fullResponse);
                        }
                    } catch (e) {
                        // Skip malformed chunks
                    }
                }
            }
        }

        if (onDone) onDone(fullResponse);
        return fullResponse;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            // Return what we have so far on timeout
            if (fullResponse && onDone) onDone(fullResponse);
            if (fullResponse) return fullResponse;
            throw new Error('TIMEOUT: Request took too long');
        }
        throw error;
    }
}

// Analyze sales data with DeepSeek AI
async function analyzeWithDeepSeek(salesData) {
    return askDeepSeek(
        `Analyze this sales data and provide key insights: ${JSON.stringify(salesData)}`,
        "Focus on identifying trends, patterns, anomalies, and provide actionable recommendations."
    );
}

// Make DeepSeek functions available globally
window.DEEPSEEK_API = {
    askDeepSeek,
    askDeepSeekStream,
    analyzeWithDeepSeek,
    API_KEY: DEEPSEEK_API_KEY
};
