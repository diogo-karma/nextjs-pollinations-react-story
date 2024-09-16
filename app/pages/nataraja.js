'use client';

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
// @ts-expect-error todo: interfaces
import { usePollinationsChat, PollinationsImage } from "@pollinations/react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { PiFlowerLotusFill } from "react-icons/pi";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PollinationsImageOptions {
  width?: number;
  height?: number;
  model?: string;
  seed?: number;
  nologo?: boolean;
  enhance?: boolean;
}

const SYSTEM_MESSAGE: Message = {
  role: 'system',
  content: `Image Generator Instructions
You are an image generator. The user provides a prompt. If it is short, add creative details to make it about 50 words suitable for an image generator AI. Please return a JSON and nothing else:

{
  "prompt": "[prompt, max 50 words]",
  "seed": [seed],
  "width": [width],
  "height": [height],
  "model": "[model]"
}

Key points:
Each seed value creates a unique image for a given prompt.
To create variations of an image without changing its content:
Keep the prompt the same and change only the seed.
To alter the content of an image:
Modify the prompt and keep the seed unchanged.
Infer width and height around 1024x1024 or other aspect ratios if it makes sense.
Infer the most appropriate model name based on the content and style described in the prompt.

Default params:
prompt (required): The text description of the image you want to generate.
model (optional): The model to use for generation. Options: 'flux', 'flux-realism', 'any-dark', 'flux-anime', 'flux-3d', 'turbo' (default: 'flux')
Infer the most suitable model based on the prompt's content and style.
seed (optional): Seed for reproducible results (default: random).
width/height (optional): Default 1024x1024.
nologo (optional): Set to true to disable the logo rendering.

Additional instructions:
If the user specifies the /imagine command, return the parameters as JSON.
Response should be in valid JSON format only.`
}

export default function Home() {
  const { messages, sendUserMessage } = usePollinationsChat([SYSTEM_MESSAGE]);
  const [userInput, setUserInput] = useState < string > ('');
  const chatContainerRef = useRef < HTMLDivElement > (null);
  const bottomRef = useRef < HTMLDivElement > (null);
  const inputRef = useRef < HTMLInputElement > (null);

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      sendUserMessage(userInput);
      setUserInput('');
    }
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus on the input field
  const focusOnInput = () => {
    inputRef.current?.focus();
  };

  const nextPrompt = () => {
    scrollToBottom();
    focusOnInput();
  }

  // Effect to handle scrolling and focusing
  useEffect(() => {
    const observer = new ResizeObserver(nextPrompt);

    if (chatContainerRef.current) {
      observer.observe(chatContainerRef.current);
    }

    return () => {
      if (chatContainerRef.current) {
        observer.unobserve(chatContainerRef.current);
      }
    };
  }, [messages]);

  // Parse JSON from message content
  const parseMessageContent = (content: string): { prompt: string; options: PollinationsImageOptions | null } => {
    try {
      const parsedContent = JSON.parse(content);
      const { prompt, ...options } = parsedContent;
      return { prompt, options: { ...options, seed: options.seed ?? 1337 } };
    } catch (error) {
      console.error('JSON parsing error', content);
      // Fallback to regex parsing if JSON.parse fails
      const jsonRegex = /{[^{}]*(?:{[^{}]*}[^{}]*)*}/;
      const match = content.match(jsonRegex);
      if (match) {
        try {
          const jsonString = match[0]
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\n/g, '')
            .replace(/\n/g, '');
          const parsedMatch = JSON.parse(jsonString);
          const { prompt, ...options } = parsedMatch;
          return { prompt, options: { ...options, seed: options.seed ?? 1337 } };
        } catch (e) {
          console.error('Error parsing extracted JSON', e);
        }
      }
    }
    return { prompt: content, options: null };
  };

  return (
    <main ref={chatContainerRef} className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-screen flex items-center justify-center">
        <div className="max-w-screen-md flex-1 flex flex-col h-[100svh] items-center p-5 sm:p-7 gap-5 sm:gap-7">
          <h1>hello</h1>
          {messages.map((message: Message, index: number) => (
            <div key={index}>
              {message.role === 'user' && (
                <h1 className="text-2xl flex items-center">
                  <PiFlowerLotusFill size={25} className="mr-2" /> {message.content}
                </h1>
              )}
              {message.role === 'assistant' && (
                <>
                  <h1 className="text-1xl flex items-center">
                    {parseMessageContent(message.content).prompt}
                  </h1>
                  {parseMessageContent(message.content).options && (
                    <PollinationsImage
                      prompt={parseMessageContent(message.content).prompt}
                      options={parseMessageContent(message.content).options as PollinationsImageOptions}
                      onLoad={nextPrompt}
                    />
                  )}
                </>
              )}
            </div>
          ))}
          <div ref={bottomRef}></div>
          <form onSubmit={handleSubmit} className="bg-white/5 p-1.5 text-lg rounded-full relative w-full">
            <input
              ref={inputRef}
              type="text"
              className="text-white w-full p-3 pl-5 pr-14 bg-transparent rounded-full border-[2px] border-white/5 hover:border-white/20 focus:border-yellow-200 outline-0 transition-all duration-500"
              placeholder="Chat with pollinations..."
              value={userInput}
              onChange={handleInputChange}
            />
            <button
              className="absolute right-4 hover:scale-110 transition-all top-3.5 bg-gray-600 hover:bg-yellow-500 p-2 rounded-full cursor-pointer"
              type="submit"
            >
              <AiOutlineArrowUp size={25} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}