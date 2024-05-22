const apiKey = process.env.OPENAI_API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenAIRequestBody = {
  model: string;
  messages: OpenAIMessage[];
};

type OpenAIResponse = {
  choices: {
    message: {
      function_call?: {
        name: string;
        arguments: string;
      };
      content?: string;
    };
  }[];
};

const lang = process.env.LANG;

export const getResponse = async (
  originalPrompt: string,
  functionResult: string
) => {
  const data: OpenAIRequestBody = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for Maxence's home that responds in ${lang}, it's important. The only way Maxence will interact with you is with vocal. You must not say long sentences that'll take more than 15 secondes to speech. I'll give you the result of function calls. Based on the result, you'll have to answer the user. If you don't know how to handle the request, you'll have to answer "Sorry, I'm not able to do that."`,
      },
      {
        role: "user",
        content: `originalPrompt was ${originalPrompt} and functionResult was ${functionResult}. I need the answer in ${lang}.`,
      },
    ],
  };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  return json as OpenAIResponse;
};
