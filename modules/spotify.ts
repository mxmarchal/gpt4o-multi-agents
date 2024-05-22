import { getResponse } from "../response";

const apiKey = process.env.OPENAI_API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";
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
export const module = async (prompt: string) => {
  const data = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a spotify assistant for Maxence's home in a multi-agent environment. I'll give you the user request and you'll have to trigger the right function. If you don't know how to handle the request, you'll have to answer `Sorry, I'm not able to do that.`.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    functions: [
      {
        name: "play",
        description: "Start playing the current track",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "pause",
        description: "Pause the current track",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "next",
        description: "Play the next track",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "previous",
        description: "Play the previous track",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "getCurrentTrack",
        description: "Get the current track",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
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

      return result;
    } else {
      console.error(`Function ${name} is not defined.`); //TODO: Whisper the response to the user
    }
  } else if (message.content) {
    console.log("Response:", message.content); //TODO: Whisper the response to the user
  }
};

//Fake data
const spotifyData = {
  track: {
    name: "Song name",
    artist: "Artist name",
    album: "Album name",
  },
  status: "playing", // or "paused"
};

const nextTrack = {
  track: {
    name: "Next song name",
    artist: "Next artist name",
    album: "Next album name",
  },
};

const previousTrack = {
  track: {
    name: "Previous song name",
    artist: "Previous artist name",
    album: "Previous album name",
  },
};

const functions: {
  [key: string]: (...args: any[]) => void;
} = {
  play: async () => {
    return {
      function: "play",
      status: "done",
      currentTrack: spotifyData.track,
    };
  },
  pause: async () => {
    return {
      function: "pause",
      status: "done",
    };
  },
  next: async () => {
    return {
      function: "next",
      status: "done",
      currentTrack: nextTrack.track,
    };
  },
  previous: async () => {
    return {
      function: "previous",
      status: "done",
      currentTrack: previousTrack.track,
    };
  },
  getCurrentTrack: async () => {
    return {
      function: "getCurrentTrack",
      status: "done",
      currentTrack: spotifyData.track,
    };
  },
};
