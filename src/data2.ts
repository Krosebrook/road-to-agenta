import { Phase } from './types';

export const roadmapData2: Phase[] = [
  {
    id: 6,
    title: "Use Tools and External APIs",
    points: [
      "Learn function calling to connect external tools",
      "Integrate APIs for real-world task execution",
      "Add tools like search & webhooks",
      "Handle API inputs & outputs properly",
      "Test tool usage within full workflow"
    ],
    quiz: [
      {
        id: "q6_1",
        question: "What is 'Function Calling' in the context of LLMs?",
        options: [
          { id: "a", text: "The LLM writing Python code for the user.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "A feature where the LLM outputs structured JSON matching a predefined tool schema.", isCorrect: true, feedback: "Correct! The LLM decides *to* call the function." },
          { id: "c", text: "The LLM calling a phone number.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q6_2",
        question: "Who actually executes the API call when an agent uses a tool?",
        options: [
          { id: "a", text: "The LLM provider executes it on their servers.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "Your application code executes the API call and feeds the result back.", isCorrect: true, feedback: "Correct! You maintain control over execution." },
          { id: "c", text: "The user executes it manually.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q6_3",
        question: "Why is error handling critical when integrating tools?",
        options: [
          { id: "a", text: "Because APIs can fail, and the agent needs to know so it can retry or apologize.", isCorrect: true, feedback: "Correct! If an API 500s, the agent must be informed." },
          { id: "b", text: "Because LLMs cannot read JSON.", isCorrect: false, feedback: "Incorrect." },
          { id: "c", text: "Because tools cost too much money.", isCorrect: false, feedback: "Incorrect." }
        ]
      }
    ],
    simulator: {
      scenario: "You are giving your agent a 'SendEmail' tool. How do you define it?",
      choices: [
        { id: "c1", text: "Name: 'Email', Description: 'Sends emails.'", isOptimal: false, feedback: "Too vague. The LLM won't know what arguments to provide." },
        { id: "c2", text: "Name: 'send_email', Description: 'Sends an email. Requires recipient, subject, and body.'", isOptimal: true, feedback: "Perfect. Clear naming and strict schema definition." },
        { id: "c3", text: "Don't define it, just tell the LLM to 'send an email via SMTP'.", isOptimal: false, feedback: "The LLM cannot natively execute SMTP." }
      ]
    }
  },
  {
    id: 7,
    title: "Build Full Agent Workflow",
    points: [
      "Design flow from prompt to final output",
      "Add fallback mechanisms & error handling",
      "Use orchestration tools like LangChain/n8n",
      "Track actions for debugging & improvements",
      "Test workflows using real-world scenarios"
    ],
    quiz: [
      {
        id: "q7_1",
        question: "What is the role of an orchestration framework like LangChain or n8n?",
        options: [
          { id: "a", text: "To replace the LLM entirely.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "To wire together prompts, memory, tools, and conditional logic.", isCorrect: true, feedback: "Correct! They provide the plumbing." },
          { id: "c", text: "To design the UI of the application.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q7_2",
        question: "What is a 'fallback mechanism' in an agent workflow?",
        options: [
          { id: "a", text: "A graceful degradation path if the LLM fails or a tool errors out.", isCorrect: true, feedback: "Correct! Resilience is key." },
          { id: "b", text: "A way to make the agent run backwards.", isCorrect: false, feedback: "Incorrect." },
          { id: "c", text: "Deleting the agent's memory.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q7_3",
        question: "Why is tracking/tracing actions important?",
        options: [
          { id: "a", text: "To make the agent run faster.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "Because agents are non-deterministic; you need to see the exact chain of thought.", isCorrect: true, feedback: "Correct! Observability is mandatory." },
          { id: "c", text: "To increase the token limit.", isCorrect: false, feedback: "Incorrect." }
        ]
      }
    ],
    simulator: {
      scenario: "Your agent is supposed to book flights. Sometimes the Flight API is down.",
      choices: [
        { id: "c1", text: "Let the application crash so the user knows it's broken.", isOptimal: false, feedback: "Terrible UX." },
        { id: "c2", text: "Catch the API error, feed an 'API_UNAVAILABLE' message back, and let the LLM apologize.", isOptimal: true, feedback: "Excellent! You are treating the error as an observation." },
        { id: "c3", text: "Hardcode a fake flight booking.", isOptimal: false, feedback: "Deceptive and breaks trust." }
      ]
    }
  },
  {
    id: 8,
    title: "Create Multi-Agent Systems",
    points: [
      "Assign roles like planner, executor, reviewer",
      "Enable communication between multiple agents",
      "Use protocols like MCP/A2A frameworks",
      "Share memory across agents for coordination",
      "Test collaborative decision-making across agents"
    ],
    quiz: [
      {
        id: "q8_1",
        question: "Why use a Multi-Agent System instead of one massive agent?",
        options: [
          { id: "a", text: "Separation of concerns: specialized agents perform better at narrow tasks.", isCorrect: true, feedback: "Correct! Narrowly scoped prompts yield higher quality." },
          { id: "b", text: "It reduces API costs.", isCorrect: false, feedback: "Incorrect. It usually increases costs." },
          { id: "c", text: "It is the only way to use tools.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q8_2",
        question: "What is a common multi-agent pattern for high-quality output?",
        options: [
          { id: "a", text: "Actor-Critic (One agent generates, another reviews and critiques).", isCorrect: true, feedback: "Correct! This self-reflection loop improves quality." },
          { id: "b", text: "Random selection.", isCorrect: false, feedback: "Incorrect." },
          { id: "c", text: "Infinite loop generation.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q8_3",
        question: "How do multiple agents typically coordinate?",
        options: [
          { id: "a", text: "They read each other's minds.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "Through shared memory/state or direct message passing.", isCorrect: true, feedback: "Correct! They need a protocol." },
          { id: "c", text: "By sharing the exact same system prompt.", isCorrect: false, feedback: "Incorrect." }
        ]
      }
    ],
    simulator: {
      scenario: "You are building an AI software development team. How do you structure it?",
      choices: [
        { id: "c1", text: "Create one agent named 'SuperDev' to do everything.", isOptimal: false, feedback: "The agent will lose focus and quality will degrade." },
        { id: "c2", text: "Create a 'Planner', a 'Coder', and a 'QA' agent.", isOptimal: true, feedback: "Perfect! This is a robust multi-agent architecture." },
        { id: "c3", text: "Create 10 identical agents.", isOptimal: false, feedback: "Redundant and chaotic." }
      ]
    }
  },
  {
    id: 9,
    title: "Deploy and Monitor Agents",
    points: [
      "Deploy agents using platforms like Vercel",
      "Monitor tokens, latency, and system errors",
      "Implement safety checks and rate limits",
      "Set up logs, alerts, & metrics",
      "Ensure uptime and consistent system performance"
    ],
    quiz: [
      {
        id: "q9_1",
        question: "Why is token monitoring critical in production?",
        options: [
          { id: "a", text: "To ensure the agent doesn't get bored.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "Because infinite agent loops can rack up massive API bills very quickly.", isCorrect: true, feedback: "Correct! Agents can run away with your credit card." },
          { id: "c", text: "To speed up the internet connection.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q9_2",
        question: "What is a 'Human-in-the-loop' (HITL) safety check?",
        options: [
          { id: "a", text: "The agent requires human approval before taking high-risk actions.", isCorrect: true, feedback: "Correct! HITL is essential for safe deployment." },
          { id: "b", text: "A human typing the prompt for the agent.", isCorrect: false, feedback: "Incorrect." },
          { id: "c", text: "The agent pretending to be a human.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q9_3",
        question: "Which metric is unique to monitoring LLM agents compared to traditional web apps?",
        options: [
          { id: "a", text: "HTTP 500 errors.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "Tool selection accuracy and hallucination rates.", isCorrect: true, feedback: "Correct! You must monitor the *quality* of decisions." },
          { id: "c", text: "Page load time.", isCorrect: false, feedback: "Incorrect." }
        ]
      }
    ],
    simulator: {
      scenario: "Your agent has access to a Stripe API tool to issue refunds. How do you deploy this safely?",
      choices: [
        { id: "c1", text: "Deploy it and let it run autonomously.", isOptimal: false, feedback: "Extremely dangerous. A hallucination could drain your bank account." },
        { id: "c2", text: "Implement a Human-in-the-Loop step for approval.", isOptimal: true, feedback: "Excellent. You maintain efficiency while ensuring safety." },
        { id: "c3", text: "Remove the tool entirely.", isOptimal: false, feedback: "Safe, but defeats the purpose." }
      ]
    }
  },
  {
    id: 10,
    title: "Join the Builder Ecosystem",
    points: [
      "Contribute to open-source agent development frameworks",
      "Benchmark agents on real-world performance tasks",
      "Stay updated with latest agent ecosystem trends"
    ],
    quiz: [
      {
        id: "q10_1",
        question: "What is the purpose of benchmarking an agent?",
        options: [
          { id: "a", text: "To evaluate its performance on standardized tasks.", isCorrect: true, feedback: "Correct! Benchmarks prove capability." },
          { id: "b", text: "To make it run faster.", isCorrect: false, feedback: "Incorrect." },
          { id: "c", text: "To generate marketing copy.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q10_2",
        question: "Why is the open-source ecosystem vital for agent development?",
        options: [
          { id: "a", text: "It provides free APIs.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "It drives rapid innovation in frameworks, tooling, and local models.", isCorrect: true, feedback: "Correct! The community moves fast." },
          { id: "c", text: "It guarantees your agent will be secure.", isCorrect: false, feedback: "Incorrect." }
        ]
      },
      {
        id: "q10_3",
        question: "What is a common way to stay updated in the AI agent space?",
        options: [
          { id: "a", text: "Reading textbooks from 2015.", isCorrect: false, feedback: "Incorrect." },
          { id: "b", text: "Following research papers, GitHub repositories, and builder communities.", isCorrect: true, feedback: "Correct! Real-time platforms are key." },
          { id: "c", text: "Ignoring updates once deployed.", isCorrect: false, feedback: "Incorrect." }
        ]
      }
    ],
    simulator: {
      scenario: "You've successfully built and deployed your agent. What is your next move?",
      choices: [
        { id: "c1", text: "Consider the project finished.", isOptimal: false, feedback: "The AI landscape changes weekly. Your agent will become obsolete." },
        { id: "c2", text: "Open-source generic parts, write a blog post, and track new models.", isOptimal: true, feedback: "Perfect! Contributing back builds reputation." },
        { id: "c3", text: "Keep everything a strict secret.", isOptimal: false, feedback: "Sharing basic architecture usually yields more value through feedback." }
      ]
    }
  }
];
