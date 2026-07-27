import React, { useEffect, useRef, useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";
import { 
  Plus, MessageSquare, Trash2, Settings, ChevronDown, 
  Paperclip, Target, Brain, FileText, Send, User, 
  Stethoscope, Sparkles 
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content?: string;
  type?: "text" | "mcq_block" | "beta_blockers_ai_msg_2" | "beta_blockers_ai_msg_4";
};

const BETA_BLOCKERS_CHAT: Message[] = [
  { id: '1', role: 'user', content: 'Explain the mechanism of action of beta-blockers and their use in heart failure', type: 'text' },
  { id: '2', role: 'ai', type: 'beta_blockers_ai_msg_2' },
  { id: '3', role: 'user', content: 'Give me a mnemonic for remembering which beta-blockers are cardioselective', type: 'text' },
  { id: '4', role: 'ai', type: 'beta_blockers_ai_msg_4' },
  { id: '5', role: 'user', content: 'Create a 5-question MCQ quiz on beta-blockers', type: 'text' },
  { id: '6', role: 'ai', type: 'mcq_block' }
];

const CARDIAC_CYCLE_CHAT: Message[] = [
  { id: '1', role: 'user', content: 'Explain cardiac cycle', type: 'text' },
  { id: '2', role: 'ai', content: 'The cardiac cycle consists of two main phases: **systole** (contraction and emptying) and **diastole** (relaxation and filling).\n\n**Key Events:**\n- Ventricular filling (mid-to-late diastole)\n- Isovolumetric contraction (early systole)\n- Ventricular ejection (mid systole)\n- Isovolumetric relaxation (early diastole)', type: 'text' }
];

const PHARM_MCQ_CHAT: Message[] = [
  { id: '1', role: 'user', content: 'Pharmacology MCQ help', type: 'text' },
  { id: '2', role: 'ai', content: 'Sure, I can help with Pharmacology MCQs. What specific topic are you struggling with? We can cover pharmacokinetics, autonomic nervous system, or specific drug classes.', type: 'text' }
];

const CRANIAL_NERVES_CHAT: Message[] = [
  { id: '1', role: 'user', content: 'Mnemonic for cranial nerves', type: 'text' },
  { id: '2', role: 'ai', content: 'Here is a classic mnemonic for the 12 cranial nerves:\n\n**O**h **O**h **O**h **T**o **T**ouch **A**nd **F**eel **V**ery **G**ood **V**elvet, **A**h **H**eaven!\n\n- Olfactory (I)\n- Optic (II)\n- Oculomotor (III)\n- Trochlear (IV)\n- Trigeminal (V)\n- Abducens (VI)\n- Facial (VII)\n- Vestibulocochlear (VIII)\n- Glossopharyngeal (IX)\n- Vagus (X)\n- Accessory (XI)\n- Hypoglossal (XII)', type: 'text' }
];

const PATH_MI_CHAT: Message[] = [
  { id: '1', role: 'user', content: 'Pathology of MI', type: 'text' },
  { id: '2', role: 'ai', content: 'Myocardial Infarction (MI) pathology progresses in distinct timeframes:\n\n- **0-4 hours:** Minimal to no gross/microscopic changes.\n- **4-24 hours:** Dark mottling grossly; early coagulative necrosis microscopically.\n- **1-3 days:** Yellow pallor; extensive coagulative necrosis with neutrophils.\n- **3-14 days:** Hyperemic border, central yellow softening; macrophages remove dead tissue.\n- **2 weeks - several months:** Gray-white scar; dense collagenous tissue.', type: 'text' }
];

const ANS_CHAT: Message[] = [
  { id: '1', role: 'user', content: 'Autonomic nervous system', type: 'text' },
  { id: '2', role: 'ai', content: 'The ANS is divided into two main branches:\n\n**Sympathetic (Fight or Flight)**\n- Receptors: Alpha & Beta\n- Neurotransmitters: Norepinephrine, Epinephrine\n\n**Parasympathetic (Rest and Digest)**\n- Receptors: Muscarinic & Nicotinic\n- Neurotransmitter: Acetylcholine', type: 'text' }
];

const CHAT_MAP: Record<string, Message[]> = {
  'beta-blockers': BETA_BLOCKERS_CHAT,
  'cardiac-cycle': CARDIAC_CYCLE_CHAT,
  'pharm-mcq': PHARM_MCQ_CHAT,
  'cranial-nerves': CRANIAL_NERVES_CHAT,
  'path-mi': PATH_MI_CHAT,
  'ans': ANS_CHAT
};

const RESPONSES = {
  default: "That's a great medical question! Let me break it down for you...\n\n**Key Points:**\n- This concept is tested frequently in MBBS exams\n- Remember to review related pathophysiology\n- Practice with our MCQ section for reinforcement\n\n*Reference: Harrison's Principles of Internal Medicine, 21st Edition*",
  mnemonic: "Here's a powerful mnemonic for you: **DUMBBELS** — Diarrhea, Urination, Miosis, Bradycardia, Bronchospasm, Emesis, Lacrimation, Salivation. Perfect for remembering cholinergic effects!",
  mcq: "Here's a practice MCQ:\n\n**Q:** A patient on propranolol develops wheezing. What is the mechanism?\n- A) Direct bronchoconstriction\n- B) β2 receptor blockade → unopposed bronchoconstriction\n- C) Mast cell degranulation\n- D) Histamine release\n\n*Correct answer: B*",
  anatomy: "The brachial plexus is formed from roots C5-T1. Remember **MAUR** (Musculocutaneous, Axillary, Ulnar, Radial) for the terminal branches. The trunk divisions form from roots, and each trunk divides into anterior and posterior divisions.",
};

function parseMarkdown(text: string) {
  const lines = text.split('\n');
  let inList = false;
  const elements: JSX.Element[] = [];
  let listItems: JSX.Element[] = [];

  const processInline = (str: string, keyPrefix: string) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${keyPrefix}-${index}`} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={`${keyPrefix}-${index}`}>{part.slice(1, -1)}</em>;
      }
      return <span key={`${keyPrefix}-${index}`}>{part}</span>;
    });
  };

  lines.forEach((line, i) => {
    if (line.trim().startsWith('- ')) {
      inList = true;
      listItems.push(
        <li key={i} className="flex items-start gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-2 flex-shrink-0"></div>
          <span className="flex-1">{processInline(line.trim().substring(2), `li-${i}`)}</span>
        </li>
      );
    } else {
      if (inList) {
        elements.push(<ul key={`ul-${i}`} className="mb-4 space-y-1">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      if (line.trim() !== '') {
        elements.push(
          <p key={i} className="mb-4 text-slate-700 dark:text-slate-300">
            {processInline(line, `p-${i}`)}
          </p>
        );
      }
    }
  });

  if (inList) {
    elements.push(<ul key={`ul-end`} className="mb-4 space-y-1">{listItems}</ul>);
  }

  return <>{elements}</>;
}

const MCQ_DATA = [
  {
    question: "A 62-year-old male with a history of asthma and recent myocardial infarction requires beta-blocker therapy. Which of the following agents is most appropriate?",
    options: ['Propranolol', 'Nadolol', 'Metoprolol', 'Carvedilol'],
    correctIndex: 2,
    explanation: "Metoprolol is a β1-selective blocker, making it safer for patients with reactive airway disease like asthma, as it avoids β2-mediated bronchoconstriction."
  },
  {
    question: "Which of the following beta-blockers has additional alpha-1 receptor blocking activity, making it particularly useful in hypertensive emergencies?",
    options: ['Atenolol', 'Labetalol', 'Esmolol', 'Bisoprolol'],
    correctIndex: 1,
    explanation: "Labetalol possesses both non-selective β-blocking and α1-blocking activity, allowing for rapid reduction of blood pressure without reflex tachycardia."
  },
  {
    question: "Which unique side effect is commonly associated with non-selective beta-blockers like propranolol due to their high lipophilicity?",
    options: ['Peripheral edema', 'Vivid dreams / Nightmares', 'Gingival hyperplasia', 'Dry cough'],
    correctIndex: 1,
    explanation: "Propranolol is highly lipophilic and crosses the blood-brain barrier easily, which frequently causes CNS side effects such as vivid dreams and nightmares."
  }
];

function MCQQuiz() {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="flex-1 text-[15px] leading-relaxed w-full">
      <p className="text-slate-700 dark:text-slate-300 mb-6">
        Here is a targeted quiz to test your knowledge. Take your time to review the options before revealing the answers.
      </p>
      
      <div className="space-y-5">
        {MCQ_DATA.map((item, qIdx) => (
          <div key={qIdx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden transition-all duration-300 w-full">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h5 className="font-semibold text-slate-800 dark:text-slate-100 text-[15px] leading-snug">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm mr-3 border border-blue-100 dark:border-blue-800/50">
                  Q{qIdx + 1}
                </span>
                {item.question}
              </h5>
            </div>
            <div className="p-4 space-y-2 bg-slate-50/50 dark:bg-slate-900/20">
              {item.options.map((opt, i) => {
                const isCorrect = i === item.correctIndex;
                const showAsCorrect = showAnswers && isCorrect;
                const showAsWrong = showAnswers && !isCorrect;

                return (
                  <label 
                    key={i} 
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      showAnswers ? (isCorrect ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20' : 'border-red-200 bg-red-50/30 dark:bg-red-900/10') :
                      'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer'
                    }`}
                  >
                    <div className={`relative flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0 ${
                      showAsCorrect ? 'border-green-500 bg-green-500' :
                      showAsWrong ? 'border-red-300 dark:border-red-700' :
                      'border-slate-300 dark:border-slate-600'
                    }`}>
                      <input type="radio" name={`q${qIdx}`} className="opacity-0 absolute inset-0 cursor-pointer" disabled={showAnswers} />
                      {showAsCorrect && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className={`text-sm font-medium ${
                      showAsCorrect ? 'text-green-800 dark:text-green-300' :
                      showAsWrong ? 'text-red-500 dark:text-red-400 line-through opacity-70' :
                      'text-slate-700 dark:text-slate-300'
                    }`}>
                      <span className="text-slate-400 dark:text-slate-500 mr-2">{['A', 'B', 'C', 'D'][i]}.</span> {opt}
                    </span>
                  </label>
                );
              })}
              
              <div className={`grid transition-all duration-300 ease-in-out ${showAnswers ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
                    <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
                      <strong>Explanation:</strong> {item.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => setShowAnswers(!showAnswers)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Target className="w-4 h-4" />
          {showAnswers ? "Hide Answers" : "Reveal Answers & Explanations"}
        </button>
      </div>
    </div>
  );
}

const renderBetaBlockersMsg2 = () => (
  <div className="flex-1 text-[15px] leading-relaxed">
    <p className="text-slate-700 dark:text-slate-300 mb-5">
      Beta-blockers are a cornerstone in cardiovascular pharmacology. Their use in heart failure represents a classic paradigm shift from being considered contraindicated to becoming a foundational mortality-reducing therapy.
    </p>
    
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-2.5 uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          Mechanism of Action
        </h4>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
          They competitively block <strong className="text-blue-700 dark:text-blue-400 font-semibold">β1 and β2 adrenergic receptors</strong>. This leads to a reduction in heart rate (negative chronotropy), contractility (negative inotropy), and systemic blood pressure via decreased renin release from the kidneys.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-2.5 uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
          The Heart Failure Paradox
        </h4>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
          Initially, they can transiently worsen heart failure symptoms due to decreased contractility. However, long-term use inhibits the chronic sympathetic overdrive (catecholamine toxicity), leading to <strong className="text-slate-800 dark:text-slate-200 font-semibold">decreased cardiac remodeling</strong>, up-regulation of β-receptors, and ultimately improved ejection fraction (EF).
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-3 uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          Key Drugs (Evidence-Based in HF)
        </h4>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0"></div>
            <span><strong className="text-slate-800 dark:text-slate-200">Metoprolol succinate</strong> (Extended release, not tartrate!)</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0"></div>
            <span><strong className="text-slate-800 dark:text-slate-200">Carvedilol</strong> (Non-selective, also blocks α1 receptors)</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0"></div>
            <span><strong className="text-slate-800 dark:text-slate-200">Bisoprolol</strong> (Highly β1 selective)</span>
          </li>
        </ul>
        <div className="mt-4 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            Mnemonic: Think of the news network <strong className="text-slate-700 dark:text-slate-300">"CBS"</strong> (Carvedilol, Bisoprolol, Succinate)
          </p>
        </div>
      </div>
    </div>

    <div className="mt-6 flex items-start gap-3 bg-blue-50/80 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/40">
      <div className="p-1.5 bg-white dark:bg-blue-800/50 rounded-lg shadow-sm border border-blue-100 dark:border-blue-700/50 flex-shrink-0">
        <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h5 className="text-sm font-bold text-blue-900 dark:text-blue-300 tracking-wide uppercase mb-1">Clinical Pearl</h5>
        <p className="text-sm text-blue-800 dark:text-blue-200/80 leading-relaxed">When initiating beta-blockers in heart failure, always start <strong>LOW</strong> and go <strong>SLOW</strong>. Ensure the patient is euvolemic (no signs of active fluid overload) before starting.</p>
      </div>
    </div>
    
    <div className="mt-5 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-mono bg-white/50 dark:bg-slate-900/30 inline-flex px-3 py-1.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
      <FileText className="w-3 h-3" />
      Reference: Harrison's Principles of Internal Medicine 21e, Chapter 254
    </div>
  </div>
);

const renderBetaBlockersMsg4 = () => (
  <div className="flex-1 text-[15px] leading-relaxed">
    <p className="text-slate-700 dark:text-slate-300 mb-5">
      A very common and reliable mnemonic for cardioselective (β1 selective) blockers is <strong className="text-blue-700 dark:text-blue-400">"ABEM"</strong> or interpreting by the first letter of the generic name.
    </p>
    
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm mb-5">
      <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
        <div className="p-3 font-semibold text-sm text-slate-800 dark:text-slate-200 text-center border-r border-slate-200 dark:border-slate-700">Cardioselective (β1)</div>
        <div className="p-3 font-semibold text-sm text-slate-800 dark:text-slate-200 text-center">Non-selective (β1 + β2)</div>
      </div>
      <div className="grid grid-cols-2 text-sm">
        <div className="p-4 border-r border-slate-200 dark:border-slate-700 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">A</span> 
            <span className="text-slate-700 dark:text-slate-300">Atenolol</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">B</span> 
            <span className="text-slate-700 dark:text-slate-300">Bisoprolol</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">E</span> 
            <span className="text-slate-700 dark:text-slate-300">Esmolol</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">M</span> 
            <span className="text-slate-700 dark:text-slate-300">Metoprolol</span>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">P</span> 
            <span className="text-slate-600 dark:text-slate-400">Propranolol</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">C</span> 
            <span className="text-slate-600 dark:text-slate-400">Carvedilol <span className="text-xs text-slate-400">(+α1)</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">L</span> 
            <span className="text-slate-600 dark:text-slate-400">Labetalol <span className="text-xs text-slate-400">(+α1)</span></span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="flex gap-3 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/50 text-sm">
      <Brain className="w-5 h-5 text-indigo-500 flex-shrink-0" />
      <div>
        <p className="text-slate-700 dark:text-slate-300">
          <strong>Rule of thumb:</strong> Drugs starting with letters <strong className="text-slate-900 dark:text-white">A through M</strong> are generally cardioselective. Letters <strong className="text-slate-900 dark:text-white">N through Z</strong> are non-selective.
        </p>
      </div>
    </div>
  </div>
);


export function AIDoubtSolver() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(BETA_BLOCKERS_CHAT);
  const [activeChatId, setActiveChatId] = useState<string>('beta-blockers');
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const switchChat = (chatId: string) => {
    setActiveChatId(chatId);
    setMessages(CHAT_MAP[chatId] || []);
  };

  const startNewChat = () => {
    setActiveChatId('new');
    setMessages([]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let aiContent = RESPONSES.default;
      const lowerInput = userMsg.content!.toLowerCase();
      if (lowerInput.includes('mnemonic')) {
        aiContent = RESPONSES.mnemonic;
      } else if (lowerInput.includes('mcq') || lowerInput.includes('quiz')) {
        aiContent = RESPONSES.mcq;
      } else if (lowerInput.includes('anatomy') || lowerInput.includes('brachial')) {
        aiContent = RESPONSES.anatomy;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiContent,
        type: 'text'
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppLayout activePage="ai-solver">
      <div className="flex h-full bg-white dark:bg-slate-950 overflow-hidden font-['Inter']">
        {/* Chat History Sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-col h-full hidden md:flex">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <button onClick={startNewChat} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 px-3 tracking-wider uppercase">Today</h3>
              <div className="space-y-1">
                {[
                  { id: 'cardiac-cycle', title: 'Explain cardiac cycle' },
                  { id: 'pharm-mcq', title: 'Pharmacology MCQ help' },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => switchChat(item.id)}
                    className={`w-full text-left flex items-start gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeChatId === item.id 
                        ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${activeChatId === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className={`text-sm truncate ${activeChatId === item.id ? 'font-medium text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 px-3 tracking-wider uppercase">Yesterday</h3>
              <div className="space-y-1">
                {[
                  { id: 'cranial-nerves', title: 'Mnemonic for cranial nerves' },
                  { id: 'path-mi', title: 'Pathology of MI' },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => switchChat(item.id)}
                    className={`w-full text-left flex items-start gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeChatId === item.id 
                        ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${activeChatId === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className={`text-sm truncate ${activeChatId === item.id ? 'font-medium text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 px-3 tracking-wider uppercase">This Week</h3>
              <div className="space-y-1">
                {[
                  { id: 'ans', title: 'Autonomic nervous system' },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => switchChat(item.id)}
                    className={`w-full text-left flex items-start gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeChatId === item.id 
                        ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${activeChatId === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className={`text-sm truncate ${activeChatId === item.id ? 'font-medium text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950 relative">
          {/* Topbar */}
          <div className="h-14 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-500 hidden sm:block" />
                <h2 className="font-bold text-slate-800 dark:text-white">Dr.tragicMFA</h2>
              </div>
              <div className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800/50 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] sm:text-xs font-bold text-blue-700 dark:text-blue-300 tracking-wide uppercase">GPT-4o Medical</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                All Subjects
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              <button onClick={startNewChat} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Clear Chat">
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Settings">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Scrollable Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full scroll-smooth pb-4"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">How can I help you study today?</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10">Ask me anything about medical concepts, pharmacology, anatomy, or generate practice questions.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl text-left">
                  {[
                    { label: "Explain a concept", desc: "Break down complex physiological or pathological topics", icon: Brain, color: "blue", prompt: "Explain the cardiac cycle" },
                    { label: "Practice MCQs", desc: "Generate high-yield questions for any subject", icon: Target, color: "green", prompt: "Create 5 MCQs on pharmacology" },
                    { label: "Get Mnemonics", desc: "Memory aids for lists, nerves, and drugs", icon: Sparkles, color: "purple", prompt: "Give me a mnemonic for cranial nerves" },
                    { label: "Summarize", desc: "Condense long chapters into key takeaways", icon: FileText, color: "orange", prompt: "Summarize the brachial plexus anatomy" }
                  ].map((btn, i) => (
                    <button 
                      key={i}
                      onClick={() => setInputValue(btn.prompt)}
                      className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${
                          btn.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                          btn.color === 'green' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                          btn.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                          'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        }`}>
                          <btn.icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{btn.label}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 pl-11">{btn.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`px-4 sm:px-6 py-6 sm:py-8 ${msg.role === 'ai' ? 'bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/60' : 'bg-white dark:bg-slate-950'}`}>
                    <div className="max-w-3xl mx-auto flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === 'ai' ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                        {msg.role === 'ai' ? <Stethoscope className="w-4 h-4 text-white" /> : <User className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />}
                      </div>
                      
                      {msg.type === 'beta_blockers_ai_msg_2' ? renderBetaBlockersMsg2() :
                       msg.type === 'beta_blockers_ai_msg_4' ? renderBetaBlockersMsg4() :
                       msg.type === 'mcq_block' ? <MCQQuiz /> :
                       <div className="flex-1 text-slate-800 dark:text-slate-100 text-[15px] sm:text-base leading-relaxed font-medium">
                         {msg.role === 'user' ? (
                           <span className="font-medium text-slate-800 dark:text-slate-100">{msg.content}</span>
                         ) : (
                           <div className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                             {msg.content && parseMarkdown(msg.content)}
                           </div>
                         )}
                       </div>}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="px-4 sm:px-6 py-6 sm:py-8 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/60">
                    <div className="max-w-3xl mx-auto flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                        <Stethoscope className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 flex items-center gap-1.5 h-8">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Bottom spacer so scroll works nicely with input */}
            <div className="h-6"></div>
          </div>
          
          {/* Bottom Input Area */}
          <div className="p-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
            <div className="max-w-3xl mx-auto">
              {/* Suggested Prompts */}
              <div className="flex gap-2.5 overflow-x-auto pb-3 mb-1 no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {[
                  "Explain the brachial plexus",
                  "What are first-line drugs for hypertension?",
                  "Mnemonic for Vitamins",
                  "Summarize Chapter 4 Anatomy"
                ].map((prompt, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInputValue(prompt)}
                    className="flex-shrink-0 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3.5 py-2 rounded-xl transition-all shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="relative flex items-end gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a medical question, request MCQs, or ask for mnemonics..." 
                  className="flex-1 max-h-32 min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none py-2.5 text-[15px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  rows={1}
                ></textarea>
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-all shadow-sm flex-shrink-0 flex items-center justify-center h-[42px] w-[42px] mb-0.5"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-3 px-1">
                <button 
                  onClick={() => setInputValue("Create 5 MCQs on [topic]")}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Target className="w-3.5 h-3.5" />
                  Generate MCQs
                </button>
                <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                <button 
                  onClick={() => setInputValue("Give me a mnemonic for [topic]")}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Brain className="w-3.5 h-3.5" />
                  Mnemonics
                </button>
                <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                <button 
                  onClick={() => setInputValue("Summarize this chapter: [chapter name]")}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Summarize
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
