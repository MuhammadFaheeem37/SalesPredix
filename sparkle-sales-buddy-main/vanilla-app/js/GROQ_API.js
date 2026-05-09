// GROQ API Configuration for SalesPredix AI Assistant
// Get your API key from: https://console.groq.com

const GROQ_CONFIG = {
    API_KEY: "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", // Groq API key for SalesPredix
    ENDPOINT: "https://api.groq.com/openai/v1/chat/completions",
    MODELS: {
        LLAMA2_70B: "llama2-70b-4096",
        MIXTRAL_8X7B: "mixtral-8x7b-32768",
        GEMMA_7B: "gemma-7b-it"
    }
};

// Main function to query GROQ AI
async function askGroqAI(query, context = "") {
    try {
        const response = await fetch(GROQ_CONFIG.ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_CONFIG.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: GROQ_CONFIG.MODELS.MIXTRAL_8X7B,
                messages: [
                    {
                        role: "system",
                        content: `You are SalesAI, an intelligent sales data analyst assistant for SalesPredix dashboard. 
                        You help users understand their sales data, identify trends, make predictions, and provide actionable recommendations.
                        Be concise, professional, and data-driven in your responses.
                        Format your responses with clear sections when appropriate.
                        ${context}`
                    },
                    { role: "user", content: query }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
    } catch (error) {
        console.error("GROQ API Error:", error);
        throw error;
    }
}

// Analyze sales data with AI
async function analyzeSalesData(salesData) {
    const context = "Focus on identifying trends, patterns, anomalies, and provide actionable recommendations.";
    return askGroqAI(
        `Analyze this sales data and provide key insights: ${JSON.stringify(salesData)}`,
        context
    );
}

// Get product recommendations
async function getProductRecommendations(topProducts, salesTrends) {
    return askGroqAI(
        `Based on these top products: ${JSON.stringify(topProducts)} and sales trends, what products should we focus on and why?`,
        "Provide specific, actionable product recommendations."
    );
}

// Get regional insights
async function getRegionalInsights(regionData) {
    return askGroqAI(
        `Analyze regional sales performance: ${JSON.stringify(regionData)}. Which regions need attention and why?`,
        "Focus on regional performance gaps and expansion opportunities."
    );
}

// Get sales predictions
async function getSalesPredictions(historicalData, currentTrends) {
    return askGroqAI(
        `Based on historical data: ${JSON.stringify(historicalData)} and current trends: ${JSON.stringify(currentTrends)}, predict next month's sales performance.`,
        "Provide data-driven predictions with confidence levels."
    );
}

// Make GROQ functions available globally
window.GROQ_API = {
    askGroqAI,
    analyzeSalesData,
    getProductRecommendations,
    getRegionalInsights,
    getSalesPredictions,
    GROQ_CONFIG
};
