// ═══════════════════════════════════════════════════════════════════════════
// Sales Academy 2.0 — Engine + Data Layer
// localStorage-backed. Single source of truth for all academy state.
// ═══════════════════════════════════════════════════════════════════════════

(function() {
'use strict';

// ─── Storage Keys ───────────────────────────────────────────────────────────
const ACADEMY_CONTENT_KEY   = 'avalonAcademyContentV1';
const ACADEMY_PROGRESS_KEY  = 'avalonAcademyProgressV1';
const ACADEMY_ATTEMPTS_KEY  = 'avalonAcademyAttemptsV1';
const ACADEMY_GAMIFY_KEY    = 'avalonAcademyGamificationV1';
const ACADEMY_EVENTS_KEY    = 'avalonAcademyEventsV1';

// ─── Point Values ───────────────────────────────────────────────────────────
const POINTS = {
  section_complete:    5,
  module_complete:    25,
  quiz_first_pass:    20,
  quiz_90_bonus:      10,
  quiz_retry_pass:    10,
  simulation_pass:    30,
  assignment_approved:25,
  certification_earned:50,
  streak_milestone:   10
};

// ─── Level Thresholds ───────────────────────────────────────────────────────
const LEVELS = [
  { id: 'l1', name: 'New Hire',          minPoints: 0,   icon: '🌱', color: '#64748b' },
  { id: 'l2', name: 'Apprentice',        minPoints: 50,  icon: '📚', color: '#6366f1' },
  { id: 'l3', name: 'Qualified Rep',     minPoints: 150, icon: '⚡', color: '#06b6d4' },
  { id: 'l4', name: 'Process Runner',    minPoints: 300, icon: '🎯', color: '#10b981' },
  { id: 'l5', name: 'Closer',            minPoints: 500, icon: '🏆', color: '#f59e0b' },
  { id: 'l6', name: 'Growth Rep',        minPoints: 750, icon: '🚀', color: '#f97316' },
  { id: 'l7', name: 'Avalon Certified',  minPoints: 1000,icon: '🏅', color: '#ec4899' },
  { id: 'l8', name: 'Senior Performer', minPoints: 1400,icon: '💎', color: '#8b5cf6' },
  { id: 'l9', name: 'Mentor',            minPoints: 1800,icon: '🌟', color: '#00d4ff' },
];

// ─── Badge Definitions ──────────────────────────────────────────────────────
const BADGE_DEFS = [
  { id: 'foundations',      name: 'Foundations',         icon: '🌱', desc: 'Complete Module 1 — The Avalon Way',                  type: 'completion',   criteria: { moduleId: 'M1' } },
  { id: 'process_runner',   name: 'Process Runner',      icon: '⚙️', desc: 'Complete Module 2 with 85%+ quiz',                    type: 'skill',        criteria: { moduleId: 'M2', minQuizScore: 85 } },
  { id: 'discovery_master', name: 'Discovery Master',    icon: '🔍', desc: 'Complete Module 3 — CBRs & Listening',                type: 'skill',        criteria: { moduleId: 'M3' } },
  { id: 'site_pro',         name: 'Site Pro',            icon: '🏗️', desc: 'Complete Module 4 — Site Walks & Qualification',      type: 'completion',   criteria: { moduleId: 'M4' } },
  { id: 'margin_guardian',  name: 'Margin Guardian',     icon: '🛡️', desc: 'Complete Module 5 with 80%+ quiz',                    type: 'mastery',      criteria: { moduleId: 'M5', minQuizScore: 80 } },
  { id: 'presenter',        name: 'Presenter',           icon: '🎤', desc: 'Complete Module 6 — Proposal Delivery',               type: 'skill',        criteria: { moduleId: 'M6' } },
  { id: 'objection_nav',    name: 'Objection Navigator', icon: '🧭', desc: 'Complete Module 7 with 85%+ quiz',                    type: 'mastery',      criteria: { moduleId: 'M7', minQuizScore: 85 } },
  { id: 'closer',           name: 'Closer',              icon: '🤝', desc: 'Complete Module 8 — Closing & Handoff',               type: 'skill',        criteria: { moduleId: 'M8' } },
  { id: 'revenue_builder',  name: 'Revenue Builder',     icon: '💰', desc: 'Complete Module 9 — Closeout & Expansion',           type: 'completion',   criteria: { moduleId: 'M9' } },
  { id: 'core_complete',    name: 'Core Academy Complete',icon: '🏆',desc: 'Complete all 9 core modules',                         type: 'milestone',    criteria: { allPhases: true } },
  { id: 'streak_7',         name: '7-Day Streak',        icon: '🔥', desc: '7 consecutive days of academy activity',              type: 'streak',       criteria: { streakDays: 7 } },
  { id: 'streak_30',        name: '30-Day Streak',       icon: '⚡', desc: '30 consecutive days of academy activity',             type: 'streak',       criteria: { streakDays: 30 } },
  { id: 'first_quiz',       name: 'Quiz Taker',          icon: '📝', desc: 'Pass your first quiz',                                type: 'milestone',    criteria: { quizzesPassed: 1 } },
  { id: 'quiz_master',      name: 'Quiz Master',         icon: '🎓', desc: 'Pass all 9 module quizzes',                           type: 'mastery',      criteria: { allQuizzesPassed: true } },
  { id: 'fast_learner',     name: 'Fast Learner',        icon: '⚡', desc: 'Complete 3 modules in first week',                    type: 'milestone',    criteria: { modulesIn7Days: 3 } },
];

// ─── Curriculum Seed Data ───────────────────────────────────────────────────
// Maps existing 9 data.js modules into 3-phase Academy 2.0 structure

const SEED_PROGRAM = {
  id: 'prog_1',
  name: 'Sales Academy 2.0',
  slug: 'sales-academy-2',
  description: 'Turn the Avalon Sales Manual and 6-Step Process into real skill — onboarding, team training, and certification.',
  is_active: true
};

const SEED_PHASES = [
  {
    id: 'phase_1',
    program_id: 'prog_1',
    title: 'Foundations',
    slug: 'foundations',
    short_description: 'Master the Avalon mindset, process, and discovery — the bedrock of every sale.',
    long_description: 'This phase establishes the core consultative selling philosophy, the 6-step process, and the listening/discovery discipline that separates Avalon from transactional competitors. Completion unlocks Phase 2.',
    sort_order: 1,
    estimated_minutes: 90,
    color: '#6366f1',
    icon: '🌱',
    unlock_mode: 'immediate',
    is_published: true,
    module_ids: ['M1', 'M2', 'M3'],
    certification_name: 'Foundations Certification'
  },
  {
    id: 'phase_2',
    program_id: 'prog_1',
    title: 'Execution',
    slug: 'execution',
    short_description: 'Site walks, scoping, estimating, and delivering proposals that win at margin.',
    long_description: 'Move from mindset to field execution. This phase covers site walk qualification, scope development, margin protection, and proposal delivery — the skills that determine whether deals close profitably.',
    sort_order: 2,
    estimated_minutes: 90,
    color: '#10b981',
    icon: '⚙️',
    unlock_mode: 'prerequisite',
    prerequisite_phase_id: 'phase_1',
    is_published: true,
    module_ids: ['M4', 'M5', 'M6'],
    certification_name: 'Execution Certification'
  },
  {
    id: 'phase_3',
    program_id: 'prog_1',
    title: 'Mastery',
    slug: 'mastery',
    short_description: 'Close deals, hand off cleanly, and convert satisfied clients into ongoing revenue.',
    long_description: 'The final phase covers the full close-to-handoff-to-expansion cycle. Reps who complete this phase are equipped to consistently win, activate jobs cleanly, and build a referral engine.',
    sort_order: 3,
    estimated_minutes: 90,
    color: '#f59e0b',
    icon: '🏆',
    unlock_mode: 'prerequisite',
    prerequisite_phase_id: 'phase_2',
    is_published: true,
    module_ids: ['M7', 'M8', 'M9'],
    certification_name: 'Mastery Certification'
  }
];

// Quiz questions with proper choices — expanded from data.js quiz text
const QUIZ_QUESTIONS = {
  M1: [
    { id: 'M1Q1', prompt: 'What is the core philosophy behind Avalon\'s sales approach?', type: 'single_choice', points: 1,
      explanation: 'Avalon sells consultatively — understanding the client, defining the problem, shaping scope, and protecting the business. It\'s not about sending prices.',
      choices: [
        { value: 'a', label: 'A', text: 'Always offer the lowest price to win the bid', is_correct: false },
        { value: 'b', label: 'B', text: 'Consultative, process-driven, and margin-protective selling', is_correct: true },
        { value: 'c', label: 'C', text: 'Build the biggest, most detailed proposal possible', is_correct: false },
        { value: 'd', label: 'D', text: 'Respond quickly and send estimates within 24 hours', is_correct: false }
      ]
    },
    { id: 'M1Q2', prompt: 'Why is scope clarity important for both the client AND Avalon?', type: 'single_choice', points: 1,
      explanation: 'Scope clarity protects the client from surprise costs and protects Avalon from margin erosion and field confusion.',
      choices: [
        { value: 'a', label: 'A', text: 'It makes proposals look more professional', is_correct: false },
        { value: 'b', label: 'B', text: 'It prevents surprise costs for the client and margin erosion for Avalon', is_correct: true },
        { value: 'c', label: 'C', text: 'It speeds up the estimating process', is_correct: false },
        { value: 'd', label: 'D', text: 'It helps production plan their schedule', is_correct: false }
      ]
    },
    { id: 'M1Q3', prompt: 'According to Avalon\'s approach, a qualified "no" is better than a confusing "maybe" because:', type: 'single_choice', points: 1,
      explanation: 'A confusing maybe burns estimating time chasing unqualified leads. A qualified no frees the team to focus on winnable opportunities.',
      choices: [
        { value: 'a', label: 'A', text: 'No\'s are easier to document in the CRM', is_correct: false },
        { value: 'b', label: 'B', text: 'A maybe requires a follow-up call', is_correct: false },
        { value: 'c', label: 'C', text: 'A confusing maybe burns estimating time on unwinnable opportunities', is_correct: true },
        { value: 'd', label: 'D', text: 'Clients prefer direct answers regardless of outcome', is_correct: false }
      ]
    },
    { id: 'M1Q4', prompt: 'What does "operationally clean" mean in the Avalon sales context?', type: 'single_choice', points: 1,
      explanation: 'Operationally clean means every job handed to production is fully documented, scoped, and approved — no guessing, no scope creep, no field surprises.',
      choices: [
        { value: 'a', label: 'A', text: 'Using clean, professional proposal templates', is_correct: false },
        { value: 'b', label: 'B', text: 'Jobs handed to production are fully documented with no surprises', is_correct: true },
        { value: 'c', label: 'C', text: 'Keeping the office organized and files up to date', is_correct: false },
        { value: 'd', label: 'D', text: 'Responding to leads within a clean 24-hour window', is_correct: false }
      ]
    }
  ],
  M2: [
    { id: 'M2Q1', prompt: 'What does T.A.P.P.O. stand for in the Avalon mutual agreement opening?', type: 'single_choice', points: 1,
      explanation: 'T.A.P.P.O. = Time, Agenda, Purpose, Permission, Outcome. It sets the roadmap for every client meeting and eliminates scope creep.',
      choices: [
        { value: 'a', label: 'A', text: 'Trust, Action, Proposal, Permission, Objective', is_correct: false },
        { value: 'b', label: 'B', text: 'Time, Agenda, Purpose, Permission, Outcome', is_correct: true },
        { value: 'c', label: 'C', text: 'Target, Agree, Plan, Perform, Optimize', is_correct: false },
        { value: 'd', label: 'D', text: 'Talk, Ask, Probe, Propose, Offer', is_correct: false }
      ]
    },
    { id: 'M2Q2', prompt: 'Why must budget be explored BEFORE sharing any site plan or price breakdown?', type: 'single_choice', points: 1,
      explanation: 'Without a budget conversation, you risk building detailed estimates for clients who cannot or will not invest at Avalon\'s price point — wasting hours of estimating time.',
      choices: [
        { value: 'a', label: 'A', text: 'Clients get offended if you discuss money after seeing the plans', is_correct: false },
        { value: 'b', label: 'B', text: 'To avoid wasting estimating hours on clients who can\'t invest at your level', is_correct: true },
        { value: 'c', label: 'C', text: 'Budget conversations make the client feel more in control', is_correct: false },
        { value: 'd', label: 'D', text: 'It\'s required by company policy for all jobs over $5,000', is_correct: false }
      ]
    },
    { id: 'M2Q3', prompt: 'What is the 3+ Funneling Rule and why does it matter?', type: 'single_choice', points: 1,
      explanation: 'Ask 3 layers of questions before accepting any answer. The first answer is rarely the real answer — surface answers hide the true Core Buying Reason.',
      choices: [
        { value: 'a', label: 'A', text: 'Always send 3+ follow-up emails after a proposal', is_correct: false },
        { value: 'b', label: 'B', text: 'Ask 3+ layers before accepting any answer — the first answer is rarely the real one', is_correct: true },
        { value: 'c', label: 'C', text: 'Use 3+ pricing tiers in every proposal', is_correct: false },
        { value: 'd', label: 'D', text: 'Qualify a minimum of 3 leads per week', is_correct: false }
      ]
    },
    { id: 'M2Q4', prompt: 'What is the Rehearsal Protocol and when do you use it?', type: 'single_choice', points: 1,
      explanation: 'The Rehearsal Protocol is a technique used when the decision-maker is absent. You walk the present person through exactly how to present and advocate for the proposal to their absent partner.',
      choices: [
        { value: 'a', label: 'A', text: 'A script for practicing your pitch before every call', is_correct: false },
        { value: 'b', label: 'B', text: 'A pre-meeting checklist you run through before site walks', is_correct: false },
        { value: 'c', label: 'C', text: 'A technique for coaching the present person to advocate for the proposal to an absent decision-maker', is_correct: true },
        { value: 'd', label: 'D', text: 'A role-play exercise done during weekly team training', is_correct: false }
      ]
    }
  ],
  M3: [
    { id: 'M3Q1', prompt: 'A Core Buying Reason (CBR) is best described as:', type: 'single_choice', points: 1,
      explanation: 'CBRs are the emotional drivers behind the purchase — not the surface request. "I want a patio" is a surface request. The CBR might be "I want my family to actually use the backyard together."',
      choices: [
        { value: 'a', label: 'A', text: 'The client\'s stated budget for the project', is_correct: false },
        { value: 'b', label: 'B', text: 'The emotional driver behind a purchase — not the surface request', is_correct: true },
        { value: 'c', label: 'C', text: 'The client\'s preferred timeline for completion', is_correct: false },
        { value: 'd', label: 'D', text: 'The core features of the proposal the client cares most about', is_correct: false }
      ]
    },
    { id: 'M3Q2', prompt: 'Which of the following is NOT one of the 4 Listening Traps?', type: 'single_choice', points: 1,
      explanation: 'The 4 Listening Traps are: Formulating Responses, Premature Fix-it Mode, Assumptive Hearing, and Phone Distractions. "Active Nodding" is a listening technique, not a trap.',
      choices: [
        { value: 'a', label: 'A', text: 'Formulating Responses', is_correct: false },
        { value: 'b', label: 'B', text: 'Premature Fix-it Mode', is_correct: false },
        { value: 'c', label: 'C', text: 'Active Nodding', is_correct: true },
        { value: 'd', label: 'D', text: 'Phone Distractions', is_correct: false }
      ]
    },
    { id: 'M3Q3', prompt: 'What is a verbatim feedback loop and what does it accomplish?', type: 'single_choice', points: 1,
      explanation: 'A verbatim feedback loop is repeating back the client\'s exact words. It\'s the highest-trust move in discovery because it proves you heard them and gives them a chance to clarify.',
      choices: [
        { value: 'a', label: 'A', text: 'Summarizing what the client said in your own words to confirm understanding', is_correct: false },
        { value: 'b', label: 'B', text: 'Repeating the client\'s exact words back to them — the highest-trust move in discovery', is_correct: true },
        { value: 'c', label: 'C', text: 'Taking written notes during every discovery call', is_correct: false },
        { value: 'd', label: 'D', text: 'Asking the client to repeat themselves so you can capture it accurately', is_correct: false }
      ]
    },
    { id: 'M3Q4', prompt: 'To shift from pain establishment to solution, you should:', type: 'single_choice', points: 1,
      explanation: 'You must fully establish consequences (pain) before transitioning to solutions (pleasure). Moving too fast to solutions before pain is established results in clients who don\'t value the investment.',
      choices: [
        { value: 'a', label: 'A', text: 'Immediately offer your solution once you identify the problem', is_correct: false },
        { value: 'b', label: 'B', text: 'Ask permission before transitioning: "Would it help if I showed you how we\'ve solved this?"', is_correct: false },
        { value: 'c', label: 'C', text: 'Establish consequences fully before transitioning — pain must be felt before pleasure is valued', is_correct: true },
        { value: 'd', label: 'D', text: 'Present solutions during discovery to keep the conversation moving forward', is_correct: false }
      ]
    }
  ],
  M4: [
    { id: 'M4Q1', prompt: 'The fit decision must be made:', type: 'single_choice', points: 1,
      explanation: 'The fit decision must be made before you leave the site — not later, not by email. Delaying this decision burns everyone\'s time.',
      choices: [
        { value: 'a', label: 'A', text: 'Within 24 hours of the site walk via email', is_correct: false },
        { value: 'b', label: 'B', text: 'Before you leave the site — in person, not later', is_correct: true },
        { value: 'c', label: 'C', text: 'After estimating is complete and reviewed', is_correct: false },
        { value: 'd', label: 'D', text: 'During the proposal presentation meeting', is_correct: false }
      ]
    },
    { id: 'M4Q2', prompt: 'Which of the following should NEVER be promised on the site walk?', type: 'single_choice', points: 1,
      explanation: 'Specific pricing or cost estimates should never be promised on site. Scope expectations are appropriate, but numbers require proper estimating.',
      choices: [
        { value: 'a', label: 'A', text: 'The general scope of work being considered', is_correct: false },
        { value: 'b', label: 'B', text: 'Specific pricing or cost estimates', is_correct: true },
        { value: 'c', label: 'C', text: 'The timeline for delivering the proposal', is_correct: false },
        { value: 'd', label: 'D', text: 'Which elements are must-haves vs. nice-to-haves', is_correct: false }
      ]
    },
    { id: 'M4Q3', prompt: 'Before estimating begins, a site walk must produce:', type: 'single_choice', points: 1,
      explanation: 'Every site walk must produce photos, measurements, and a written site walk summary before estimating begins — no exceptions.',
      choices: [
        { value: 'a', label: 'A', text: 'A verbal summary shared with the production manager', is_correct: false },
        { value: 'b', label: 'B', text: 'Photos, measurements, and a written site walk summary', is_correct: true },
        { value: 'c', label: 'C', text: 'A signed letter of intent from the client', is_correct: false },
        { value: 'd', label: 'D', text: 'A preliminary budget range confirmed by the client', is_correct: false }
      ]
    },
    { id: 'M4Q4', prompt: 'Separating must-haves from nice-to-haves on the site walk should happen:', type: 'single_choice', points: 1,
      explanation: 'Must-haves vs. nice-to-haves must be separated with the client present on site — not later in the office. This is a discovery exercise, not a desk exercise.',
      choices: [
        { value: 'a', label: 'A', text: 'During the proposal review meeting', is_correct: false },
        { value: 'b', label: 'B', text: 'While building the estimate in the office', is_correct: false },
        { value: 'c', label: 'C', text: 'With the client present on site', is_correct: true },
        { value: 'd', label: 'D', text: 'After the client receives the initial proposal', is_correct: false }
      ]
    }
  ],
  M5: [
    { id: 'M5Q1', prompt: 'What is the key difference between a scope and a proposal?', type: 'single_choice', points: 1,
      explanation: 'A scope defines what will be done (technical document). A proposal presents the solution and investment to the client. Scope comes first — you never build a proposal from guesswork.',
      choices: [
        { value: 'a', label: 'A', text: 'A scope is internal; a proposal is the external client-facing document', is_correct: true },
        { value: 'b', label: 'B', text: 'A scope includes pricing; a proposal is just a description of work', is_correct: false },
        { value: 'c', label: 'C', text: 'A scope is for large jobs; a proposal is for smaller residential projects', is_correct: false },
        { value: 'd', label: 'D', text: 'A scope is optional; a proposal is required for every job', is_correct: false }
      ]
    },
    { id: 'M5Q2', prompt: 'Who must approve a $12,000 landscape enhancement job?', type: 'single_choice', points: 1,
      explanation: 'The approval matrix: Ryan < $2,500 (templates), $2,500–$10,000 (manager), $10,001+ (Tyler). A $12,000 job requires Tyler\'s approval.',
      choices: [
        { value: 'a', label: 'A', text: 'Ryan can approve it using a template', is_correct: false },
        { value: 'b', label: 'B', text: 'The manager can approve it', is_correct: false },
        { value: 'c', label: 'C', text: 'Tyler must approve it', is_correct: true },
        { value: 'd', label: 'D', text: 'No approval is needed for landscape jobs', is_correct: false }
      ]
    },
    { id: 'M5Q3', prompt: 'Why must exclusions be documented in writing?', type: 'single_choice', points: 1,
      explanation: 'Written exclusions protect Avalon from scope creep. Without documented exclusions, any item not mentioned becomes the company\'s problem to fix for free.',
      choices: [
        { value: 'a', label: 'A', text: 'Because clients often forget verbal conversations', is_correct: false },
        { value: 'b', label: 'B', text: 'To protect Avalon from scope creep — undocumented items become Avalon\'s problem', is_correct: true },
        { value: 'c', label: 'C', text: 'Because it\'s required by the estimating software', is_correct: false },
        { value: 'd', label: 'D', text: 'To make proposals look more thorough and detailed', is_correct: false }
      ]
    },
    { id: 'M5Q4', prompt: 'When scope changes after estimating without a written amendment, what happens?', type: 'single_choice', points: 1,
      explanation: 'Without a written amendment, Avalon absorbs the cost of changes. This is the #1 margin killer in landscape contracting.',
      choices: [
        { value: 'a', label: 'A', text: 'The client pays a standard change order fee', is_correct: false },
        { value: 'b', label: 'B', text: 'Production flags it and waits for approval', is_correct: false },
        { value: 'c', label: 'C', text: 'Avalon absorbs the cost — the #1 margin killer in landscape contracting', is_correct: true },
        { value: 'd', label: 'D', text: 'The change is noted and addressed at final billing', is_correct: false }
      ]
    }
  ],
  M6: [
    { id: 'M6Q1', prompt: 'What is the biggest mistake salespeople make at proposal delivery?', type: 'single_choice', points: 1,
      explanation: 'Emailing a complex proposal for the client to read alone is the biggest mistake — you lose control of the narrative, the CBR connection, and the close.',
      choices: [
        { value: 'a', label: 'A', text: 'Including too many options, which creates confusion', is_correct: false },
        { value: 'b', label: 'B', text: 'Emailing a complex proposal for the client to read alone without presenting it', is_correct: true },
        { value: 'c', label: 'C', text: 'Leading with the price before building value', is_correct: false },
        { value: 'd', label: 'D', text: 'Scheduling the presentation too close to the site walk', is_correct: false }
      ]
    },
    { id: 'M6Q2', prompt: 'In the 6-step presentation sequence, solutions should be presented in:', type: 'single_choice', points: 1,
      explanation: 'Solutions must be presented in CBR priority order — not task order. Lead with what matters most to the client emotionally, not what\'s most convenient for construction.',
      choices: [
        { value: 'a', label: 'A', text: 'Construction sequence order — what will be built first to last', is_correct: false },
        { value: 'b', label: 'B', text: 'Price order — lowest to highest investment', is_correct: false },
        { value: 'c', label: 'C', text: 'CBR priority order — what matters most to the client first', is_correct: true },
        { value: 'd', label: 'D', text: 'Alphabetical order for easy reference', is_correct: false }
      ]
    },
    { id: 'M6Q3', prompt: 'The correct closing ask at the end of a proposal is:', type: 'single_choice', points: 1,
      explanation: '"Can we lock this in today?" is a direct, confident close. "Let me know what you think" is not a close — it hands control back to the client without a decision.',
      choices: [
        { value: 'a', label: 'A', text: '"Let me know what you think and feel free to reach out with questions."', is_correct: false },
        { value: 'b', label: 'B', text: '"Would you like some time to think it over?"', is_correct: false },
        { value: 'c', label: 'C', text: '"Can we lock this in today?"', is_correct: true },
        { value: 'd', label: 'D', text: '"What parts of this are you most excited about?"', is_correct: false }
      ]
    },
    { id: 'M6Q4', prompt: 'What should always happen before the client leaves the proposal conversation?', type: 'single_choice', points: 1,
      explanation: 'A clear next step with a date must be established before the conversation ends — no vague "I\'ll think about it" endings.',
      choices: [
        { value: 'a', label: 'A', text: 'The client should sign something confirming they received the proposal', is_correct: false },
        { value: 'b', label: 'B', text: 'A clear next step with a date must be established', is_correct: true },
        { value: 'c', label: 'C', text: 'The rep should summarize all exclusions one more time', is_correct: false },
        { value: 'd', label: 'D', text: 'The client should confirm their budget range for the record', is_correct: false }
      ]
    }
  ],
  M7: [
    { id: 'M7Q1', prompt: 'What is the first follow-up question after sending a proposal?', type: 'single_choice', points: 1,
      explanation: '"Is it the price, scope, timing, or fit?" — Clarify before answering. This identifies the real objection instead of guessing.',
      choices: [
        { value: 'a', label: 'A', text: '"Did you have a chance to review the proposal?"', is_correct: false },
        { value: 'b', label: 'B', text: '"Is there anything I can answer for you about the scope?"', is_correct: false },
        { value: 'c', label: 'C', text: '"Is it the price, scope, timing, or fit?"', is_correct: true },
        { value: 'd', label: 'D', text: '"Are you ready to move forward?"', is_correct: false }
      ]
    },
    { id: 'M7Q2', prompt: 'When a client says "Your price is too high," the correct first step is:', type: 'single_choice', points: 1,
      explanation: 'Pause and clarify before defending. "Too high compared to what?" — The 5-step objection framework starts with Pause → Clarify.',
      choices: [
        { value: 'a', label: 'A', text: 'Immediately offer a discount to keep the deal moving', is_correct: false },
        { value: 'b', label: 'B', text: 'Explain why Avalon\'s quality justifies the premium', is_correct: false },
        { value: 'c', label: 'C', text: 'Pause and clarify — "Too high compared to what?"', is_correct: true },
        { value: 'd', label: 'D', text: 'Remove items from scope to bring the price down', is_correct: false }
      ]
    },
    { id: 'M7Q3', prompt: 'To handle a discount request without dropping the price, you should:', type: 'single_choice', points: 1,
      explanation: 'Never discount without a matching scope reduction. Discounting trains clients to stall for price reductions every time.',
      choices: [
        { value: 'a', label: 'A', text: 'Offer a small percentage discount as a goodwill gesture', is_correct: false },
        { value: 'b', label: 'B', text: 'Offer a matching scope reduction — price only drops when scope drops', is_correct: true },
        { value: 'c', label: 'C', text: 'Explain that margins are too tight to offer discounts', is_correct: false },
        { value: 'd', label: 'D', text: 'Escalate to the manager to handle the pricing conversation', is_correct: false }
      ]
    },
    { id: 'M7Q4', prompt: 'The Avalon follow-up cadence after proposal delivery is:', type: 'single_choice', points: 1,
      explanation: 'Day 3, Day 7, Day 14, Day 21+ — not random. Every open opportunity must have a defined next step with a date.',
      choices: [
        { value: 'a', label: 'A', text: 'Weekly until they respond', is_correct: false },
        { value: 'b', label: 'B', text: 'Day 3, Day 7, Day 14, Day 21+ — structured cadence, never random', is_correct: true },
        { value: 'c', label: 'C', text: 'Every 48 hours for the first two weeks', is_correct: false },
        { value: 'd', label: 'D', text: 'Only when the client initiates contact', is_correct: false }
      ]
    }
  ],
  M8: [
    { id: 'M8Q1', prompt: 'A verbal "yes" from the client means:', type: 'single_choice', points: 1,
      explanation: 'A verbal yes alone is NOT enough. Activation requires a signed SOW + deposit. No field work begins without both.',
      choices: [
        { value: 'a', label: 'A', text: 'The job is activated and production can begin planning', is_correct: false },
        { value: 'b', label: 'B', text: 'The rep can begin building the handoff packet', is_correct: false },
        { value: 'c', label: 'C', text: 'Nothing — signed SOW + deposit is required for activation', is_correct: true },
        { value: 'd', label: 'D', text: 'The manager should be notified for preliminary scheduling', is_correct: false }
      ]
    },
    { id: 'M8Q2', prompt: 'What happens at the Driveway Handshake?', type: 'single_choice', points: 1,
      explanation: 'The Driveway Handshake is when the Sales Rep is on-site on Day 1 with the client and Crew Leader — walking the site, reviewing scope, and officially passing the baton.',
      choices: [
        { value: 'a', label: 'A', text: 'The client signs the final invoice and receives a warranty document', is_correct: false },
        { value: 'b', label: 'B', text: 'Sales, the client, and Crew Leader meet on Day 1 to walk the site and pass the baton', is_correct: true },
        { value: 'c', label: 'C', text: 'The Crew Leader reviews the handoff packet and signs off on the scope', is_correct: false },
        { value: 'd', label: 'D', text: 'The manager reviews the job with production before crews arrive', is_correct: false }
      ]
    },
    { id: 'M8Q3', prompt: 'The Handoff Packet must include:', type: 'single_choice', points: 1,
      explanation: 'The Handoff Packet includes: SOW, COGs, CBR Profile, and Material/Access layout — all required before any field crew begins.',
      choices: [
        { value: 'a', label: 'A', text: 'Invoice, warranty info, and permit applications', is_correct: false },
        { value: 'b', label: 'B', text: 'SOW, COGs, CBR Profile, and Material/Access layout', is_correct: true },
        { value: 'c', label: 'C', text: 'Site photos, client contact info, and payment receipt', is_correct: false },
        { value: 'd', label: 'D', text: 'Proposal, deposit receipt, and crew schedule', is_correct: false }
      ]
    },
    { id: 'M8Q4', prompt: 'After formal handoff to production, Sales must NEVER:', type: 'single_choice', points: 1,
      explanation: 'After handoff, Sales must never make promises to the client about scope, schedule, or changes — all client communication goes through production.',
      choices: [
        { value: 'a', label: 'A', text: 'Follow up with the client to confirm satisfaction', is_correct: false },
        { value: 'b', label: 'B', text: 'Make promises to the client about scope, schedule, or changes', is_correct: true },
        { value: 'c', label: 'C', text: 'Attend the Driveway Handshake on Day 1', is_correct: false },
        { value: 'd', label: 'D', text: 'Log the job as "Sold / Activation" in the CRM', is_correct: false }
      ]
    }
  ],
  M9: [
    { id: 'M9Q1', prompt: 'When should the closeout conversation happen?', type: 'single_choice', points: 1,
      explanation: 'The closeout call should happen 48–72 hours after the final walkthrough — Sales initiates it, not production.',
      choices: [
        { value: 'a', label: 'A', text: 'When production sends the final invoice', is_correct: false },
        { value: 'b', label: 'B', text: '48–72 hours after the final walkthrough, initiated by Sales', is_correct: true },
        { value: 'c', label: 'C', text: 'After the client leaves a Google review', is_correct: false },
        { value: 'd', label: 'D', text: 'At the time of final payment collection', is_correct: false }
      ]
    },
    { id: 'M9Q2', prompt: 'The review request approach that actually gets results:', type: 'single_choice', points: 1,
      explanation: 'Make it personal and specific — reference what the client specifically said they loved, then ask them to share that exact experience in a review.',
      choices: [
        { value: 'a', label: 'A', text: 'Send a generic email with a Google review link', is_correct: false },
        { value: 'b', label: 'B', text: 'Ask verbally and follow up with a text 24 hours later', is_correct: false },
        { value: 'c', label: 'C', text: 'Reference what they loved specifically and ask them to share that experience', is_correct: true },
        { value: 'd', label: 'D', text: 'Offer a small discount on future work in exchange for a review', is_correct: false }
      ]
    },
    { id: 'M9Q3', prompt: 'The referral conversation opener is:', type: 'single_choice', points: 1,
      explanation: '"We treat referrals the same way we treated you." — It\'s the most natural, trust-based referral opener.',
      choices: [
        { value: 'a', label: 'A', text: '"Do you know anyone who might need our services?"', is_correct: false },
        { value: 'b', label: 'B', text: '"We treat referrals the same way we treated you."', is_correct: true },
        { value: 'c', label: 'C', text: '"We offer a $200 referral credit for every new client you send us."', is_correct: false },
        { value: 'd', label: 'D', text: '"Our best clients come from referrals — would you consider sharing our info?"', is_correct: false }
      ]
    },
    { id: 'M9Q4', prompt: 'The question that opens the door to Phase 2 or maintenance is:', type: 'single_choice', points: 1,
      explanation: '"What would you want to tackle next?" — log with timing and owner. It opens future opportunities naturally without pressure.',
      choices: [
        { value: 'a', label: 'A', text: '"Are you interested in a maintenance contract?"', is_correct: false },
        { value: 'b', label: 'B', text: '"What would you want to tackle next?" — logged with timing and owner', is_correct: true },
        { value: 'c', label: 'C', text: '"Can I send you our maintenance pricing?"', is_correct: false },
        { value: 'd', label: 'D', text: '"Would you like to schedule a follow-up visit in 6 months?"', is_correct: false }
      ]
    }
  ]
};

// ─── Build Module Sections from data.js structure ───────────────────────────
function buildSections(mod) {
  const sections = [];
  sections.push({
    id: `${mod.id}_overview`,
    title: 'Overview',
    section_type: 'overview',
    sort_order: 1,
    estimated_minutes: 5,
    is_required: true,
    content: { objective: mod.objective, keyPoints: mod.keyPoints || [] }
  });
  if (mod.lessons && mod.lessons.length) {
    mod.lessons.forEach((lesson, i) => {
      sections.push({
        id: `${mod.id}_lesson_${i+1}`,
        title: lesson.split(' — ')[0].replace(/^The /, '').split(':')[0].trim().substring(0, 60),
        section_type: 'lesson',
        sort_order: i + 2,
        estimated_minutes: 8,
        is_required: true,
        content: { body: lesson }
      });
    });
  }
  sections.push({
    id: `${mod.id}_quiz`,
    title: 'Module Quiz',
    section_type: 'quiz',
    sort_order: sections.length + 1,
    estimated_minutes: 10,
    is_required: true,
    content: { quizId: `quiz_${mod.id}` }
  });
  return sections;
}

// ─── Content Initialization ─────────────────────────────────────────────────
function initAcademyContent() {
  const existing = localStorage.getItem(ACADEMY_CONTENT_KEY);
  if (existing) {
    try { return JSON.parse(existing); } catch(e) {}
  }
  const sourceModules = (window.AVALON_DATA && window.AVALON_DATA.modules) || [];
  const modules = sourceModules.map(m => ({
    id: m.id,
    phase_id: ['M1','M2','M3'].includes(m.id) ? 'phase_1' :
              ['M4','M5','M6'].includes(m.id) ? 'phase_2' : 'phase_3',
    title: m.title,
    short_description: m.objective,
    overview: m.objective,
    objectives: m.keyPoints || [],
    sort_order: parseInt(m.id.slice(1)),
    estimated_minutes: 30,
    difficulty: parseInt(m.id.slice(1)) <= 3 ? 'beginner' : parseInt(m.id.slice(1)) <= 6 ? 'intermediate' : 'advanced',
    status: 'published',
    requires_quiz_pass: true,
    min_quiz_score: 75,
    sections: buildSections(m),
    quiz: {
      id: `quiz_${m.id}`,
      module_id: m.id,
      title: `${m.title} — Knowledge Check`,
      pass_score: 75,
      max_attempts: null,
      randomize_questions: false,
      show_feedback: true,
      questions: QUIZ_QUESTIONS[m.id] || []
    }
  }));

  const content = {
    program: SEED_PROGRAM,
    phases: SEED_PHASES,
    modules,
    badges: BADGE_DEFS,
    levels: LEVELS,
    seeded_at: new Date().toISOString()
  };
  localStorage.setItem(ACADEMY_CONTENT_KEY, JSON.stringify(content));
  return content;
}

// ─── Progress Helpers ────────────────────────────────────────────────────────
function getProgress(repId) {
  try { return JSON.parse(localStorage.getItem(ACADEMY_PROGRESS_KEY)) || {}; } catch(e) { return {}; }
}
function saveProgress(data) { localStorage.setItem(ACADEMY_PROGRESS_KEY, JSON.stringify(data)); }

function getRepProgress(repId) {
  const all = getProgress();
  if (!all[repId]) all[repId] = { modules: {}, phases: {}, points: 0, streak_days: 0, last_activity: null, badges: [], quizzes_passed: 0, modules_completed: 0 };
  return all[repId];
}

function getAttempts() {
  try { return JSON.parse(localStorage.getItem(ACADEMY_ATTEMPTS_KEY)) || {}; } catch(e) { return {}; }
}
function saveAttempts(data) { localStorage.setItem(ACADEMY_ATTEMPTS_KEY, JSON.stringify(data)); }

// ─── Module Progress ─────────────────────────────────────────────────────────
function getModuleProgress(repId, moduleId) {
  const rp = getRepProgress(repId);
  if (!rp.modules[moduleId]) {
    rp.modules[moduleId] = {
      status: 'not_started',
      sections_completed: [],
      quiz_passed: false,
      quiz_best_score: null,
      percent_complete: 0,
      started_at: null,
      completed_at: null
    };
  }
  return rp.modules[moduleId];
}

function markSectionComplete(repId, moduleId, sectionId) {
  const all = getProgress();
  if (!all[repId]) all[repId] = getRepProgress(repId);
  const mp = all[repId].modules[moduleId] || { status: 'not_started', sections_completed: [], quiz_passed: false, quiz_best_score: null, percent_complete: 0, started_at: null, completed_at: null };

  if (!mp.sections_completed.includes(sectionId)) {
    mp.sections_completed.push(sectionId);
    awardPoints(repId, all, POINTS.section_complete, 'section_complete');
    trackAcademyEvent(repId, 'academy_section_completed', { moduleId, sectionId });
  }

  if (mp.status === 'not_started') {
    mp.status = 'in_progress';
    mp.started_at = new Date().toISOString();
  }

  // Recalculate percent
  const content = getAcademyContent();
  const mod = content.modules.find(m => m.id === moduleId);
  if (mod) {
    const totalRequired = mod.sections.filter(s => s.is_required).length;
    const requiredCompleted = mod.sections.filter(s => s.is_required && mp.sections_completed.includes(s.id)).length;
    // If last section is quiz, don't count it in percent until quiz passed
    const nonQuizRequired = mod.sections.filter(s => s.is_required && s.section_type !== 'quiz').length;
    const nonQuizCompleted = mod.sections.filter(s => s.is_required && s.section_type !== 'quiz' && mp.sections_completed.includes(s.id)).length;
    const base = nonQuizRequired > 0 ? Math.round((nonQuizCompleted / nonQuizRequired) * 80) : 0;
    const quizBonus = mp.quiz_passed ? 20 : 0;
    mp.percent_complete = Math.min(100, base + quizBonus);
  }

  all[repId].modules[moduleId] = mp;
  saveProgress(all);
  updateStreakAndActivity(repId, all);
  checkModuleCompletion(repId, moduleId, all);
  checkBadgeCriteria(repId, all);
}

function checkModuleCompletion(repId, moduleId, all) {
  const mp = all[repId].modules[moduleId];
  if (mp.status === 'completed') return;
  const content = getAcademyContent();
  const mod = content.modules.find(m => m.id === moduleId);
  if (!mod) return;

  const requiredNonQuizSections = mod.sections.filter(s => s.is_required && s.section_type !== 'quiz');
  const allNonQuizDone = requiredNonQuizSections.every(s => mp.sections_completed.includes(s.id));
  const quizDone = !mod.requires_quiz_pass || mp.quiz_passed;

  if (allNonQuizDone && quizDone) {
    mp.status = 'completed';
    mp.percent_complete = 100;
    mp.completed_at = new Date().toISOString();
    all[repId].modules_completed = (all[repId].modules_completed || 0) + 1;
    awardPoints(repId, all, POINTS.module_complete, 'module_complete');
    trackAcademyEvent(repId, 'academy_module_completed', { moduleId });
    saveProgress(all);
    checkPhaseCompletion(repId, mod.phase_id, all);
  }
}

function checkPhaseCompletion(repId, phaseId, all) {
  const content = getAcademyContent();
  const phaseModules = content.modules.filter(m => m.phase_id === phaseId);
  const allDone = phaseModules.every(m => (all[repId].modules[m.id] || {}).status === 'completed');
  if (allDone) {
    if (!all[repId].phases) all[repId].phases = {};
    if (all[repId].phases[phaseId] !== 'completed') {
      all[repId].phases[phaseId] = 'completed';
      trackAcademyEvent(repId, 'academy_phase_completed', { phaseId });
      saveProgress(all);
    }
  }
}

// ─── Quiz Engine ─────────────────────────────────────────────────────────────
function getQuizAttempts(repId, quizId) {
  const attempts = getAttempts();
  return (attempts[repId] && attempts[repId][quizId]) || [];
}

function submitQuizAttempt(repId, quizId, moduleId, answers) {
  const content = getAcademyContent();
  const mod = content.modules.find(m => m.id === moduleId);
  if (!mod) return { error: 'Module not found' };
  const quiz = mod.quiz;
  if (!quiz) return { error: 'Quiz not found' };

  // Score the attempt
  let rawScore = 0;
  let totalPoints = 0;
  const feedback = [];
  quiz.questions.forEach(q => {
    totalPoints += q.points;
    const submitted = answers[q.id];
    let correct = false;
    if (q.type === 'single_choice') {
      const correctChoice = q.choices.find(c => c.is_correct);
      correct = submitted === correctChoice?.value;
    } else if (q.type === 'multi_select') {
      const correctValues = q.choices.filter(c => c.is_correct).map(c => c.value).sort();
      const submittedSorted = (Array.isArray(submitted) ? submitted : []).sort();
      correct = JSON.stringify(correctValues) === JSON.stringify(submittedSorted);
    } else if (q.type === 'true_false') {
      const correctChoice = q.choices.find(c => c.is_correct);
      correct = submitted === correctChoice?.value;
    }
    if (correct) rawScore += q.points;
    feedback.push({
      questionId: q.id,
      correct,
      points_awarded: correct ? q.points : 0,
      explanation: q.explanation,
      correct_answer: q.choices ? q.choices.find(c => c.is_correct)?.value : null
    });
  });

  const percentScore = totalPoints > 0 ? Math.round((rawScore / totalPoints) * 100) : 0;
  const passed = percentScore >= quiz.pass_score;
  const prevAttempts = getQuizAttempts(repId, quizId);
  const attemptNumber = prevAttempts.length + 1;
  const isFirstPass = passed && !prevAttempts.some(a => a.passed);

  const attempt = {
    id: `qa_${Date.now()}`,
    quiz_id: quizId,
    module_id: moduleId,
    attempt_number: attemptNumber,
    submitted_at: new Date().toISOString(),
    raw_score: rawScore,
    percent_score: percentScore,
    passed,
    feedback,
    answers
  };

  // Save attempt
  const allAttempts = getAttempts();
  if (!allAttempts[repId]) allAttempts[repId] = {};
  if (!allAttempts[repId][quizId]) allAttempts[repId][quizId] = [];
  allAttempts[repId][quizId].push(attempt);
  saveAttempts(allAttempts);

  // Update progress
  const all = getProgress();
  if (!all[repId]) all[repId] = getRepProgress(repId);
  if (!all[repId].modules[moduleId]) all[repId].modules[moduleId] = { status: 'in_progress', sections_completed: [], quiz_passed: false, quiz_best_score: null, percent_complete: 0, started_at: new Date().toISOString(), completed_at: null };
  const mp = all[repId].modules[moduleId];

  if (passed) {
    mp.quiz_passed = true;
    if (!all[repId].quizzes_passed) all[repId].quizzes_passed = 0;
    if (isFirstPass) {
      all[repId].quizzes_passed += 1;
      awardPoints(repId, all, POINTS.quiz_first_pass, 'quiz_first_pass');
      if (percentScore >= 90) awardPoints(repId, all, POINTS.quiz_90_bonus, 'quiz_90_bonus');
    } else if (!isFirstPass && passed) {
      awardPoints(repId, all, POINTS.quiz_retry_pass, 'quiz_retry_pass');
    }
    mp.sections_completed = [...new Set([...mp.sections_completed, `${moduleId}_quiz`])];
    trackAcademyEvent(repId, 'academy_quiz_passed', { quizId, moduleId, percentScore, attemptNumber });
  } else {
    trackAcademyEvent(repId, 'academy_quiz_failed', { quizId, moduleId, percentScore, attemptNumber });
  }

  if (passed && mp.quiz_best_score === null || percentScore > (mp.quiz_best_score || 0)) {
    mp.quiz_best_score = percentScore;
  }

  saveProgress(all);
  updateStreakAndActivity(repId, all);
  checkModuleCompletion(repId, moduleId, all);
  checkBadgeCriteria(repId, getProgress());

  return { attempt, passed, percentScore, feedback, quiz };
}

// ─── Points & Level Engine ───────────────────────────────────────────────────
function awardPoints(repId, all, amount, reason) {
  if (!all[repId]) all[repId] = getRepProgress(repId);
  all[repId].points = (all[repId].points || 0) + amount;
  // Level recalc happens implicitly via calculateLevel
  saveProgress(all);
}

function calculateLevel(points) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.minPoints) level = l;
  }
  return level;
}

function getNextLevel(points) {
  for (const l of LEVELS) {
    if (l.minPoints > points) return l;
  }
  return null;
}

// ─── Badge Engine ────────────────────────────────────────────────────────────
function checkBadgeCriteria(repId, all) {
  if (!all[repId]) return;
  const rp = all[repId];
  const earned = new Set(rp.badges || []);
  const content = getAcademyContent();
  const changed = [];

  BADGE_DEFS.forEach(badge => {
    if (earned.has(badge.id)) return;
    const c = badge.criteria;

    // Module completion badge
    if (c.moduleId) {
      const mp = (rp.modules || {})[c.moduleId];
      if (!mp || mp.status !== 'completed') return;
      if (c.minQuizScore) {
        if (!mp.quiz_best_score || mp.quiz_best_score < c.minQuizScore) return;
      }
      earned.add(badge.id);
      changed.push(badge.id);
      trackAcademyEvent(repId, 'academy_badge_earned', { badgeId: badge.id, badgeName: badge.name });
      awardPoints(repId, all, 10, 'badge_earned');
    }

    // All phases complete
    else if (c.allPhases) {
      const allComplete = content.modules.every(m => (rp.modules || {})[m.id]?.status === 'completed');
      if (allComplete) {
        earned.add(badge.id);
        changed.push(badge.id);
        trackAcademyEvent(repId, 'academy_badge_earned', { badgeId: badge.id, badgeName: badge.name });
        awardPoints(repId, all, 20, 'milestone_badge');
      }
    }

    // Streak badges
    else if (c.streakDays) {
      if ((rp.streak_days || 0) >= c.streakDays) {
        earned.add(badge.id);
        changed.push(badge.id);
        awardPoints(repId, all, POINTS.streak_milestone, 'streak_badge');
        trackAcademyEvent(repId, 'academy_badge_earned', { badgeId: badge.id, badgeName: badge.name });
      }
    }

    // Quiz milestone
    else if (c.quizzesPassed) {
      if ((rp.quizzes_passed || 0) >= c.quizzesPassed) {
        earned.add(badge.id);
        changed.push(badge.id);
        trackAcademyEvent(repId, 'academy_badge_earned', { badgeId: badge.id, badgeName: badge.name });
      }
    }

    // All quizzes passed
    else if (c.allQuizzesPassed) {
      const qp = (rp.quizzes_passed || 0);
      if (qp >= content.modules.length) {
        earned.add(badge.id);
        changed.push(badge.id);
        trackAcademyEvent(repId, 'academy_badge_earned', { badgeId: badge.id, badgeName: badge.name });
      }
    }

    // Fast learner
    else if (c.modulesIn7Days) {
      const oneWeekAgo = Date.now() - 7 * 24 * 3600 * 1000;
      const recentCompletions = Object.values(rp.modules || {}).filter(m => m.status === 'completed' && m.completed_at && new Date(m.completed_at).getTime() > oneWeekAgo).length;
      if (recentCompletions >= c.modulesIn7Days) {
        earned.add(badge.id);
        changed.push(badge.id);
        trackAcademyEvent(repId, 'academy_badge_earned', { badgeId: badge.id, badgeName: badge.name });
      }
    }
  });

  if (changed.length) {
    all[repId].badges = [...earned];
    saveProgress(all);
  }
  return changed;
}

// ─── Streak Tracking ─────────────────────────────────────────────────────────
function updateStreakAndActivity(repId, all) {
  const rp = all[repId];
  const today = new Date().toISOString().slice(0, 10);
  const last = rp.last_activity;
  if (last === today) return;

  if (last) {
    const diffDays = Math.round((new Date(today) - new Date(last)) / 86400000);
    if (diffDays === 1) {
      rp.streak_days = (rp.streak_days || 0) + 1;
    } else {
      rp.streak_days = 1; // streak broken
    }
  } else {
    rp.streak_days = 1;
  }
  rp.last_activity = today;
  saveProgress(all);
}

// ─── Event Tracking ──────────────────────────────────────────────────────────
function trackAcademyEvent(repId, eventName, properties) {
  try {
    const events = JSON.parse(localStorage.getItem(ACADEMY_EVENTS_KEY) || '[]');
    events.unshift({ id: `ev_${Date.now()}`, user_id: repId, event_name: eventName, properties: properties || {}, occurred_at: new Date().toISOString() });
    if (events.length > 500) events.length = 500;
    localStorage.setItem(ACADEMY_EVENTS_KEY, JSON.stringify(events));
  } catch(e) {}
}

// ─── Aggregated Home Data ────────────────────────────────────────────────────
function getAcademyContent() {
  return initAcademyContent();
}

function getAcademyHomeData(repId) {
  const content = getAcademyContent();
  const rp = getRepProgress(repId);
  const all = getProgress();
  if (!all[repId]) all[repId] = rp;

  const allMods = content.modules;
  const completedMods = allMods.filter(m => (rp.modules[m.id] || {}).status === 'completed');
  const inProgressMods = allMods.filter(m => (rp.modules[m.id] || {}).status === 'in_progress');
  const overallPct = Math.round((completedMods.length / allMods.length) * 100);
  const currentLevel = calculateLevel(rp.points || 0);
  const nextLevel = getNextLevel(rp.points || 0);

  // Compute phase progress
  const phaseProgress = content.phases.map(ph => {
    const phaseMods = allMods.filter(m => m.phase_id === ph.id);
    const phCompleted = phaseMods.filter(m => (rp.modules[m.id] || {}).status === 'completed').length;
    const phInProgress = phaseMods.filter(m => (rp.modules[m.id] || {}).status === 'in_progress').length;
    const pct = phaseMods.length > 0 ? Math.round((phCompleted / phaseMods.length) * 100) : 0;

    // Unlock logic
    let locked = false;
    if (ph.unlock_mode === 'prerequisite' && ph.prerequisite_phase_id) {
      const prereqMods = allMods.filter(m => m.phase_id === ph.prerequisite_phase_id);
      const prereqDone = prereqMods.every(m => (rp.modules[m.id] || {}).status === 'completed');
      locked = !prereqDone;
    }
    return { ...ph, pct, modulesCompleted: phCompleted, totalModules: phaseMods.length, locked, inProgress: phInProgress > 0 };
  });

  // Recommended next module
  let nextModule = null;
  for (const ph of content.phases) {
    if (phaseProgress.find(p => p.id === ph.id)?.locked) continue;
    const phaseMods = allMods.filter(m => m.phase_id === ph.id).sort((a,b) => a.sort_order - b.sort_order);
    const inProg = phaseMods.find(m => (rp.modules[m.id] || {}).status === 'in_progress');
    if (inProg) { nextModule = inProg; break; }
    const notStarted = phaseMods.find(m => !(rp.modules[m.id]) || rp.modules[m.id].status === 'not_started');
    if (notStarted) { nextModule = notStarted; break; }
  }

  // Upcoming badges (not earned, closest to earning)
  const earnedBadges = new Set(rp.badges || []);
  const upcomingBadges = BADGE_DEFS.filter(b => !earnedBadges.has(b.id)).slice(0, 3);

  // Recently completed modules
  const recentlyCompleted = allMods
    .filter(m => (rp.modules[m.id] || {}).status === 'completed' && rp.modules[m.id]?.completed_at)
    .sort((a,b) => new Date(rp.modules[b.id].completed_at) - new Date(rp.modules[a.id].completed_at))
    .slice(0, 3);

  return {
    repId,
    overallPct,
    currentLevel,
    nextLevel,
    points: rp.points || 0,
    streak_days: rp.streak_days || 0,
    last_activity: rp.last_activity,
    completedModules: completedMods.length,
    totalModules: allMods.length,
    badgesEarned: (rp.badges || []).length,
    totalBadges: BADGE_DEFS.length,
    quizzesPassed: rp.quizzes_passed || 0,
    phaseProgress,
    nextModule,
    upcomingBadges,
    recentlyCompleted,
    earnedBadgeIds: [...earnedBadges]
  };
}

function isModuleLocked(moduleId, repId) {
  const content = getAcademyContent();
  const mod = content.modules.find(m => m.id === moduleId);
  if (!mod) return true;
  const ph = content.phases.find(p => p.id === mod.phase_id);
  if (!ph || ph.unlock_mode !== 'prerequisite' || !ph.prerequisite_phase_id) return false;
  const rp = getRepProgress(repId);
  const prereqMods = content.modules.filter(m => m.phase_id === ph.prerequisite_phase_id);
  return !prereqMods.every(m => (rp.modules[m.id] || {}).status === 'completed');
}

// ─── Admin Progress View ─────────────────────────────────────────────────────
function getAllRepsProgress() {
  const content = getAcademyContent();
  const repsRaw = window.REPS || [];
  return repsRaw.map(rep => {
    const rp = getRepProgress(rep.id);
    const completedMods = content.modules.filter(m => (rp.modules[m.id] || {}).status === 'completed').length;
    const pct = Math.round((completedMods / content.modules.length) * 100);
    const level = calculateLevel(rp.points || 0);
    // Quiz avg
    const attempts = getAttempts();
    const repAttempts = attempts[rep.id] || {};
    const passedAttempts = Object.values(repAttempts).flatMap(a => a).filter(a => a.passed);
    const quizAvg = passedAttempts.length ? Math.round(passedAttempts.reduce((s, a) => s + a.percent_score, 0) / passedAttempts.length) : null;
    return {
      rep,
      pct,
      completedMods,
      totalMods: content.modules.length,
      level,
      points: rp.points || 0,
      badgesEarned: (rp.badges || []).length,
      quizzesPassed: rp.quizzes_passed || 0,
      quizAvg,
      streak: rp.streak_days || 0,
      last_activity: rp.last_activity
    };
  });
}

// ─── Reset (Admin utility) ───────────────────────────────────────────────────
function resetAcademyProgress(repId) {
  const all = getProgress();
  delete all[repId];
  saveProgress(all);
  const atts = getAttempts();
  delete atts[repId];
  saveAttempts(atts);
}

// ─── Expose to window ────────────────────────────────────────────────────────
window.Academy = {
  getContent:          getAcademyContent,
  getHomeData:         getAcademyHomeData,
  getRepProgress:      getRepProgress,
  getModuleProgress:   getModuleProgress,
  markSectionComplete: markSectionComplete,
  submitQuizAttempt:   submitQuizAttempt,
  getQuizAttempts:     getQuizAttempts,
  isModuleLocked:      isModuleLocked,
  calculateLevel:      calculateLevel,
  getNextLevel:        getNextLevel,
  getAllRepsProgress:   getAllRepsProgress,
  resetProgress:       resetAcademyProgress,
  trackEvent:          trackAcademyEvent,
  POINTS,
  LEVELS,
  BADGE_DEFS
};

// Auto-init content on load
initAcademyContent();
console.log('[Academy 2.0] Engine loaded');

})();
