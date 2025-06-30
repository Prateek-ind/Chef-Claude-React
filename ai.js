import { inference, InferenceClient } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

const apiKey = import.meta.env.VITE_API_KEY;
const hf = new InferenceClient(apiKey); // ✅ create instance

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");
  const prompt = `
  ${SYSTEM_PROMPT}

  I have: ${ingredientsString}.
  Please give me a recipe you'd recommend I make.
  `;

  try {
    const response = await hf.textGeneration({
      model: "google/flan-t5-large",
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
      },
    });

    return response.generated_text;
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return "Sorry, I couldn't generate a recipe at the moment.";
  }
}

const apiKey2 = import.meta.env.VITE_OPENROUTER_KEY;

export async function getRecipeFromOpenRouter(ingredientsArr) {
  const prompt = `I have: ${ingredientsArr.join(", ")}. Recommend a recipe.`;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey2}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          { role: "system", content: "You are a helpful recipe assistant." },
          { role: "user", content: prompt },
        ],
      }),
    }
  );

  const data = await response.json();
  return data.choices[0].message.content;
}
