import { module as spotifyModule } from "./modules/spotify";
import { getResponse } from "./response";

type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenAIFunction = {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
    required: string[];
  };
};

type OpenAIRequestBody = {
  model: string;
  messages: OpenAIMessage[];
  functions: OpenAIFunction[];
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

//get all args after the first one and concatenate them to a string (prompt)
const prompt = process.argv.slice(2).join(" ");

if (!prompt) {
  console.error("Please provide a prompt.");
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

const data: OpenAIRequestBody = {
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content:
        "You are a helpful assistant for Maxence's home. The only way Maxence will interact with you is with vocal. You must not say long sentences that'll take more than 15 secondes to speech. You can answer to general question. If user ask you for a specific task that required action, it must be available in functions, else you'll have to answer `Sorry, I'm not able to do that (1).`.",
    },
    { role: "user", content: prompt },
  ],
  functions: [
    {
      name: "spotify",
      description:
        "Spotify assistant use to control the music, get information about the current track and more.",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "The user request",
          },
        },
        required: ["prompt"],
      },
    },
  ],
};

const functions: { [key: string]: Function } = {
  spotify: spotifyModule,
};

async function callOpenAI(): Promise<void> {
  const timeStart = Date.now();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result: OpenAIResponse = await response.json();
    const { choices } = result;
    const message = choices[0].message;

    if (message.function_call) {
      const { name, arguments: args } = message.function_call;

      if (functions[name]) {
        const parsedArgs = JSON.parse(args);
        const result = await functions[name](...Object.values(parsedArgs));
        // Generate user friendly response based on the function call result
        const finalResponse = await getResponse(prompt, JSON.stringify(result));
        const finalMessage = finalResponse.choices[0].message;
        if (finalMessage.content) {
          console.log("Final response:", finalMessage.content); //TODO: Whisper the response to the user
        } else {
          console.error(`Function ${name} is not defined. (3)`); //TODO: Whisper the response to the user
        }
      } else {
        console.error(`Function ${name} is not defined.(2)`);
      }
    } else if (message.content) {
      console.log("Response:", message.content);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
  const timeEnd = Date.now();
  console.log(`Time taken: ${timeEnd - timeStart}ms`);
}

// Call the function
callOpenAI();
