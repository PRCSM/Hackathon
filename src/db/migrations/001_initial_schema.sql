-- ═══════════════════════════════════════════════════════════
-- PadhAI — Database Schema Migration v2
-- Fixed to be compatible with @auth/pg-adapter
-- PostgreSQL 15+
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ───
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'parent');
CREATE TYPE content_status AS ENUM ('processing', 'pending', 'approved', 'rejected', 'failed');
CREATE TYPE confidence_label AS ENUM ('weak', 'developing', 'proficient');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE notification_type AS ENUM (
  'content_ready', 'content_approved', 'content_rejected',
  'quiz_completed', 'weak_topic_alert', 'assignment_due',
  'teacher_approved', 'teacher_request', 'parent_linked',
  'intervention_note', 'score_drop', 'new_feedback'
);
CREATE TYPE teacher_request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE assignment_status AS ENUM ('assigned', 'submitted', 'graded');

-- ═══════════════════════════════════════════════════════════
-- NextAuth tables — MUST match @auth/pg-adapter exactly
-- Uses SERIAL integer IDs, not UUIDs
-- ═══════════════════════════════════════════════════════════

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  -- Extra PadhAI columns (adapter ignores these)
  role user_role NOT NULL DEFAULT 'student',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  preferred_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL
);

CREATE TABLE verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ═══════════════════════════════════════════════════════════
-- PadhAI Application Tables (use UUID for our own tables)
-- ═══════════════════════════════════════════════════════════

-- Approved admin whitelist
CREATE TABLE approved_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approved teacher whitelist
CREATE TABLE approved_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  added_by INTEGER REFERENCES users(id),
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher profile details
CREATE TABLE teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100),
  grade_level VARCHAR(10),
  school_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student profile details
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  roll_number VARCHAR(50),
  class VARCHAR(10),
  section VARCHAR(5),
  school_name VARCHAR(255),
  consent_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent profiles
CREATE TABLE parent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent ↔ Student linking
CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verified BOOLEAN DEFAULT FALSE,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- Teacher approval requests
CREATE TABLE teacher_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  status teacher_request_status DEFAULT 'pending',
  reviewed_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- School settings
CREATE TABLE school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name VARCHAR(255) NOT NULL,
  academic_year VARCHAR(20),
  supported_languages TEXT[] DEFAULT ARRAY['en'],
  subjects TEXT[] DEFAULT ARRAY[]::TEXT[],
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classrooms
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  section VARCHAR(5) DEFAULT 'A',
  subject VARCHAR(100) NOT NULL,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  academic_year VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE classroom_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(classroom_id, student_id)
);

-- Topics / Content
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status content_status DEFAULT 'processing',
  difficulty difficulty_level,
  difficulty_score FLOAT,
  s3_key VARCHAR(500),
  original_filename VARCHAR(255),
  file_type VARCHAR(20),
  extracted_text TEXT,
  key_phrases TEXT[],
  ai_summary TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id),
  approved_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  ai_explanation TEXT,
  difficulty difficulty_level DEFAULT 'medium',
  order_index INTEGER DEFAULT 0
);

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards
CREATE TABLE flashcard_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID NOT NULL REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Assignments
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status assignment_status DEFAULT 'assigned',
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  UNIQUE(assignment_id, student_id)
);

-- Analytics
CREATE TABLE student_topic_confidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  confidence_score FLOAT DEFAULT 0,
  confidence_label confidence_label DEFAULT 'weak',
  quiz_count INTEGER DEFAULT 0,
  last_quiz_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, topic_id)
);

-- Intervention Notes
CREATE TABLE intervention_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  topic_id UUID REFERENCES topics(id),
  note TEXT NOT NULL,
  visible_to_parent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════════════

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_accounts_user ON accounts("userId");
CREATE INDEX idx_sessions_user ON sessions("userId");
CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX idx_classroom_students_classroom ON classroom_students(classroom_id);
CREATE INDEX idx_classroom_students_student ON classroom_students(student_id);
CREATE INDEX idx_topics_classroom ON topics(classroom_id);
CREATE INDEX idx_topics_status ON topics(status);
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_student_confidence_student ON student_topic_confidence(student_id);
CREATE INDEX idx_student_confidence_topic ON student_topic_confidence(topic_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX idx_parent_links_parent ON parent_student_links(parent_id);
CREATE INDEX idx_parent_links_student ON parent_student_links(student_id);
CREATE INDEX idx_assignments_classroom ON assignments(classroom_id);
CREATE INDEX idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_intervention_notes_student ON intervention_notes(student_id);
