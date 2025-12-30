import React, { useState } from 'react';
import { SectionTitle, ActionButton } from '../components/Shared';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which component intercepts network traffic in a Service Mesh?",
    options: ["API Gateway", "Sidecar Proxy", "Database", "DNS Server"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which plane is responsible for pushing configuration policies?",
    options: ["Data Plane", "Control Plane", "Air Plane", "User Plane"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Service Mesh primarily manages which type of traffic?",
    options: ["North-South (External)", "East-West (Internal)", "Bluetooth", "USB"],
    correctAnswer: 1
  }
];

export const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const getScore = () => {
    let score = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
       <SectionTitle 
          title="Knowledge Check" 
          subtitle="Test your understanding of Service Mesh concepts."
        />

        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {QUESTIONS.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                const isSelected = answers[q.id] !== undefined;
                
                return (
                    <div key={q.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-bold mb-4 flex items-start gap-3">
                            <span className="bg-slate-700 text-slate-300 w-6 h-6 rounded flex items-center justify-center text-sm">{idx + 1}</span>
                            {q.question}
                        </h3>
                        <div className="space-y-2">
                            {q.options.map((opt, optIdx) => (
                                <button
                                    key={optIdx}
                                    onClick={() => handleSelect(q.id, optIdx)}
                                    className={`
                                        w-full text-left p-3 rounded-lg border transition-all duration-200 flex justify-between items-center
                                        ${answers[q.id] === optIdx 
                                            ? 'bg-indigo-900/50 border-indigo-500 text-indigo-100' 
                                            : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'}
                                        ${submitted && optIdx === q.correctAnswer ? '!bg-green-900/50 !border-green-500 !text-green-100' : ''}
                                        ${submitted && answers[q.id] === optIdx && optIdx !== q.correctAnswer ? '!bg-red-900/50 !border-red-500 !text-red-100' : ''}
                                    `}
                                >
                                    {opt}
                                    {submitted && optIdx === q.correctAnswer && <CheckCircle size={18} className="text-green-400" />}
                                    {submitted && answers[q.id] === optIdx && optIdx !== q.correctAnswer && <XCircle size={18} className="text-red-400" />}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center">
            {submitted ? (
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-400">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-xl text-white">Score: {getScore()} / {QUESTIONS.length}</p>
                        <p className="text-slate-400 text-sm">
                            {getScore() === 3 ? "Perfect! You're a Mesh Master." : "Good effort! Review the tabs to improve."}
                        </p>
                    </div>
                    <button 
                        onClick={() => { setSubmitted(false); setAnswers({}); }}
                        className="ml-4 text-slate-400 hover:text-white underline text-sm"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <div className="w-full flex justify-end">
                    <ActionButton 
                        onClick={() => setSubmitted(true)}
                        disabled={Object.keys(answers).length < QUESTIONS.length}
                    >
                        Submit Answers
                    </ActionButton>
                </div>
            )}
        </div>
    </div>
  );
};
