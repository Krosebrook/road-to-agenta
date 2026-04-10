import { Phase } from './types';
import { roadmapData2 } from './data2';

const roadmapData1: Phase[] = [
  {
    id: 1,
    title: "Understand Agentic AI Basics",
    points: [
      "Learn what AI agents actually are",
      "Compare agents, chatbots, & simple scripts",
      "Understand automation versus autonomy differences clearly",
      "Explore real-world practical agent use cases",
      "Learn how LLMs power agent decisions"
    ],
    quiz: [
      {
        id: "q1_1",
        question: "What is the primary difference between a traditional chatbot and an AI agent?",
        options: [
          { id: "a", text: "Chatbots use LLMs, agents do not.", isCorrect: false, feedback: "Incorrect. Both can use LLMs." },
          { id: "b", text: "Agents can autonomously plan and execute actions using tools.", isCorrect: true, feedback: "Correct! Autonomy and tool use are key differentiators." },
          { id: "c", text: "Chatbots are faster than agents.", isCorrect: false, feedback: "Incorrect. Speed depends on implementation." }
        ]
      },
      {
        id: "q1_2",
        question: "Which of the following best describes 'autonomy' in the context of AI agents?",
        options: [
          { id: "a", text: "Running on a scheduled cron job.", isCorrect: false, feedback: "Incorrect. That is automation, not autonomy." },
          { id: "b", text: "Generating text without human input.", isCorrect: false, feedback: "Incorrect. Standard LLMs do this." },
          { id: "c", text: "Making decisions on how to achieve a goal without step-by-step human instructions.", isCorrect: true, feedback: "Correct! Agents determine the 'how' based on the 'what'." }
        ]
      },
      {
        id: "q1_3",
        question: "How do LLMs function within an agentic system?",
        options: [
          { id: "a", text: "As the reasoning engine or 'brain'.", isCorrect: true, feedback: "Correct! The LLM processes context and decides the next action." },
          { id: "b", text: "Only as a text formatting tool.", isCorrect: false, feedback: "Incorrect. They do much more." },
          { id: "c", text: "As the long-term storage database.", isCorrect: false, feedback: "Incorrect. Vector DBs handle storage." }
        ]
      }
    ],
    simulator: {
      scenario: "You want to build a system to handle customer support emails. Which approach sets you on the path to building an Agent?",
      choices: [
        { id: "c1", text: "Create a script that auto-replies 'We received your email'.", isOptimal: false, feedback: "This is simple automation. It lacks reasoning." },
        { id: "c2", text: "Connect an LLM to read the email, determine the issue, and use an API tool to process it.", isOptimal: true, feedback: "Excellent! You are giving the LLM a goal, tools, and autonomy." },
        { id: "c3", text: "Use an LLM to summarize all emails at the end of the day.", isOptimal: false, feedback: "This is batch processing, not an autonomous agent." }
      ]
    }
  },
  {
    id: 2,
    title: "Learn Core Agent Components",
    points: [
      "Understand LLM as central decision-making brain",
      "Learn prompts as structured instruction inputs",
      "Explore tools as actions agents can perform",
      "Understand memory systems for storing information",
      "Learn environment where agents operate dynamically"
    ],
    quiz: [
      {
        id: "q2_1",
        question: "Which component allows an agent to interact with the outside world?",
        options: [
          { id: "a", text: "Memory", isCorrect: false, feedback: "Incorrect. Memory stores state." },
          { id: "b", text: "Tools", isCorrect: true, feedback: "Correct! Tools (APIs, search) are the agent's 'hands'." },
          { id: "c", text: "System Prompt", isCorrect: false, feedback: "Incorrect. The prompt is the instruction set." }
        ]
      },
      {
        id: "q2_2",
        question: "What is the purpose of the 'Environment' in agent architecture?",
        options: [
          { id: "a", text: "The physical server hosting the agent.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "The context and systems the agent observes and acts upon.", isCorrect: true, feedback: "Correct! The environment is what the agent interacts with." },
          { id: "c", text: "The programming language used.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q2_3",
        question: "Why is memory crucial for complex agent tasks?",
        options: [
          { id: "a", text: "It makes the LLM generate text faster.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "It allows the agent to maintain context over multiple steps.", isCorrect: true, feedback: "Correct! Without memory, agents are amnesiacs." },
          { id: "c", text: "It replaces the need for an LLM.", isCorrect: false, feedback: "Incorrect." }
        ]
      }
    ],
    simulator: {
      scenario: "Your agent needs to research competitors. What core components must you assemble?",
      choices: [
        { id: "c1", text: "An LLM and a massive static text file of competitor data.", isOptimal: false, feedback: "This is just RAG. It can't research *new* information." },
        { id: "c2", text: "An LLM, a Web Search Tool, and a Memory system.", isOptimal: true, feedback: "Perfect! The LLM reasons, the Tool gathers data, and Memory tracks progress." },
        { id: "c3", text: "Just a really large, advanced LLM.", isOptimal: false, feedback: "Even the best LLM suffers from knowledge cutoffs without tools." }
      ]
    }
  },
  {
    id: 3,
    title: "Learn Prompting for Agents",
    points: [
      "Understand system prompts versus user prompts",
      "Create few-shot examples for better outputs",
      "Use role-based prompting for structured responses",
      "Define rules and expected output formats",
      "Iterate prompts continuously until outputs improve"
    ],
    quiz: [
      {
        id: "q3_1",
        question: "What is the primary function of a System Prompt?",
        options: [
          { id: "a", text: "To ask the agent a specific question.", isCorrect: false, feedback: "Incorrect. That is a User Prompt." },
          { id: "b", text: "To define the agent's persona, rules, and constraints.", isCorrect: true, feedback: "Correct! It sets the foundational behavior." },
          { id: "c", text: "To store the conversation history.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q3_2",
        question: "Why are 'few-shot examples' useful in agent prompting?",
        options: [
          { id: "a", text: "They show the agent exactly how to format its reasoning and tool calls.", isCorrect: true, feedback: "Correct! Examples drastically improve reliability." },
          { id: "b", text: "They reduce the token cost of the prompt.", isCorrect: false, feedback: "Incorrect. Examples increase token usage." },
          { id: "c", text: "They prevent the agent from using tools.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q3_3",
        question: "Which of the following is a best practice for agent prompts?",
        options: [
          { id: "a", text: "Keep it as short and vague as possible.", isCorrect: false, feedback: "Incorrect. Agents need strict constraints." },
          { id: "b", text: "Explicitly define the expected output format (e.g., JSON).", isCorrect: true, feedback: "Correct! Structured output is essential." },
          { id: "c", text: "Never update the prompt once it works once.", isCorrect: false, feedback: "Incorrect. Prompt iteration is continuous." }
        ]
      }
    ],
    simulator: {
      scenario: "You are writing the system prompt for a Financial Advisor Agent. Which approach is best?",
      choices: [
        { id: "c1", text: "'You are a helpful financial advisor. Answer questions about money.'", isOptimal: false, feedback: "Too vague. The agent will likely hallucinate." },
        { id: "c2", text: "'You are an expert. ALWAYS respond in valid JSON. NEVER recommend specific stocks. Use the MarketData tool.'", isOptimal: true, feedback: "Excellent. You defined the role, format, constraints, and tools." },
        { id: "c3", text: "'Here are 50 pages of financial regulations. Read them and answer.'", isOptimal: false, feedback: "Context stuffing leads to poor instruction following." }
      ]
    }
  },
  {
    id: 4,
    title: "Build Your First Simple Agent",
    points: [
      "Choose one simple problem or use case",
      "Use GPT/Claude through simple interfaces",
      "Write clear & structured system instructions",
      "Test with user inputs & evaluate outputs",
      "Refine prompts until agent performs reliably"
    ],
    quiz: [
      {
        id: "q4_1",
        question: "When building your first agent, what is the recommended scope?",
        options: [
          { id: "a", text: "A system that can replace an entire department.", isCorrect: false, feedback: "Incorrect. Too complex." },
          { id: "b", text: "A single, narrow use case with clear success criteria.", isCorrect: true, feedback: "Correct! Start small to learn." },
          { id: "c", text: "An agent with at least 20 different tools.", isCorrect: false, feedback: "Incorrect. Too many tools will confuse it." }
        ]
      },
      {
        id: "q4_2",
        question: "What is the most important step after writing your initial prompt?",
        options: [
          { id: "a", text: "Deploying it to production immediately.", isCorrect: false, feedback: "Incorrect. You must test first." },
          { id: "b", text: "Testing with edge-case user inputs and evaluating the outputs.", isCorrect: true, feedback: "Correct! Evaluation exposes flaws." },
          { id: "c", text: "Adding more tools.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q4_3",
        question: "If your simple agent keeps hallucinating a tool that doesn't exist, what should you do?",
        options: [
          { id: "a", text: "Build the tool it hallucinated.", isCorrect: false, feedback: "Incorrect. Don't let the LLM dictate architecture." },
          { id: "b", text: "Refine the system prompt to explicitly list allowed tools and forbid others.", isCorrect: true, feedback: "Correct! Strict negative constraints help." },
          { id: "c", text: "Switch to a smaller model.", isCorrect: false, feedback: "Incorrect." }
        ]
      }
    ],
    simulator: {
      scenario: "You want to build your first agent. What is your starting point?",
      choices: [
        { id: "c1", text: "Build an 'AGI' that can code, design, and market a product.", isOptimal: false, feedback: "Scope creep! You will fail because of context collapse." },
        { id: "c2", text: "Build a 'Weather Recommender' with one tool and a clear goal.", isOptimal: true, feedback: "Perfect. It has a single goal and clear success criteria." },
        { id: "c3", text: "Spend 3 weeks setting up a Kubernetes cluster.", isOptimal: false, feedback: "Premature optimization." }
      ]
    }
  },
  {
    id: 5,
    title: "Add Memory to Your Agent",
    points: [
      "Use short-term memory for recent interactions",
      "Implement long-term memory using vector databases",
      "Store past conversations & user interactions",
      "Retrieve relevant data based on user queries",
      "Continuously update memory after each interaction"
    ],
    quiz: [
      {
        id: "q5_1",
        question: "What is the primary use of a Vector Database in agent architecture?",
        options: [
          { id: "a", text: "To store the agent's source code.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "To provide long-term memory by storing and retrieving semantically similar past interactions.", isCorrect: true, feedback: "Correct! Vector DBs allow semantic search." },
          { id: "c", text: "To execute mathematical calculations.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q5_2",
        question: "What represents 'short-term memory' for an LLM agent?",
        options: [
          { id: "a", text: "The current conversation history passed in the context window.", isCorrect: true, feedback: "Correct! The context window holds the immediate state." },
          { id: "b", text: "A SQL database.", isCorrect: false, feedback: "Incorrect." },
          { id: "c", text: "The model's pre-training weights.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q5_3",
        question: "Why can't we just put the entire user history into short-term memory?",
        options: [
          { id: "a", text: "Because LLMs have context window limits and it becomes too expensive.", isCorrect: true, feedback: "Correct! Context windows are finite." },
          { id: "b", text: "Because the LLM will delete it.", isCorrect: false, feedback: "Incorrect." },
          { id: "c", text: "Because short-term memory only accepts numbers.", isCorrect: false, feedback: "Incorrect." }
        ]
      }
    ],
    simulator: {
      scenario: "Your agent needs to remember that a user is a 'Premium Tier' subscriber from a chat 3 months ago.",
      choices: [
        { id: "c1", text: "Pass the entire 3-month chat history into every single prompt.", isOptimal: false, feedback: "This will exceed the context window and cost a fortune." },
        { id: "c2", text: "Extract key user facts and store them in a long-term database, retrieving them when needed.", isOptimal: true, feedback: "Correct! Summarizing and storing state is scalable." },
        { id: "c3", text: "Train a custom LLM from scratch on the user's chat history.", isOptimal: false, feedback: "Massively over-engineered." }
      ]
    }
  }
];

export const roadmapData: Phase[] = [...roadmapData1, ...roadmapData2];
