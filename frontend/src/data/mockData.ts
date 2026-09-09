import {
  Material,
  ProcessingStep,
  DashboardStats,
  User,
  Chapter,
  KeyPointsData,
  Formula,
  GlossaryTerm,
  Flashcard,
  QuizQuestion,
  ExportContent,
  AnalyticsSummary,
  CopilotMessage,
  CopilotContext,
} from '../types';

export const mockUser: User = {
  id: 'user_pm_01',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const mockMaterials: Material[] = [
  {
    id: 'mat_dbms_01',
    title: 'DBMS Notes — Normalization Basics',
    subject: 'Computer Science',
    pages: 48,
    uploadDate: '2026-03-01T10:30:00Z',
    lastStudied: '2 hours ago',
    difficulty: 'MEDIUM',
    status: 'ready',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    originalFilename: 'DBMS_Unit3_Normalization_LectureNotes.pdf',
    summaryCounts: {
      quickGlance: true,
      deepSummary: true,
      examCram: true,
    },
    chapterCount: 5,
    formulaCount: 14,
    glossaryCount: 32,
    flashcardCount: 42,
    quizCount: 25,
  },
  {
    id: 'mat_os_02',
    title: 'OS Notes — Process & Deadlocks',
    subject: 'Computer Science',
    pages: 62,
    uploadDate: '2026-02-28T16:15:00Z',
    lastStudied: 'Yesterday',
    difficulty: 'HARD',
    status: 'ready',
    fileSize: '6.8 MB',
    fileType: 'PPTX',
    originalFilename: 'OS_Module4_Synchronization_Semaphores.pptx',
    summaryCounts: {
      quickGlance: true,
      deepSummary: true,
      examCram: true,
    },
    chapterCount: 6,
    formulaCount: 8,
    glossaryCount: 28,
    flashcardCount: 36,
    quizCount: 20,
  },
  {
    id: 'mat_cn_03',
    title: 'Computer Networks — Transport Layer Protocols (TCP/UDP) & Congestion Control',
    subject: 'Information Technology',
    pages: 35,
    uploadDate: '2026-02-26T09:00:00Z',
    lastStudied: '3 days ago',
    difficulty: 'MEDIUM',
    status: 'ready',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    originalFilename: 'CN_Lecture_12_TransportLayer.pdf',
    summaryCounts: {
      quickGlance: true,
      deepSummary: true,
      examCram: true,
    },
    chapterCount: 4,
    formulaCount: 11,
    glossaryCount: 24,
    flashcardCount: 30,
    quizCount: 15,
  },
];

export const defaultProcessingSteps: ProcessingStep[] = [
  {
    id: 'step_read',
    label: 'Reading your document',
    description: 'Parsing document structure, layout, diagrams, and section metadata',
    status: 'pending',
  },
  {
    id: 'step_extract',
    label: 'Extracting important content',
    description: 'Identifying core principles, key definitions, and hierarchy',
    status: 'pending',
  },
  {
    id: 'step_summarize',
    label: 'Creating summaries',
    description: 'Drafting Quick Glance, Deep Summary, and Exam Cram modules',
    status: 'pending',
  },
  {
    id: 'step_formulas',
    label: 'Extracting formulas',
    description: 'Isolating mathematical proofs, schemas, equations, and rules',
    status: 'pending',
  },
  {
    id: 'step_flashcards',
    label: 'Generating flashcards',
    description: 'Formulating spaced-repetition Q&A cards with difficulty tags',
    status: 'pending',
  },
  {
    id: 'step_quiz',
    label: 'Creating quiz',
    description: 'Constructing conceptual, scenario, and exam-grade assessment questions',
    status: 'pending',
  },
];

export const mockDashboardStats: DashboardStats = {
  materialsCount: 3,
  summariesCount: 9,
  flashcardsCount: 108,
  quizzesCount: 60,
};

// Phase 2 Study Datasets (DBMS - Normalization & Functional Dependencies)

export const mockQuickSummary = {
  coreIdea:
    "Database Normalization is the systematic process of structuring relational database schemas to eliminate data redundancy, prevent update, insert, and delete anomalies, and preserve data integrity using Functional Dependencies (FDs).",
  whatMattersMost: [
    "Functional Dependencies (X → Y)",
    "Attribute Closure & Candidate Keys",
    "First Normal Form (1NF — Atomic values)",
    "Second Normal Form (2NF — No partial dependencies)",
    "Third Normal Form (3NF — No transitive dependencies)",
    "Boyce-Codd Normal Form (BCNF — Every determinant is a candidate key)",
    "Lossless Join & Dependency Preservation",
  ],
  mustKnowDefinitions: [
    {
      term: "Functional Dependency (FD)",
      definition: "A constraint between two sets of attributes in a relation where attribute set X uniquely determines attribute set Y (written X → Y).",
    },
    {
      term: "Candidate Key",
      definition: "A minimal set of attributes that uniquely identifies every tuple in a relation.",
    },
    {
      term: "Partial Dependency",
      definition: "A dependency where a non-prime attribute depends on only a proper subset of a composite candidate key.",
    },
    {
      term: "Transitive Dependency",
      definition: "A dependency where X → Y and Y → Z exist, causing a non-prime attribute Z to indirectly depend on X through Y.",
    },
  ],
  essentialRules: [
    "1NF → All attribute values must be atomic (no non-atomic or multi-valued attributes).",
    "2NF → Must be in 1NF + No partial dependencies of non-prime attributes on any key.",
    "3NF → Must be in 2NF + No transitive dependencies of non-prime attributes on candidate keys.",
    "BCNF → For every non-trivial dependency X → Y, X must be a superkey.",
  ],
  rememberThis:
    "Every relation in BCNF is guaranteed to be in 3NF, 2NF, and 1NF. However, BCNF strictly eliminates all functional dependency anomalies, whereas 3NF may allow minor redundancy to preserve dependencies.",
  readingTimeMinutes: 1,
};

export const mockDeepSummary = {
  overview:
    "This comprehensive study module covers the core mathematical foundation of Relational Database Design: Functional Dependency theory, Candidate Key determination, Armstrong's Axioms, and the Normal Forms (1NF through BCNF).",
  sections: [
    {
      id: "sec-fd",
      number: 1,
      title: "Functional Dependencies (FDs)",
      explanation:
        "A Functional Dependency X → Y is a formal statement of constraint over relation schema R. It asserts that whenever two tuples t1 and t2 agree on attribute values X (t1[X] = t2[X]), they MUST also agree on attribute values Y (t1[Y] = t2[Y]). X is called the determinant and Y is the dependent.",
      example: {
        title: "Student Database Example",
        codeOrText:
          "StudentID → { StudentName, Department, Major }\nDepartment → DepartmentHead\nHere, StudentID uniquely identifies the student and their department.",
      },
      whyItMatters:
        "FDs provide the mathematical bedrock for discovering schema design flaws before software deployment.",
      callout: {
        type: "DEFINITION" as const,
        text: "Trivial FD: X → Y is trivial if Y is a subset of X (e.g., {StudentID, Name} → StudentID).",
      },
    },
    {
      id: "sec-norm",
      number: 2,
      title: "Normalization & Anomaly Control",
      explanation:
        "Without normalization, database schemas suffer from bad design patterns that result in redundant data storage, unneeded null values, and three dangerous database anomalies: Insertion Anomalies, Deletion Anomalies, and Modification/Update Anomalies.",
      requirements: [
        "Insertion Anomaly: Inability to insert a fact without inserting an unrelated fact.",
        "Deletion Anomaly: Unintended loss of critical data when deleting a specific row.",
        "Update Anomaly: Data inconsistency when updating duplicated facts in multiple rows.",
      ],
      callout: {
        type: "IMPORTANT" as const,
        text: "Goal of Normalization: Achieve Lossless Join Decomposition while preserving functional dependencies.",
      },
    },
    {
      id: "sec-1nf",
      number: 3,
      title: "First Normal Form (1NF)",
      explanation:
        "A relation schema R is in First Normal Form (1NF) if and only if the domain of each attribute contains only atomic (indivisible) values, and the value of each attribute in any tuple is a single value from the domain of that attribute.",
      requirements: [
        "Eliminate repeating groups in individual tables.",
        "Create a separate table for each set of related data.",
        "Identify each set of related data with a primary key.",
      ],
      example: {
        title: "Violation vs 1NF Compliant Schema",
        codeOrText:
          "Violation: Student(ID, Name, PhoneNumbers ['987-654', '123-456'])\n1NF Fix: Store each phone number in a separate tuple or dedicated Phone Table.",
      },
    },
    {
      id: "sec-2nf",
      number: 4,
      title: "Second Normal Form (2NF)",
      explanation:
        "A relation schema R is in 2NF if it is in 1NF and every non-prime attribute is FULLY functionally dependent on the primary key (or any candidate key). That is, no non-prime attribute is dependent on a proper subset of any candidate key.",
      requirements: [
        "Must satisfy 1NF.",
        "No partial dependencies allowed: If Candidate Key is {A, B}, then A → C (where C is non-prime) is a 2NF violation.",
      ],
      example: {
        title: "2NF Decomposition",
        codeOrText:
          "Relation R(StudentID, CourseID, StudentName, Grade)\nCandidate Key = {StudentID, CourseID}\nFD: StudentID → StudentName (Partial Dependency!)\nFix: Decompose into R1(StudentID, StudentName) and R2(StudentID, CourseID, Grade).",
      },
    },
    {
      id: "sec-3nf",
      number: 5,
      title: "Third Normal Form (3NF)",
      explanation:
        "A relation schema R is in 3NF if it is in 2NF and whenever a non-trivial functional dependency X → A holds in R, either X is a superkey of R, OR A is a prime attribute (part of a candidate key).",
      requirements: [
        "Must satisfy 2NF.",
        "No transitive dependencies: A non-prime attribute must not determine another non-prime attribute.",
      ],
      callout: {
        type: "EXAM NOTE" as const,
        text: "3NF Condition: For X → A, either X is a superkey or A is prime. This prime attribute relaxation allows 3NF to ALWAYS preserve dependencies.",
      },
    },
    {
      id: "sec-bcnf",
      number: 6,
      title: "Boyce-Codd Normal Form (BCNF)",
      explanation:
        "BCNF is a stricter version of 3NF. A relation schema R is in BCNF if for every non-trivial functional dependency X → A that holds in R, X is a SUPERKEY of R. Unlike 3NF, BCNF removes the 'A is prime attribute' exception clause.",
      keyDifferences:
        "In 3NF, X → A is allowed if A is prime even when X is not a key. BCNF forbids this, completely eliminating all redundancy driven by functional dependencies.",
      example: {
        title: "3NF vs BCNF Comparison",
        codeOrText:
          "Relation Advisor(Student, Subject, Advisor)\nFD1: {Student, Subject} → Advisor\nFD2: Advisor → Subject\nCandidate Keys: {Student, Subject} and {Student, Advisor}\nFD2 violates BCNF because Advisor is NOT a superkey, even though Subject is prime (which satisfied 3NF).",
      },
    },
  ],
};

export const mockExamCram = {
  mustRemember: [
    "Functional Dependency X → Y means X uniquely determines Y.",
    "Attribute Closure (X+) is the set of all attributes functionally determined by X.",
    "A set of attributes X is a Superkey if X+ contains all attributes of relation R.",
    "X is a Candidate Key if X is a minimal superkey (no proper subset of X is a superkey).",
    "1NF = Atomic values only, no nested lists or multi-valued attributes.",
    "2NF = 1NF + No partial dependency (non-prime depending on part of composite key).",
    "3NF = 2NF + No transitive dependency (non-prime depending on another non-prime).",
    "BCNF = For all X → Y, X MUST be a superkey.",
    "Hierarchy: BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF.",
    "3NF ALWAYS guarantees dependency preservation; BCNF may sometimes sacrifice dependency preservation to achieve zero redundancy.",
  ],
  criticalDefinitions: [
    {
      term: "Prime Attribute",
      definition: "An attribute that is a member of at least one candidate key for the relation.",
    },
    {
      term: "Non-Prime Attribute",
      definition: "An attribute that does NOT belong to any candidate key of the relation.",
    },
    {
      term: "Lossless Join Decomposition",
      definition: "Decomposition of R into R1 and R2 such that R1 ⋈ R2 = R without creating spurious tuples.",
    },
  ],
  ruleSheet: [
    { title: "Reflexivity Rule", rule: "If Y ⊆ X, then X → Y" },
    { title: "Augmentation Rule", rule: "If X → Y, then XZ → YZ" },
    { title: "Transitivity Rule", rule: "If X → Y and Y → Z, then X → Z" },
    { title: "Union Rule", rule: "If X → Y and X → Z, then X → YZ" },
    { title: "Decomposition Rule", rule: "If X → YZ, then X → Y and X → Z" },
  ],
  comparisons: {
    headers: ["Normal Form", "Key Requirement", "Eliminates", "Dependency Preserved?"],
    rows: [
      ["1NF", "Atomic attributes", "Multi-valued fields", "Yes"],
      ["2NF", "No partial dependency", "Partial key redundancy", "Yes"],
      ["3NF", "No transitive dependency", "Transitive non-prime redundancy", "Always"],
      ["BCNF", "Every determinant is a superkey", "All FD-driven redundancy", "Sometimes lost"],
    ],
  },
  commonTraps: [
    {
      trap: "Confusing Candidate Keys with Primary Key",
      explanation:
        "A relation can have multiple candidate keys. An attribute is prime if it belongs to ANY candidate key, not just the selected primary key.",
    },
    {
      trap: "Assuming 3NF implies BCNF",
      explanation:
        "False! If an FD X → A has a prime attribute A on the right side, it passes 3NF even if X is not a superkey. It will FAIL BCNF.",
    },
    {
      trap: "Checking 2NF on single-attribute keys",
      explanation:
        "If a table's candidate key consists of a single attribute, partial dependencies are IMPOSSIBLE. The table is automatically in 2NF!",
    },
  ],
  lastMinuteChecklist: [
    { id: "c1", label: "Understand functional dependencies (X → Y)", checked: true },
    { id: "c2", label: "Calculate attribute closures (X+) to find candidate keys", checked: true },
    { id: "c3", label: "Identify prime vs non-prime attributes", checked: false },
    { id: "c4", label: "Detect partial dependencies (2NF test)", checked: false },
    { id: "c5", label: "Detect transitive dependencies (3NF test)", checked: false },
    { id: "c6", label: "Verify BCNF condition (X is superkey for all X → Y)", checked: false },
  ],
};

export const mockChapters: Chapter[] = [
  {
    id: "chap-1",
    number: 1,
    title: "Functional Dependencies & Closure Theory",
    topics: [
      {
        id: "top-1-1",
        title: "Functional Dependency Foundations",
        points: [
          "Formal definition of X → Y determinism",
          "Trivial vs Non-trivial dependencies",
          "Full vs Partial functional dependencies",
        ],
      },
      {
        id: "top-1-2",
        title: "Armstrong's Axioms & Inference Rules",
        points: [
          "Primary Axioms: Reflexivity, Augmentation, Transitivity",
          "Secondary Rules: Union, Decomposition, Pseudo-transitivity",
          "Soundness and Completeness of Armstrong's Axioms",
        ],
      },
      {
        id: "top-1-3",
        title: "Attribute Closure Algorithm",
        points: [
          "Step-by-step calculation of X+",
          "Using X+ to test if X is a superkey",
          "Finding all Candidate Keys systematically",
        ],
      },
    ],
  },
  {
    id: "chap-2",
    number: 2,
    title: "Normalization & Database Normal Forms",
    topics: [
      {
        id: "top-2-1",
        title: "First Normal Form (1NF)",
        points: [
          "Atomicity of attributes and domain constraints",
          "Eliminating multi-valued & composite attributes",
        ],
      },
      {
        id: "top-2-2",
        title: "Second Normal Form (2NF)",
        points: [
          "Prime vs Non-prime attribute definitions",
          "Partial dependency identification and removal",
          "Decomposition into 2NF relations",
        ],
      },
      {
        id: "top-2-3",
        title: "Third Normal Form (3NF)",
        points: [
          "Transitive dependencies explained",
          "3NF condition: Superkey left side OR Prime attribute right side",
          "Dependency preservation proof",
        ],
      },
      {
        id: "top-2-4",
        title: "Boyce-Codd Normal Form (BCNF)",
        points: [
          "Strict determinant constraint (X must be superkey)",
          "Comparing 3NF vs BCNF trade-offs",
          "BCNF decomposition algorithm",
        ],
      },
    ],
  },
];

export const mockKeyPoints: KeyPointsData = {
  concepts: [
    {
      id: "kp-1",
      title: "Functional Dependency Determinism",
      priority: "CORE",
      explanation:
        "The fundamental rule X → Y dictates that two tuples with matching X values must have identical Y values.",
      iconName: "Key",
    },
    {
      id: "kp-2",
      title: "Attribute Closure (X+)",
      priority: "CORE",
      explanation:
        "Computing X+ gathers all attributes reachable from X. If X+ includes every attribute in R, X is a superkey.",
      iconName: "Cpu",
    },
    {
      id: "kp-3",
      title: "Lossless Join Property",
      priority: "EXAM FOCUS",
      explanation:
        "Decomposition of R into R1 and R2 is lossless if and only if R1 ∩ R2 → R1 OR R1 ∩ R2 → R2.",
      iconName: "Layers",
    },
    {
      id: "kp-4",
      title: "BCNF Strictness",
      priority: "IMPORTANT",
      explanation:
        "BCNF demands that every determinant X in X → Y is a superkey. It eliminates 100% of FD-based redundancy.",
      iconName: "ShieldCheck",
    },
  ],
  takeaways: [
    { id: "kt-1", statement: "Every relation in 2NF is guaranteed to be in 1NF." },
    { id: "kt-2", statement: "If a candidate key consists of only one attribute, the relation is automatically in 2NF." },
    { id: "kt-3", statement: "3NF allows X → A where A is prime even if X is not a key; BCNF strictly forbids this." },
    { id: "kt-4", statement: "3NF decomposition always preserves functional dependencies; BCNF decomposition may not." },
  ],
  topics: [
    {
      id: "ht-1",
      topic: "Armstrong's Axioms",
      importance: "High",
      oneLiner: "The sound and complete set of inference rules used to infer all dependencies implied by a set F.",
    },
    {
      id: "ht-2",
      topic: "Minimal Cover / Canonical Cover",
      importance: "Medium",
      oneLiner: "A simplified set of functional dependencies equivalent to F with no redundant dependencies or attributes.",
    },
    {
      id: "ht-3",
      topic: "Update Anomalies",
      importance: "High",
      oneLiner: "Inconsistencies caused when updating duplicated data across multiple unnormalized rows.",
    },
  ],
};

export const mockFormulas: Formula[] = [
  {
    id: "form-1",
    name: "First Normal Form (1NF)",
    formula: "Domain(Attribute) = Atomic Values",
    variables: [
      { symbol: "Domain", meaning: "Set of acceptable values for an attribute" },
      { symbol: "Atomic", meaning: "Single indivisible value (no lists or sets)" },
    ],
    explanation: "Eliminates multi-valued attributes and repeating attribute groups.",
    topic: "Normalization Rules",
    chapter: "Chapter 2",
    category: "Normalization Rules",
  },
  {
    id: "form-2",
    name: "Second Normal Form (2NF)",
    formula: "1NF + (∀ Non-Prime A: ProperSubset(Key) ⇸ A)",
    variables: [
      { symbol: "Non-Prime A", meaning: "Attribute not belonging to any candidate key" },
      { symbol: "ProperSubset(Key)", meaning: "Part of a composite candidate key" },
      { symbol: "⇸", meaning: "Does not functionally determine" },
    ],
    explanation: "Ensures no non-prime attribute is partially dependent on a composite key.",
    topic: "Normalization Rules",
    chapter: "Chapter 2",
    category: "Normalization Rules",
  },
  {
    id: "form-3",
    name: "Third Normal Form (3NF)",
    formula: "2NF + (∀ X → A: X is Superkey OR A is Prime)",
    variables: [
      { symbol: "X", meaning: "Determinant attribute set" },
      { symbol: "A", meaning: "Dependent attribute" },
      { symbol: "Prime", meaning: "Member of at least one candidate key" },
    ],
    explanation: "Eliminates transitive dependencies while ensuring dependency preservation.",
    topic: "Normalization Rules",
    chapter: "Chapter 2",
    category: "Normalization Rules",
  },
  {
    id: "form-4",
    name: "Boyce-Codd Normal Form (BCNF)",
    formula: "∀ non-trivial X → A : X is Superkey(R)",
    variables: [
      { symbol: "X → A", meaning: "Non-trivial functional dependency" },
      { symbol: "Superkey(R)", meaning: "Attribute set that uniquely identifies all tuples in R" },
    ],
    explanation: "Strict normal form requiring every determinant to be a superkey.",
    topic: "Normalization Rules",
    chapter: "Chapter 2",
    category: "Normalization Rules",
  },
  {
    id: "form-5",
    name: "Lossless Join Condition",
    formula: "(R1 ∩ R2 → R1) ∨ (R1 ∩ R2 → R2)",
    variables: [
      { symbol: "R1 ∩ R2", meaning: "Common attributes between decomposed relations R1 and R2" },
      { symbol: "→", meaning: "Functionally determines" },
    ],
    explanation: "Decomposition of R into R1 and R2 is lossless if the intersection is a key for R1 or R2.",
    topic: "Relational Math",
    chapter: "Chapter 1",
    category: "Proof",
  },
];

export const mockGlossary: GlossaryTerm[] = [
  {
    id: "gl-1",
    term: "Functional Dependency (FD)",
    definition: "A constraint between two sets of attributes in a relation such that X uniquely determines Y (X → Y).",
    example: "StudentID → {Name, Email, Major}",
    topic: "Functional Dependencies",
    chapter: "Chapter 1",
  },
  {
    id: "gl-2",
    term: "Candidate Key",
    definition: "A minimal superkey; a set of attributes that uniquely identifies every tuple without any redundant attributes.",
    example: "In Student(ID, SSN, Email), both ID and SSN are candidate keys.",
    topic: "Functional Dependencies",
    chapter: "Chapter 1",
  },
  {
    id: "gl-3",
    term: "Superkey",
    definition: "A set of attributes that uniquely identifies tuples in a relation schema.",
    example: "{StudentID, Name} is a superkey if StudentID is a candidate key.",
    topic: "Functional Dependencies",
    chapter: "Chapter 1",
  },
  {
    id: "gl-4",
    term: "Prime Attribute",
    definition: "An attribute that forms part of any candidate key of a relation.",
    example: "If candidate keys are {A, B} and {C}, then A, B, and C are prime attributes.",
    topic: "Normalization",
    chapter: "Chapter 2",
  },
  {
    id: "gl-5",
    term: "Non-Prime Attribute",
    definition: "An attribute that is not part of any candidate key of a relation.",
    example: "Grade in StudentCourse(StudentID, CourseID, Grade).",
    topic: "Normalization",
    chapter: "Chapter 2",
  },
  {
    id: "gl-6",
    term: "Partial Dependency",
    definition: "A dependency where a non-prime attribute depends on only a part of a composite candidate key.",
    example: "{StudentID, CourseID} → StudentName where StudentID → StudentName.",
    topic: "Normalization",
    chapter: "Chapter 2",
  },
  {
    id: "gl-7",
    term: "Transitive Dependency",
    definition: "A functional dependency X → Z derived indirectly from X → Y and Y → Z where Y is non-prime.",
    example: "EmpID → DeptID and DeptID → DeptName.",
    topic: "Normalization",
    chapter: "Chapter 2",
  },
  {
    id: "gl-8",
    term: "Boyce-Codd Normal Form (BCNF)",
    definition: "A strict normal form where every determinant in a non-trivial functional dependency must be a superkey.",
    topic: "Normalization",
    chapter: "Chapter 2",
  },
  {
    id: "gl-9",
    term: "Attribute Closure (X+)",
    definition: "The set of all attributes that are functionally determined by attribute set X under functional dependencies F.",
    topic: "Closure Theory",
    chapter: "Chapter 1",
  },
  {
    id: "gl-10",
    term: "Lossless Join Decomposition",
    definition: "A property guaranteeing that joining decomposed relations yields exactly the original relation without extra (spurious) tuples.",
    topic: "Relational Theory",
    chapter: "Chapter 1",
  },
  {
    id: "gl-11",
    term: "Insertion Anomaly",
    definition: "An inability to insert valid data into a database without inserting unrelated null or dummy values.",
    topic: "Anomalies",
    chapter: "Chapter 2",
  },
  {
    id: "gl-12",
    term: "Deletion Anomaly",
    definition: "The unintended destruction of critical data facts when deleting a specific tuple.",
    topic: "Anomalies",
    chapter: "Chapter 2",
  },
];

export const mockFlashcards: Flashcard[] = [
  {
    id: "fc-1",
    question: "What is a functional dependency?",
    answer: "A constraint between two attribute sets X and Y in a relation where the value of X uniquely determines the value of Y (X → Y).",
    topic: "Functional Dependencies",
    difficulty: "EASY",
    explanation: "If two tuples have identical X values, they MUST have identical Y values.",
  },
  {
    id: "fc-2",
    question: "What condition must a relation satisfy to be in 1NF?",
    answer: "All attribute values must be atomic (single indivisible values), with no repeating groups or nested relations.",
    topic: "Normalization",
    difficulty: "EASY",
    explanation: "Attributes cannot hold lists, sets, or composite objects.",
  },
  {
    id: "fc-3",
    question: "What is a partial dependency in 2NF context?",
    answer: "A functional dependency where a non-prime attribute depends on only a proper subset of a composite candidate key.",
    topic: "Normalization",
    difficulty: "MEDIUM",
    explanation: "For key {A, B}, A → C (where C is non-prime) is a partial dependency.",
  },
  {
    id: "fc-4",
    question: "How does 3NF define a valid functional dependency X → A?",
    answer: "X → A is valid in 3NF if X is a superkey OR A is a prime attribute.",
    topic: "Normalization",
    difficulty: "MEDIUM",
    explanation: "The prime attribute allowance enables 3NF to preserve all dependencies.",
  },
  {
    id: "fc-5",
    question: "What distinguishes BCNF from 3NF?",
    answer: "BCNF requires every determinant X in X → Y to be a superkey, removing the 'Y is prime attribute' exception found in 3NF.",
    topic: "Normalization",
    difficulty: "HARD",
    explanation: "BCNF strictly eliminates all redundancy caused by functional dependencies.",
  },
  {
    id: "fc-6",
    question: "What is an attribute closure X+?",
    answer: "The set of all attributes functionally determined by X given a set of functional dependencies F.",
    topic: "Functional Dependencies",
    difficulty: "MEDIUM",
    explanation: "If X+ contains all attributes of R, then X is a superkey.",
  },
  {
    id: "fc-7",
    question: "What is the difference between a Superkey and a Candidate Key?",
    answer: "A Superkey uniquely identifies tuples; a Candidate Key is a minimal Superkey with no redundant attributes.",
    topic: "Functional Dependencies",
    difficulty: "EASY",
    explanation: "Removing any attribute from a Candidate Key destroys its uniqueness property.",
  },
  {
    id: "fc-8",
    question: "What is Armstrong's Transitivity Axiom?",
    answer: "If X → Y and Y → Z hold, then X → Z also holds.",
    topic: "Functional Dependencies",
    difficulty: "EASY",
  },
  {
    id: "fc-9",
    question: "What is a Transitive Dependency?",
    answer: "A dependency where a non-prime attribute Z depends on X indirectly through another non-prime attribute Y (X → Y and Y → Z).",
    topic: "Normalization",
    difficulty: "MEDIUM",
  },
  {
    id: "fc-10",
    question: "What condition guarantees a Lossless Join when decomposing R into R1 and R2?",
    answer: "R1 ∩ R2 → R1 OR R1 ∩ R2 → R2 must hold in F+.",
    topic: "Normalization",
    difficulty: "HARD",
    explanation: "The common attributes must form a key for at least one of the decomposed tables.",
  },
  {
    id: "fc-11",
    question: "What is an Insertion Anomaly?",
    answer: "Being unable to add a new record into a table without also having to insert unneeded or dummy data into other fields.",
    topic: "Normalization",
    difficulty: "EASY",
  },
  {
    id: "fc-12",
    question: "If a table has a single-attribute candidate key, is it in 2NF?",
    answer: "Yes! Partial dependencies require a composite key. With a single-attribute key, partial dependencies are impossible.",
    topic: "Normalization",
    difficulty: "MEDIUM",
  },
  {
    id: "fc-13",
    question: "Can BCNF decomposition always preserve functional dependencies?",
    answer: "No. BCNF decomposition guarantees lossless join and zero FD redundancy, but may sacrifice dependency preservation.",
    topic: "Normalization",
    difficulty: "HARD",
  },
  {
    id: "fc-14",
    question: "What is a Trivial Functional Dependency?",
    answer: "A dependency X → Y where Y is a subset of X (Y ⊆ X).",
    topic: "Functional Dependencies",
    difficulty: "EASY",
    explanation: "Example: {StudentID, Name} → StudentID is always trivially true.",
  },
  {
    id: "fc-15",
    question: "What is a Deletion Anomaly?",
    answer: "Unintentionally losing valuable secondary information when a tuple is deleted.",
    topic: "Normalization",
    difficulty: "EASY",
  },
];

export const mockQuizQuestions: QuizQuestion[] = [
  // EASY QUESTIONS
  {
    id: "q-easy-1",
    type: "MCQ",
    question: "What is the primary objective of relational database normalization?",
    options: [
      "Eliminate data redundancy and prevent modification anomalies",
      "Maximize storage disk usage with repeated copies",
      "Merge all entities into a single universal table",
      "Encrypt database files for network transmission",
    ],
    correctAnswer: "Eliminate data redundancy and prevent modification anomalies",
    explanation: "Normalization decomposes redundant tables into smaller, well-structured relations to eliminate insertion, update, and deletion anomalies while maintaining data integrity.",
    topic: "Normalization",
    chapter: "Chapter 1",
    difficulty: "EASY",
    targetSection: "quick-glance",
  },
  {
    id: "q-easy-2",
    type: "TRUE_FALSE",
    question: "First Normal Form (1NF) permits composite or multivalued attributes within a column.",
    correctAnswer: "FALSE",
    explanation: "1NF strictly mandates that all column values must be atomic (indivisible) and each record must contain a unique value per column.",
    topic: "Normalization",
    chapter: "Chapter 2",
    difficulty: "EASY",
    targetSection: "deep-summary",
  },
  {
    id: "q-easy-3",
    type: "FILL_BLANK",
    question: "Normalization is primarily used to eliminate data ______ and modification anomalies.",
    correctAnswer: "redundancy",
    acceptableAnswers: ["redundancy", "duplication", "redundancies"],
    placeholder: "Type missing word...",
    explanation: "The core motivation behind normalization is eliminating data redundancy across rows and tables.",
    topic: "Normalization",
    chapter: "Chapter 1",
    difficulty: "EASY",
    targetSection: "quick-glance",
  },
  {
    id: "q-easy-4",
    type: "SHORT_ANSWER",
    question: "Explain what an Insertion Anomaly is in relational databases.",
    correctAnswer: "An insertion anomaly occurs when a new record cannot be inserted into a table without also having to supply dummy or unrelated data for other fields.",
    explanation: "For example, in an unnormalized student-course table, a new course cannot be recorded unless at least one student has enrolled in it.",
    topic: "Normalization",
    chapter: "Chapter 1",
    difficulty: "EASY",
    targetSection: "quick-glance",
  },
  {
    id: "q-easy-5",
    type: "MCQ",
    question: "A functional dependency X → Y is called a trivial functional dependency if:",
    options: [
      "Y is a subset of X (Y ⊆ X)",
      "X is a subset of Y (X ⊆ Y)",
      "X and Y have no common attributes",
      "Y contains only the primary key",
    ],
    correctAnswer: "Y is a subset of X (Y ⊆ X)",
    explanation: "A dependency X → Y is trivial whenever Y is already part of X (e.g., {StudentID, CourseID} → StudentID is always trivially true).",
    topic: "Functional Dependencies",
    chapter: "Chapter 1",
    difficulty: "EASY",
    targetSection: "formulas",
  },
  {
    id: "q-easy-6",
    type: "TRUE_FALSE",
    question: "A candidate key is defined as a minimal superkey that uniquely identifies tuples in a relation.",
    correctAnswer: "TRUE",
    explanation: "A candidate key has uniqueness and minimality (no proper subset of it is also a superkey).",
    topic: "Candidate Keys",
    chapter: "Chapter 1",
    difficulty: "EASY",
    targetSection: "glossary",
  },
  {
    id: "q-easy-7",
    type: "FILL_BLANK",
    question: "A non-prime attribute is an attribute that does not belong to any ______ key of the relation.",
    correctAnswer: "candidate",
    acceptableAnswers: ["candidate", "candidate key", "superkey"],
    placeholder: "Type attribute classification...",
    explanation: "Any attribute that is not a member of ANY candidate key is classified as a non-prime attribute.",
    topic: "Candidate Keys",
    chapter: "Chapter 2",
    difficulty: "EASY",
    targetSection: "glossary",
  },

  // MEDIUM QUESTIONS
  {
    id: "q-med-1",
    type: "MCQ",
    question: "A relation R is in Second Normal Form (2NF) if and only if it is in 1NF and:",
    options: [
      "No non-prime attribute is partially dependent on any candidate key",
      "No transitive dependencies exist between non-prime attributes",
      "Every determinant is a superkey",
      "Multi-valued dependencies are completely eliminated",
    ],
    correctAnswer: "No non-prime attribute is partially dependent on any candidate key",
    explanation: "2NF requires 1NF plus the absence of partial dependencies: every non-prime attribute must depend on the whole of every candidate key, not just a proper subset.",
    topic: "Normalization",
    chapter: "Chapter 2",
    difficulty: "MEDIUM",
    targetSection: "deep-summary",
  },
  {
    id: "q-med-2",
    type: "MCQ",
    question: "Which normal form permits a non-superkey determinant X in X → A, provided that A is a prime attribute?",
    options: [
      "Third Normal Form (3NF)",
      "Boyce-Codd Normal Form (BCNF)",
      "Second Normal Form (2NF)",
      "Fourth Normal Form (4NF)",
    ],
    correctAnswer: "Third Normal Form (3NF)",
    explanation: "In 3NF, for every non-trivial FD X → A, either X is a superkey OR A is a prime attribute. BCNF disallows the second condition completely.",
    topic: "Normalization",
    chapter: "Chapter 3",
    difficulty: "MEDIUM",
    targetSection: "exam-cram",
  },
  {
    id: "q-med-3",
    type: "TRUE_FALSE",
    question: "If a relation is in 1NF and its primary key consists of only a single attribute, it is automatically in 2NF.",
    correctAnswer: "TRUE",
    explanation: "A partial dependency can only occur when a candidate key is composite (has 2 or more attributes). With a single-attribute key, proper subsets cannot exist.",
    topic: "Normalization",
    chapter: "Chapter 2",
    difficulty: "MEDIUM",
    targetSection: "exam-cram",
  },
  {
    id: "q-med-4",
    type: "FILL_BLANK",
    question: "In 3NF, for every non-trivial FD X → A, either X is a superkey or A is a ______ attribute.",
    correctAnswer: "prime",
    acceptableAnswers: ["prime", "prime attribute", "key"],
    placeholder: "Type attribute type...",
    explanation: "This is the exact relaxation in 3NF that allows dependency preservation while removing transitive dependencies on non-prime attributes.",
    topic: "Normalization",
    chapter: "Chapter 3",
    difficulty: "MEDIUM",
    targetSection: "deep-summary",
  },
  {
    id: "q-med-5",
    type: "SHORT_ANSWER",
    question: "Explain the essential difference between 3NF and BCNF.",
    correctAnswer: "3NF allows X → A where X is not a superkey as long as A is a prime attribute. BCNF strictly requires that for every non-trivial dependency X → A, X must be a superkey.",
    explanation: "BCNF completely removes all functional dependency redundancy, whereas 3NF allows prime attributes on the right-hand side to preserve dependencies.",
    topic: "Normalization",
    chapter: "Chapter 3",
    difficulty: "MEDIUM",
    targetSection: "deep-summary",
  },
  {
    id: "q-med-6",
    type: "MCQ",
    question: "Given relation R(A, B, C, D) with candidate key {A, B} and functional dependency B → C. Which normal form is violated?",
    options: [
      "Second Normal Form (2NF) due to partial dependency",
      "Third Normal Form (3NF) due to transitive dependency",
      "First Normal Form (1NF) due to non-atomic values",
      "Fourth Normal Form (4NF) due to multivalued dependency",
    ],
    correctAnswer: "Second Normal Form (2NF) due to partial dependency",
    explanation: "{A, B} is the composite candidate key. Attribute B is a proper subset of {A, B}, so B → C is a partial dependency of non-prime attribute C on key attribute B.",
    topic: "Normalization",
    chapter: "Chapter 2",
    difficulty: "MEDIUM",
    targetSection: "deep-summary",
  },
  {
    id: "q-med-7",
    type: "TRUE_FALSE",
    question: "Decomposition into 3NF is always guaranteed to be both lossless-join and dependency-preserving.",
    correctAnswer: "TRUE",
    explanation: "Unlike BCNF, there is an algorithm (Bernstein's synthesis algorithm) that guarantees any relation can be decomposed into 3NF with both lossless join and dependency preservation.",
    topic: "Normalization",
    chapter: "Chapter 3",
    difficulty: "MEDIUM",
    targetSection: "exam-cram",
  },

  // HARD QUESTIONS
  {
    id: "q-hard-1",
    type: "MCQ",
    question: "Which condition mathematically guarantees a Lossless Join when decomposing relation R into R1 and R2?",
    options: [
      "(R1 ∩ R2 → R1) OR (R1 ∩ R2 → R2) must hold in F+",
      "(R1 ∪ R2 → R1) must hold in F+",
      "The intersection R1 ∩ R2 must be completely empty",
      "R1 and R2 must have an identical set of candidate keys",
    ],
    correctAnswer: "(R1 ∩ R2 → R1) OR (R1 ∩ R2 → R2) must hold in F+",
    explanation: "The common attributes between R1 and R2 must form a superkey for at least one of the decomposed relations to prevent spurious tuples during natural join.",
    topic: "Lossless Join",
    chapter: "Chapter 4",
    difficulty: "HARD",
    targetSection: "formulas",
  },
  {
    id: "q-hard-2",
    type: "MCQ",
    question: "What is the primary theoretical trade-off when decomposing a relation into BCNF instead of 3NF?",
    options: [
      "Functional dependency preservation cannot always be guaranteed in BCNF",
      "Lossless join decomposition is not achievable in BCNF",
      "BCNF relations suffer from higher insertion anomalies than 3NF",
      "BCNF requires multi-valued attributes to be reconstructed",
    ],
    correctAnswer: "Functional dependency preservation cannot always be guaranteed in BCNF",
    explanation: "While BCNF eliminates all redundancy based on FDs, some decompositions cannot preserve all original functional dependencies without creating cross-table constraints.",
    topic: "Normalization",
    chapter: "Chapter 3",
    difficulty: "HARD",
    targetSection: "exam-cram",
  },
  {
    id: "q-hard-3",
    type: "TRUE_FALSE",
    question: "Every relation schema that satisfies BCNF is guaranteed to also satisfy 3NF.",
    correctAnswer: "TRUE",
    explanation: "BCNF is strictly stronger than 3NF. Since every determinant in BCNF is a superkey, the 3NF condition is always trivially satisfied.",
    topic: "Normalization",
    chapter: "Chapter 3",
    difficulty: "HARD",
    targetSection: "key-points",
  },
  {
    id: "q-hard-4",
    type: "FILL_BLANK",
    question: "According to Armstrong's transitivity axiom, if X → Y and Y → Z hold, then X → ______ also holds.",
    correctAnswer: "Z",
    acceptableAnswers: ["Z", "z"],
    placeholder: "Target attribute...",
    explanation: "Transitivity states that if determinant X implies Y, and Y implies Z, then X transitively implies Z.",
    topic: "Armstrong Axioms",
    chapter: "Chapter 1",
    difficulty: "HARD",
    targetSection: "formulas",
  },
  {
    id: "q-hard-5",
    type: "SHORT_ANSWER",
    question: "Given relation R(A, B, C) with FDs {A, B} → C and C → B. Explain why R is in 3NF but NOT in BCNF.",
    correctAnswer: "Candidate keys are {A, B} and {A, C}. In C → B, C is not a superkey, violating BCNF. However, B is a prime attribute (part of candidate key {A, B}), so 3NF is satisfied.",
    explanation: "Because B is prime, C → B passes the 3NF condition (RHS is prime), but fails BCNF (LHS is not a superkey).",
    topic: "Normalization",
    chapter: "Chapter 3",
    difficulty: "HARD",
    targetSection: "deep-summary",
  },
  {
    id: "q-hard-6",
    type: "MCQ",
    question: "Consider relation R(A, B, C, D) with FDs A → B, B → C, C → D. What is the candidate key and highest normal form of R?",
    options: [
      "Candidate Key: {A}, Highest Normal Form: 2NF",
      "Candidate Key: {A, B}, Highest Normal Form: 3NF",
      "Candidate Key: {D}, Highest Normal Form: 1NF",
      "Candidate Key: {A}, Highest Normal Form: BCNF",
    ],
    correctAnswer: "Candidate Key: {A}, Highest Normal Form: 2NF",
    explanation: "Closure {A}+ = {A, B, C, D}, so {A} is the only candidate key. Since key is single attribute, 2NF holds. However, B → C and C → D have non-prime determinants on non-prime attributes (transitive dependencies), violating 3NF.",
    topic: "Normalization",
    chapter: "Chapter 2",
    difficulty: "HARD",
    targetSection: "deep-summary",
  },
];

export const mockExportData: ExportContent = {
  materialTitle: "DBMS Notes — Normalization Basics",
  subject: "Computer Science",
  date: "2026-03-01",
  quickGlance: "Database normalization is the systematic technique of organizing relational database schemas to eliminate redundant data and avoid modification anomalies (insertion, update, and deletion anomalies). The progression moves from 1NF (atomic values) to 2NF (no partial dependencies), 3NF (no transitive dependencies), and BCNF (every determinant is a superkey).",
  keyConcepts: [
    "Functional Dependency (X → Y): Attribute set X uniquely determines attribute set Y.",
    "Candidate Key: A minimal superkey with no redundant attributes.",
    "1NF: Atomic values only, no repeated groups or multivalued columns.",
    "2NF: In 1NF and no non-prime attribute is partially dependent on any candidate key.",
    "3NF: In 2NF and for every X → A, either X is a superkey or A is a prime attribute.",
    "BCNF: Stricter form of 3NF where every non-trivial determinant MUST be a superkey.",
    "Lossless Join Decomposition: Guarantees natural join of sub-relations yields original relation without spurious tuples.",
  ],
  deepSummary: "Section 1: The Problem of Redundancy. Redundant data causes storage waste, update anomalies, insertion anomalies, and deletion anomalies. Section 2: Functional Dependencies. Formalized by Armstrong's Axioms: Reflexivity, Augmentation, Transitivity. Section 3: Normal Forms Progression. 1NF mandates scalar atomicity. 2NF removes partial dependencies on composite candidate keys. 3NF removes transitive dependencies involving non-prime attributes. BCNF enforces that every functional determinant must be a candidate key.",
  formulas: [
    {
      name: "Armstrong's Transitivity Axiom",
      formula: "If X → Y and Y → Z, then X → Z",
      explanation: "Used to compute attribute closures and infer secondary functional dependencies.",
    },
    {
      name: "Lossless Join Condition",
      formula: "(R1 ∩ R2 → R1) ∨ (R1 ∩ R2 → R2)",
      explanation: "Common attributes between decomposed tables must form a superkey in at least one table.",
    },
    {
      name: "BCNF Strict Criterion",
      formula: "∀ (X → Y) ∈ F+, X is a Superkey of R",
      explanation: "Every functional determinant must be able to uniquely identify the entire relation.",
    },
  ],
  glossary: [
    {
      term: "Superkey",
      definition: "A set of attributes within a relation that uniquely identifies every tuple.",
    },
    {
      term: "Candidate Key",
      definition: "A minimal superkey from which no attribute can be removed without losing uniqueness.",
    },
    {
      term: "Prime Attribute",
      definition: "An attribute that is a member of at least one candidate key of the relation.",
    },
    {
      term: "Transitive Dependency",
      definition: "An indirect functional dependency where non-prime attribute Z depends on non-prime attribute Y which depends on candidate key X.",
    },
  ],
  examCram: [
    "Lossless join is ALWAYS guaranteed in 3NF and BCNF decompositions.",
    "Dependency preservation is ALWAYS guaranteed in 3NF, but NOT ALWAYS in BCNF.",
    "If candidate key is a single attribute, relation is AUTOMATICALLY in 2NF if in 1NF.",
    "Prime attributes on RHS save 3NF, but BCNF does NOT care about prime RHS.",
  ],
};

// ==========================================
// Phase 4: Mock Learning Analytics Data
// ==========================================

export const mockAnalyticsData7d: AnalyticsSummary = {
  period: '7d',
  studySessions: 12,
  studyTimeFormatted: '4h 35m',
  studyTimeMinutes: 275,
  flashcardsReviewed: 86,
  quizzesCompleted: 7,
  dailyActivity: [
    { day: 'Mon', minutes: 45, sessions: 2, date: '2026-03-03' },
    { day: 'Tue', minutes: 70, sessions: 3, date: '2026-03-04' },
    { day: 'Wed', minutes: 30, sessions: 1, date: '2026-03-05' },
    { day: 'Thu', minutes: 80, sessions: 3, date: '2026-03-06' },
    { day: 'Fri', minutes: 55, sessions: 2, date: '2026-03-07' },
    { day: 'Sat', minutes: 90, sessions: 4, date: '2026-03-08' },
    { day: 'Sun', minutes: 40, sessions: 1, date: '2026-03-09' },
  ],
  quizPerformance: {
    averageScore: 78,
    quizzesCompleted: 7,
    totalQuestions: 60,
    correctAnswers: 47,
    accuracyRate: 78.3,
    byDifficulty: {
      easy: 92,
      medium: 76,
      hard: 60,
    },
  },
  studyBreakdown: [
    { module: 'Quick Glance', count: 12, timeSpentMinutes: 25, percentage: 10, color: '#3B82F6' },
    { module: 'Deep Summary', count: 8, timeSpentMinutes: 80, percentage: 29, color: '#6366F1' },
    { module: 'Exam Cram', count: 6, timeSpentMinutes: 30, percentage: 11, color: '#F59E0B' },
    { module: 'Flashcards', count: 86, timeSpentMinutes: 75, percentage: 27, color: '#8B5CF6' },
    { module: 'Quizzes', count: 7, timeSpentMinutes: 65, percentage: 23, color: '#10B981' },
  ],
  recentActivity: [
    {
      id: 'act-1',
      type: 'flashcards',
      title: 'Completed 20 Flashcards Review',
      subject: 'Database Management Systems — Normalization',
      timestamp: '15 minutes ago',
      cardsReviewed: 20,
      materialId: 'mat_dbms_01',
      targetUrl: '/workspace/mat_dbms_01/flashcards',
      periodGroup: 'Today',
    },
    {
      id: 'act-2',
      type: 'quiz',
      title: 'Practice Quiz Assessment (Medium)',
      subject: 'Database Management Systems — Normalization',
      timestamp: '2 hours ago',
      score: '8/10 (80%)',
      materialId: 'mat_dbms_01',
      targetUrl: '/workspace/mat_dbms_01/quiz/results',
      periodGroup: 'Today',
    },
    {
      id: 'act-3',
      type: 'deep_summary',
      title: 'Studied Chapter 2: Normal Forms & Dependency Preservation',
      subject: 'Database Management Systems — Normalization',
      timestamp: 'Yesterday at 4:30 PM',
      materialId: 'mat_dbms_01',
      targetUrl: '/workspace/mat_dbms_01/deep-summary',
      periodGroup: 'Yesterday',
    },
    {
      id: 'act-4',
      type: 'exam_cram',
      title: 'Reviewed 5-Minute Exam Cram & Pitfall Traps',
      subject: 'Database Management Systems — Normalization',
      timestamp: 'Yesterday at 11:15 AM',
      materialId: 'mat_dbms_01',
      targetUrl: '/workspace/mat_dbms_01/exam-cram',
      periodGroup: 'Yesterday',
    },
    {
      id: 'act-5',
      type: 'upload',
      title: 'Uploaded Lecture Notes: DBMS Unit 3 Normalization',
      subject: 'Database Management Systems',
      timestamp: '3 days ago',
      materialId: 'mat_dbms_01',
      targetUrl: '/workspace/mat_dbms_01',
      periodGroup: 'This Week',
    },
  ],
  subjectActivity: [
    {
      subject: 'Database Management Systems',
      materialsCount: 2,
      hoursSpent: 3.4,
      progressPercent: 82,
      color: '#4F46E5',
    },
    {
      subject: 'Operating Systems',
      materialsCount: 1,
      hoursSpent: 0.8,
      progressPercent: 35,
      color: '#06B6D4',
    },
    {
      subject: 'Computer Networks',
      materialsCount: 1,
      hoursSpent: 0.4,
      progressPercent: 20,
      color: '#10B981',
    },
  ],
};

export const mockAnalyticsData30d: AnalyticsSummary = {
  ...mockAnalyticsData7d,
  period: '30d',
  studySessions: 38,
  studyTimeFormatted: '16h 20m',
  studyTimeMinutes: 980,
  flashcardsReviewed: 245,
  quizzesCompleted: 19,
  dailyActivity: [
    { day: 'Week 1', minutes: 210, sessions: 8, date: 'Feb 10 - Feb 16' },
    { day: 'Week 2', minutes: 260, sessions: 11, date: 'Feb 17 - Feb 23' },
    { day: 'Week 3', minutes: 235, sessions: 9, date: 'Feb 24 - Mar 02' },
    { day: 'Week 4', minutes: 275, sessions: 10, date: 'Mar 03 - Mar 09' },
  ],
  quizPerformance: {
    averageScore: 81,
    quizzesCompleted: 19,
    totalQuestions: 175,
    correctAnswers: 142,
    accuracyRate: 81.1,
    byDifficulty: {
      easy: 94,
      medium: 80,
      hard: 65,
    },
  },
};

export const mockAnalyticsDataAll: AnalyticsSummary = {
  ...mockAnalyticsData30d,
  period: 'all',
  studySessions: 64,
  studyTimeFormatted: '28h 45m',
  studyTimeMinutes: 1725,
  flashcardsReviewed: 430,
  quizzesCompleted: 31,
  quizPerformance: {
    averageScore: 82,
    quizzesCompleted: 31,
    totalQuestions: 290,
    correctAnswers: 238,
    accuracyRate: 82.1,
    byDifficulty: {
      easy: 95,
      medium: 82,
      hard: 68,
    },
  },
};

// ==========================================
// Phase 4: Contextual Copilot Knowledge Bank
// ==========================================

export const getContextualPrompts = (context: CopilotContext): string[] => {
  const mod = context.moduleName?.toLowerCase() || '';

  if (mod.includes('formula')) {
    return [
      'Explain 2NF partial dependency in simple terms',
      'What does X → Y mean in relational math?',
      'Why is 3NF easier to achieve than BCNF?',
      'Give me a practical example of a lossless join',
    ];
  }

  if (mod.includes('quiz/results') || mod.includes('result')) {
    return [
      'Explain why my answer on 3NF was wrong',
      'Teach me candidate keys from scratch',
      'Give me a similar practice question',
      'What are the most common exam traps?',
    ];
  }

  if (mod.includes('flashcard')) {
    return [
      'Give me a mnemonic to remember candidate keys',
      'Explain the difference between 3NF and BCNF',
      'Give a real-world student database example',
      'Quiz me on the next card concept',
    ];
  }

  if (mod.includes('deep-summary') || mod.includes('chapter')) {
    return [
      'Explain this chapter in simple terms',
      'What is the core takeaway for my exam?',
      'Give a real-world example of functional dependencies',
      'Create a flashcard from this section',
    ];
  }

  if (mod.includes('exam-cram')) {
    return [
      'What should I memorize in the next 5 minutes?',
      'What are the trickiest normal form questions?',
      'Summarize prime vs non-prime attributes',
      'Test me with a quick rapid-fire question',
    ];
  }

  // Default / Overview / Quick Glance prompts
  return [
    'Explain Normalization in simple terms',
    'What is the difference between 1NF, 2NF, and 3NF?',
    'Give me a real-world database example',
    'Quiz me on candidate keys',
  ];
};

export const getCopilotResponse = (
  userMessage: string,
  context: CopilotContext
): { content: string; actions: CopilotMessage['actions'] } => {
  const query = userMessage.toLowerCase();
  const mod = context.moduleName?.toLowerCase() || '';
  const matId = context.materialId || 'mat_dbms_01';

  // 1. 2NF / Partial Dependency Query
  if (query.includes('2nf') || query.includes('partial dependency') || query.includes('second normal')) {
    return {
      content: `### 💡 Simple Explanation\nThink of **2NF** as ensuring that every piece of information depends on the **WHOLE primary key**, not just a slice of it.\n\n### 📌 Example\nImagine a table with composite key **(StudentID, CourseID)**:\n- \`StudentID, CourseID → Grade\` (Valid: Grade depends on both student and course)\n- \`StudentID → StudentName\` (❌ **Partial Dependency!** StudentName depends only on StudentID, not the course)\n\nTo reach 2NF, move \`StudentName\` into a separate **Student** table.\n\n### 🧠 Exam Remember\n> **2NF = 1NF + No partial dependency** on any candidate key. If your candidate key is a single attribute, the relation is **automatically in 2NF**!`,
      actions: [
        { label: '🎯 Quiz Me on 2NF', actionType: 'quiz_me', targetUrl: `/workspace/${matId}/quiz/setup` },
        { label: '🗂 Make Flashcard', actionType: 'make_flashcard' },
        { label: '🔍 Explain Simpler', actionType: 'explain_simpler' },
      ],
    };
  }

  // 2. 3NF vs BCNF Query
  if (query.includes('3nf') || query.includes('bcnf') || query.includes('transitive') || query.includes('compare')) {
    return {
      content: `### 💡 Simple Explanation\n- **3NF**: Removes **transitive dependencies** (A → B → C). A non-key attribute cannot determine another non-key attribute.\n- **BCNF**: A stricter version of 3NF where **every determinant MUST be a superkey** (No exceptions!).\n\n### 📌 The Critical Difference\nIn **X → Y**:\n- In **3NF**, this is allowed if **Y is a prime attribute** (part of a candidate key).\n- In **BCNF**, this is **forbidden** unless **X is a superkey**.\n\n### 🧠 Exam Remember\n> **3NF always guarantees dependency preservation**, while **BCNF does not always preserve dependencies** when decomposing!`,
      actions: [
        { label: '🎯 Quiz Me on Normal Forms', actionType: 'quiz_me', targetUrl: `/workspace/${matId}/quiz/setup` },
        { label: '🗂 Make Flashcard', actionType: 'make_flashcard' },
        { label: '📖 Read Deep Summary', actionType: 'navigate', targetUrl: `/workspace/${matId}/deep-summary` },
      ],
    };
  }

  // 3. Candidate Key / Prime Attribute Query
  if (query.includes('candidate key') || query.includes('prime attribute') || query.includes('superkey') || query.includes('key')) {
    return {
      content: `### 💡 Simple Explanation\n- **Superkey**: Any set of attributes that uniquely identifies a row.\n- **Candidate Key**: A **minimal** superkey. If you drop even one column from it, it loses its uniqueness.\n- **Prime Attribute**: Any attribute that belongs to **at least one** candidate key.\n\n### 📌 Example\nIn \`Student(ID, Email, Phone, Name, Dept)\`:\n- Candidate Keys: \`{ID}\` and \`{Email}\`.\n- Prime Attributes: \`ID\`, \`Email\`.\n- Non-Prime Attributes: \`Phone\`, \`Name\`, \`Dept\`.\n\n### 🧠 Exam Remember\n> All candidate keys are superkeys, but not all superkeys are candidate keys!`,
      actions: [
        { label: '🗂 Make Flashcard', actionType: 'make_flashcard' },
        { label: '🎯 Practice Questions', actionType: 'quiz_me', targetUrl: `/workspace/${matId}/quiz/setup` },
        { label: '🔍 Explain Simpler', actionType: 'explain_simpler' },
      ],
    };
  }

  // 4. Functional Dependency (FD) Query
  if (query.includes('functional dependency') || query.includes('fd') || query.includes('arrow') || query.includes('determinant')) {
    return {
      content: `### 💡 Simple Explanation\nA **Functional Dependency (X → Y)** means: *"If two rows have the same value for X, they MUST have the same value for Y."*\n\n- **X** is called the **Determinant**.\n- **Y** is the **Dependent**.\n\n### 📌 Real-World Example\n- \`StudentID → StudentName\` (A student ID has exactly one name)\n- \`ZipCode → City\` (A zip code belongs to one specific city)\n- But \`City → ZipCode\` is **NOT** an FD, because a city can have dozens of zip codes!\n\n### 🧠 Exam Remember\n> Trivial FD: When Y is a subset of X (e.g., \`{A, B} → A\`). Always true by definition!`,
      actions: [
        { label: '🗂 Make Flashcard', actionType: 'make_flashcard' },
        { label: '🎯 Quiz Me', actionType: 'quiz_me', targetUrl: `/workspace/${matId}/quiz/setup` },
      ],
    };
  }

  // 5. Why was my answer wrong / Quiz mistakes query
  if (query.includes('wrong') || query.includes('mistake') || query.includes('why') || mod.includes('result')) {
    return {
      content: `### 💡 Diagnostic Breakdown\nMost students lose marks on Normalization because of two subtle technical traps:\n\n1. **Assuming 3NF and BCNF are identical**: They forget that 3NF has an escape clause for prime attributes on the right-hand side (\`X → Y\` is fine in 3NF if Y is prime).\n2. **Confusing partial vs transitive dependency**:\n   - **Partial**: Non-prime depends on part of a composite key (Violates 2NF).\n   - **Transitive**: Non-prime depends on another non-prime (Violates 3NF).\n\n### 🧠 How to get full marks\nAlways find **all Candidate Keys first**, list **all Prime Attributes**, and then check dependencies from 1NF through BCNF in order!`,
      actions: [
        { label: '🎯 Retry Practice Quiz', actionType: 'quiz_me', targetUrl: `/workspace/${matId}/quiz/setup` },
        { label: '⚡ Review 5-Min Cram', actionType: 'navigate', targetUrl: `/workspace/${matId}/exam-cram` },
        { label: '🗂 Flashcard Drill', actionType: 'navigate', targetUrl: `/workspace/${matId}/flashcards` },
      ],
    };
  }

  // 6. Explain simpler / Analogy
  if (query.includes('simple') || query.includes('analogy') || query.includes('child') || query.includes('eli5')) {
    return {
      content: `### 💡 The Kitchen Cabinet Analogy\nImagine organizing spices in your kitchen:\n\n- **1NF**: Don't put salt, pepper, and oregano in the same jar. Each jar holds **one single spice** (atomic values).\n- **2NF**: Don't label a jar "Mom & Dad's Coffee" if only Mom drinks it. Every label must apply to the **entire owner pair** (no partial dependencies).\n- **3NF**: Don't store the recipe for apple pie on the sugar jar just because sugar is used in apple pie. Keep recipes in a separate recipe book! (no transitive dependencies).\n\n### 🧠 Remember\n> Normalization is just tidying up your data so changing one thing doesn't make a mess everywhere else!`,
      actions: [
        { label: '🗂 Make Flashcard', actionType: 'make_flashcard' },
        { label: '🎯 Test My Understanding', actionType: 'quiz_me', targetUrl: `/workspace/${matId}/quiz/setup` },
      ],
    };
  }

  // Default contextual study fallback
  return {
    content: `### 💡 Key Concept Overview\nBased on your study material **${context.materialTitle || 'Database Management Systems'}**:\n\nThe topic focuses on designing relational databases without redundancy, update anomalies, or data loss.\n\n- **Core Goal**: Decompose relations to satisfy normal form conditions (1NF → 2NF → 3NF → BCNF).\n- **Golden Rule**: Preserve functional dependencies whenever possible and always ensure lossless joins.\n\n### 📌 Suggested Next Steps\nTry testing yourself on candidate keys, or asking for an example of a specific normal form!`,
    actions: [
      { label: '🎯 Quiz Me', actionType: 'quiz_me', targetUrl: `/workspace/${matId}/quiz/setup` },
      { label: '🗂 Make Flashcard', actionType: 'make_flashcard' },
      { label: '⚡ Exam Cram Sheet', actionType: 'navigate', targetUrl: `/workspace/${matId}/exam-cram` },
    ],
  };
};



