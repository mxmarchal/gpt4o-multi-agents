# GPT-4o Multi-Agent System

A voice-controlled multi-agent system built with TypeScript and Bun that uses GPT-4o to handle various home automation tasks through modular agents. This is a prototype project for learning agent orchestration and multi-agent system design patterns.

## Overview

This project implements a multi-agent architecture where a main orchestrator agent delegates tasks to specialized agents (like Spotify control) based on voice commands. The system is designed for quick responses (under 15 seconds) and supports multiple languages.

**Note**: This is a learning project focused on exploring agent orchestration patterns, function calling with LLMs, and modular system design. It serves as a practical exploration of multi-agent architectures and their implementation challenges.

## Features

- **Voice-controlled interface** - Optimized for spoken interactions
- **Multi-agent architecture** - Modular design with specialized agents
- **Spotify integration** - Control music playback, get track information
- **Multi-language support** - Responds in the user's preferred language
- **OpenAI GPT-4o integration** - Leverages function calling for task delegation

## Architecture

The system consists of:

- **Main orchestrator** (`index.ts`) - Routes user requests to appropriate agents
- **Spotify agent** (`modules/spotify.ts`) - Handles music-related commands
- **Response generator** (`response.ts`) - Creates user-friendly responses from function results

## Prerequisites

- [Bun](https://bun.sh) runtime
- OpenAI API key with GPT-4o access
- Node.js (for TypeScript support)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables:
   ```bash
   export OPENAI_API_KEY="your-openai-api-key"
   export LANG="en"  # or your preferred language
   ```

## Usage

Run the system with a voice command:

```bash
bun run index.ts "play some music"
bun run index.ts "what's currently playing"
bun run index.ts "pause the music"
```

## Available Commands

### Spotify Agent
- **Play/Resume** - Start or resume music playback
- **Pause** - Pause current track
- **Next** - Skip to next track
- **Previous** - Go to previous track
- **Current Track** - Get information about what's playing

## Configuration

### Environment Variables
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `LANG` - Response language (default: system language)

### Adding New Agents

1. Create a new module in the `modules/` directory
2. Export a function that handles the agent's logic
3. Register the agent in `index.ts` functions array
4. Add the function definition to the OpenAI functions array

## Development

This project uses:
- **Bun** - Fast JavaScript runtime and package manager
- **TypeScript** - Type-safe JavaScript
- **OpenAI GPT-4o** - AI model with function calling capabilities

## Performance

The system is optimized for quick responses, with performance metrics logged for each request. Typical response times are under 2 seconds for simple commands.

## Future Enhancements

- Real Spotify API integration (currently uses mock data)
- Additional smart home agents (lights, temperature, etc.)
- Voice synthesis integration for audio responses
- WebSocket support for real-time interactions

## License

This project was created using `bun init` in bun v1.1.8.