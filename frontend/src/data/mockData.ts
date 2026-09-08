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
    title: 'Database Management Systems — Normalization & Functional Dependencies',
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
    title: 'Operating Systems — Process Synchronization & Deadlocks',
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

