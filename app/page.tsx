'use client';

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
// @ts-expect-error todo: interfaces
import { usePollinationsChat, PollinationsImage } from "@pollinations/react";
import { AiOutlineArrowDown, AiOutlineGithub } from "react-icons/ai";
import { MdArrowOutward } from "react-icons/md";
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_MESSAGE: Message = {
  role: 'system',
  content: `You are a story generator. The user provides a prompt with a maximum of 50 words, describing key subjects (e.g., animals, people) and settings. If the prompt is too short, creatively expand it to approximately 50 words to establish a clear context.

Key Points:

Prompt Handling:

Short Prompts: If the prompt is less than 50 words, expand it creatively while maintaining the key subjects and settings.
Detailed Prompts: Use detailed prompts as the foundation for generating a coherent narrative.
Output Requirements:

Structure: Generate a 6-line story. Each line should refer to the main subjects and settings mentioned in the prompt.
Line Length: Each line should have a maximum of 50 words.
Interconnected Narrative: Ensure each line connects the main subjects and settings in a meaningful way, creating a cohesive story.
Content Guidelines:

Subject and Setting Reference: Each line should reference all main subjects (e.g., cat, dog) and settings from the prompt to maintain continuity. Include both the type of the subject and its name.
Logical Flow: Each line should build on the previous lines, maintaining a logical progression and deepening the narrative.
Creative Details: Add creative elements to enrich the story while ensuring each line clearly identifies the subject (by type and name) and setting.
Example:

Prompt: A cat named Whiskers met a dog named Max in a garden.

Generated Story:
In a sunny garden, a curious cat named Whiskers wandered among the blooming flowers, drawn by the scent of fresh grass.
Suddenly, Whiskers, the cat, spotted a friendly dog named Max, who was playing with a colorful ball near the garden’s edge.
Whiskers, the cat, cautiously approached Max, the dog, watching as he chased the ball and wagged his tail with joy.
Max, the dog, noticing Whiskers, the cat, paused to greet him with a cheerful bark and an inviting wag of his tail.
The cat, Whiskers, and the dog, Max, decided to explore the garden together, discovering hidden paths and shady spots perfect for play.
As the sun set, Whiskers, the cat, and Max, the dog, rested side by side, reflecting on their newfound friendship and the adventures they shared.

Output only pure text Generated Story`
};

const PLACEHOLDERS: string[] = [
  "In a faraway land, there was...",
  "Long ago, in a magical world, a story began with...",
  "In a time long past, a tale unfolded about...",
  "Once, in a land filled with wonder, there lived...",
  "A long time ago, in a realm of adventure, the story of... began."
];

export default function PollinationsChat(): JSX.Element {
  const { messages, sendUserMessage } = usePollinationsChat([SYSTEM_MESSAGE]);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [currentStoryPrompt, setCurrentStoryPrompt] = useState<string>('');
  const [storyLines, setStoryLines] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (userPrompt.trim()) {
      sendUserMessage(userPrompt);
      setCurrentStoryPrompt(userPrompt);
      setUserPrompt('');
    }
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserPrompt(e.target.value);
  };

  // Scroll to input field
  const scrollToInput = (): void => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update story lines when a new message is received
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      setStoryLines(lastMessage.content.split(/\.|\n/img)
        .map((line: string) => line.trim())
        .filter(Boolean));
      scrollToInput();
    }
  }, [messages]);

  // Get a random placeholder prompt
  const randomPlaceholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  return (
    <main>
      <form onSubmit={handleSubmit} className="bg-white/5 p-1.5 text-lg rounded-full relative w-full">
        <input
          ref={inputRef}
          type="text"
          className="text-black w-full p-3 pl-5 pr-14 bg-transparent rounded-full border-[5px] border-black/5 hover:border-black/20 focus:border-dotted outline-0 transition-all duration-500"
          placeholder={randomPlaceholder}
          value={userPrompt}
          onChange={handleInputChange}
        />
        <button
          className="absolute right-4 hover:scale-110 transition-all top-3.5 bg-slate-200 hover:bg-yellow-500 p-2 rounded-full cursor-pointer"
          type="submit"
        >
          <AiOutlineArrowDown size={25} />
        </button>
      </form>
      
      <div className="px-0 md:px-2">
        {currentStoryPrompt && (
          <h1 className="mt-8 font-bold text-2xl max-w-7xl mx-auto">Story: {currentStoryPrompt}</h1>
        )}
        {/* TODO: loading */}
        <div className="columns-1 md:columns-1 lg:columns-1 gap-6 my-8 max-w-7xl mx-auto">
          {storyLines.map((line, index) => (
            <StoryLineItem key={index} line={line} index={index} />
          ))}
        </div>
      </div>

      <footer className="py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            Example in Next.js using{" "}
            <a className="text-blue-800 hover:bg-blue-800 hover:p-1 transition-all hover:text-white" href="https://www.npmjs.com/package/@pollinations/react" title="NPM @pollinations/reaact">@pollinations/react ⌞ ⌝</a>
            {" "} made with ❤️ by{" "}
            <a
              href="https://karma.yt"
              className="text-red-700 text-bold hover:p-1 transition-all  hover:bg-red-200 hover:text-black"
              target="_blank"
            >
              Karma.yt
            </a>&nbsp;&nbsp;(
            <a
              href="https://github.com/diogo-karma/example-nextjs-pollinations-story"
              className="text-slate-600 transition-all hover:text-black p-1"
              target="_blank"
              rel="noopener noreferrer"
              title="Code on Github"
            >
              
              <AiOutlineGithub className='inline' size={22} />
              <MdArrowOutward className='inline' />
            </a>)
            
          </p>
        </div>
      </footer>

    </main>
  );
}

interface StoryLineItemProps {
  line: string;
  index: number;
}

function StoryLineItem({ line, index }: StoryLineItemProps): JSX.Element {
  return (
    <div>
      <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-1 lg:overflow-visible">
        <figure className="relative w-full h-96">
          <PollinationsImage
            className='object-cover object-center w-full h-full rounded-xl'
            height={350}
            prompt={line.trim()}
            seed={1337}
          />
          <figcaption className="absolute bottom-1 left-1 flex font-bold -translate-x-1/10 justify-between rounded-xl border border-white/50 bg-white/50 py-2 px-3 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
            Episode: {index + 1}
          </figcaption>
        </figure>
        <div>
          <figure className="max-w-screen-md mx-auto text-center">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
            </svg>
            <blockquote>
              <p className="text-2xl italic font-medium text-gray-900 dark:text-black">&quot;{line}&quot;</p>
            </blockquote>
          </figure>
        </div>
      </div>
    </div>
  );
}