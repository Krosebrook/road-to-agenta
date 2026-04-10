export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface SimulatorChoice {
  id: string;
  text: string;
  feedback: string;
  isOptimal: boolean;
}

export interface SimulatorStep {
  scenario: string;
  choices: SimulatorChoice[];
}

export interface Phase {
  id: number;
  title: string;
  points: string[];
  quiz: QuizQuestion[];
  simulator: SimulatorStep;
}
