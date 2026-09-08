-- ==============================================================================
-- PreMindAI Smart Study Material Generator — Supabase Database Schema
-- Run this script directly in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Enable pgcrypto / uuid extension for automatic UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Documents Table (Stores PDF upload metadata and processing status)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT,
    file_url TEXT,
    file_size BIGINT,
    mime_type TEXT,
    difficulty TEXT DEFAULT 'MEDIUM',
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    user_id TEXT DEFAULT 'anonymous',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Summaries Table (Quick summary, detailed summary, exam cram notes, chapters, key points)
CREATE TABLE IF NOT EXISTS public.summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    quick_summary TEXT DEFAULT '',
    detailed_summary TEXT DEFAULT '',
    exam_notes TEXT DEFAULT '',
    key_points JSONB DEFAULT '[]'::jsonb,
    chapters JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Flashcards Table (Question-Answer pairs, topic, difficulty)
CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    flashcards JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Quizzes Table (MCQs partitioned by easy, medium, hard)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    easy JSONB DEFAULT '[]'::jsonb,
    medium JSONB DEFAULT '[]'::jsonb,
    hard JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Definitions Table (Technical glossary and definitions)
CREATE TABLE IF NOT EXISTS public.definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    definitions JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Formulas Table (Equations, mathematical laws, theorems)
CREATE TABLE IF NOT EXISTS public.formulas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    formulas JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Indexes for High Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_summaries_document_id ON public.summaries(document_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_document_id ON public.flashcards(document_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_document_id ON public.quizzes(document_id);
CREATE INDEX IF NOT EXISTS idx_definitions_document_id ON public.definitions(document_id);
CREATE INDEX IF NOT EXISTS idx_formulas_document_id ON public.formulas(document_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- Enables reads and inserts for public / service_role
-- ==============================================================================
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formulas ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access (ideal for hackathons and service APIs)
DO $$ 
BEGIN
    -- Documents
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public access to documents') THEN
        CREATE POLICY "Public access to documents" ON public.documents FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Summaries
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public access to summaries') THEN
        CREATE POLICY "Public access to summaries" ON public.summaries FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Flashcards
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public access to flashcards') THEN
        CREATE POLICY "Public access to flashcards" ON public.flashcards FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Quizzes
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public access to quizzes') THEN
        CREATE POLICY "Public access to quizzes" ON public.quizzes FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Definitions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public access to definitions') THEN
        CREATE POLICY "Public access to definitions" ON public.definitions FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Formulas
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public access to formulas') THEN
        CREATE POLICY "Public access to formulas" ON public.formulas FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
