import OpenAI from "openai";

export async function extractSymptoms(userInput: string): Promise<{ symptoms: string[] }> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn("OPENAI_API_KEY is missing. Returning mocked symptoms for testing.");
    // Mock basic keyword extraction for testing without an API key
    const mockSymptoms: string[] = [];
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes("dizzy") || lowerInput.includes("dizziness")) mockSymptoms.push("dizziness");
    if (lowerInput.includes("vomit")) mockSymptoms.push("vomiting");
    if (lowerInput.includes("fever")) mockSymptoms.push("fever");
    if (lowerInput.includes("stomach")) mockSymptoms.push("stomach_pain");
    if (lowerInput.includes("cough")) mockSymptoms.push("cough");
    if (lowerInput.includes("faint")) mockSymptoms.push("fainting");
    return { symptoms: mockSymptoms };
  }

  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an intelligent triage medical assistant. Your task is to extract symptoms from the user's free text input. 
Rules:
- Output the extracted symptoms as a JSON object with a single key "symptoms" containing an array of strings.
- Return ONLY the JSON object, with no additional text, explanation, or markdown formatting.
- Normalize and use consistent symptom naming (e.g., "dizziness", "vomiting", "fever", "stomach_pain", "cough", "fainting").
- If no symptoms are detected, return an empty array for "symptoms".`
      },
      {
        role: "user",
        content: userInput
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0,
  });

  const content = response.choices[0].message.content;

  if (!content) {
    return { symptoms: [] };
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to parse symptoms JSON from OpenAI:", error);
    return { symptoms: [] };
  }
}
