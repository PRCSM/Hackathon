import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

/* ─── Enums ─── */
export type UserRole = "admin" | "teacher" | "student" | "parent";
export type ContentStatus = "processing" | "pending" | "approved" | "rejected" | "failed";
export type ConfidenceLabel = "weak" | "developing" | "proficient";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type NotificationType =
  | "content_ready" | "content_approved" | "content_rejected"
  | "quiz_completed" | "weak_topic_alert" | "assignment_due"
  | "teacher_approved" | "teacher_request" | "parent_linked"
  | "intervention_note" | "score_drop" | "new_feedback";
export type TeacherRequestStatus = "pending" | "approved" | "rejected";
export type AssignmentStatus = "assigned" | "submitted" | "graded";

/* ─── Table Types ─── */

// NextAuth
export interface AccountTable {
  id: Generated<string>;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}

export interface SessionTable {
  id: Generated<string>;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface VerificationTokenTable {
  identifier: string;
  token: string;
  expires: Date;
}

// Users
export interface UserTable {
  id: Generated<string>;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  onboarding_completed: ColumnType<boolean, boolean | undefined, boolean>;
  preferred_language: ColumnType<string, string | undefined, string>;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date>;
}

export interface ApprovedAdminTable {
  id: Generated<string>;
  email: string;
  added_at: ColumnType<Date, Date | undefined, never>;
}

export interface ApprovedTeacherTable {
  id: Generated<string>;
  email: string;
  added_by: string | null;
  added_at: ColumnType<Date, Date | undefined, never>;
}

export interface TeacherProfileTable {
  id: Generated<string>;
  user_id: string;
  subject: string | null;
  grade_level: string | null;
  school_name: string | null;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export interface StudentProfileTable {
  id: Generated<string>;
  user_id: string;
  roll_number: string | null;
  class: string | null;
  section: string | null;
  school_name: string | null;
  consent_given: ColumnType<boolean, boolean | undefined, boolean>;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export interface ParentProfileTable {
  id: Generated<string>;
  user_id: string;
  phone: string | null;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export interface ParentStudentLinkTable {
  id: Generated<string>;
  parent_id: string;
  student_id: string;
  verified: ColumnType<boolean, boolean | undefined, boolean>;
  linked_at: ColumnType<Date, Date | undefined, never>;
}

export interface TeacherRequestTable {
  id: Generated<string>;
  email: string;
  name: string | null;
  status: ColumnType<TeacherRequestStatus, TeacherRequestStatus | undefined, TeacherRequestStatus>;
  reviewed_by: string | null;
  created_at: ColumnType<Date, Date | undefined, never>;
  reviewed_at: Date | null;
}

// School
export interface SchoolSettingsTable {
  id: Generated<string>;
  school_name: string;
  academic_year: string | null;
  supported_languages: string[];
  subjects: string[];
  updated_by: string | null;
  updated_at: ColumnType<Date, Date | undefined, Date>;
}

export interface ClassroomTable {
  id: Generated<string>;
  name: string;
  grade: string;
  section: ColumnType<string, string | undefined, string>;
  subject: string;
  teacher_id: string;
  academic_year: string | null;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export interface ClassroomStudentTable {
  id: Generated<string>;
  classroom_id: string;
  student_id: string;
  joined_at: ColumnType<Date, Date | undefined, never>;
}

// Topics / Content
export interface TopicTable {
  id: Generated<string>;
  classroom_id: string;
  title: string;
  description: string | null;
  status: ColumnType<ContentStatus, ContentStatus | undefined, ContentStatus>;
  difficulty: DifficultyLevel | null;
  difficulty_score: number | null;
  s3_key: string | null;
  original_filename: string | null;
  file_type: string | null;
  extracted_text: string | null;
  key_phrases: string[] | null;
  ai_summary: string | null;
  created_by: string;
  approved_by: string | null;
  created_at: ColumnType<Date, Date | undefined, never>;
  approved_at: Date | null;
  updated_at: ColumnType<Date, Date | undefined, Date>;
}

export interface ExplanationTable {
  id: Generated<string>;
  topic_id: string;
  content: string;
  language: ColumnType<string, string | undefined, string>;
  created_at: ColumnType<Date, Date | undefined, never>;
}

// Quizzes
export interface QuizTable {
  id: Generated<string>;
  topic_id: string;
  title: string;
  language: ColumnType<string, string | undefined, string>;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export interface QuizQuestionTable {
  id: Generated<string>;
  quiz_id: string;
  question_text: string;
  options: unknown; // JSONB: string[]
  correct_answer: number;
  ai_explanation: string | null;
  difficulty: ColumnType<DifficultyLevel, DifficultyLevel | undefined, DifficultyLevel>;
  order_index: ColumnType<number, number | undefined, number>;
}

export interface QuizAttemptTable {
  id: Generated<string>;
  quiz_id: string;
  student_id: string;
  score: number;
  total_questions: number;
  answers: unknown; // JSONB
  time_taken_seconds: number | null;
  created_at: ColumnType<Date, Date | undefined, never>;
}

// Flashcards
export interface FlashcardSetTable {
  id: Generated<string>;
  topic_id: string;
  title: string;
  language: ColumnType<string, string | undefined, string>;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export interface FlashcardTable {
  id: Generated<string>;
  set_id: string;
  front_text: string;
  back_text: string;
  order_index: ColumnType<number, number | undefined, number>;
}

// Assignments
export interface AssignmentTable {
  id: Generated<string>;
  topic_id: string;
  classroom_id: string;
  title: string;
  description: string | null;
  due_date: Date | null;
  created_by: string;
  created_at: ColumnType<Date, Date | undefined, never>;
}

export interface AssignmentSubmissionTable {
  id: Generated<string>;
  assignment_id: string;
  student_id: string;
  status: ColumnType<AssignmentStatus, AssignmentStatus | undefined, AssignmentStatus>;
  score: number | null;
  feedback: string | null;
  submitted_at: Date | null;
  graded_at: Date | null;
}

// Analytics
export interface StudentTopicConfidenceTable {
  id: Generated<string>;
  student_id: string;
  topic_id: string;
  confidence_score: ColumnType<number, number | undefined, number>;
  confidence_label: ColumnType<ConfidenceLabel, ConfidenceLabel | undefined, ConfidenceLabel>;
  quiz_count: ColumnType<number, number | undefined, number>;
  last_quiz_at: Date | null;
  updated_at: ColumnType<Date, Date | undefined, Date>;
}

// Intervention Notes
export interface InterventionNoteTable {
  id: Generated<string>;
  teacher_id: string;
  student_id: string;
  topic_id: string | null;
  note: string;
  visible_to_parent: ColumnType<boolean, boolean | undefined, boolean>;
  created_at: ColumnType<Date, Date | undefined, never>;
}

// Notifications
export interface NotificationTable {
  id: Generated<string>;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  data: unknown | null; // JSONB
  read: ColumnType<boolean, boolean | undefined, boolean>;
  created_at: ColumnType<Date, Date | undefined, never>;
}

/* ─── Database Interface ─── */
export interface Database {
  accounts: AccountTable;
  sessions: SessionTable;
  verification_tokens: VerificationTokenTable;
  users: UserTable;
  approved_admins: ApprovedAdminTable;
  approved_teachers: ApprovedTeacherTable;
  teacher_profiles: TeacherProfileTable;
  student_profiles: StudentProfileTable;
  parent_profiles: ParentProfileTable;
  parent_student_links: ParentStudentLinkTable;
  teacher_requests: TeacherRequestTable;
  school_settings: SchoolSettingsTable;
  classrooms: ClassroomTable;
  classroom_students: ClassroomStudentTable;
  topics: TopicTable;
  explanations: ExplanationTable;
  quizzes: QuizTable;
  quiz_questions: QuizQuestionTable;
  quiz_attempts: QuizAttemptTable;
  flashcard_sets: FlashcardSetTable;
  flashcards: FlashcardTable;
  assignments: AssignmentTable;
  assignment_submissions: AssignmentSubmissionTable;
  student_topic_confidence: StudentTopicConfidenceTable;
  intervention_notes: InterventionNoteTable;
  notifications: NotificationTable;
}

/* ─── Convenience types ─── */
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Topic = Selectable<TopicTable>;
export type NewTopic = Insertable<TopicTable>;

export type Classroom = Selectable<ClassroomTable>;
export type NewClassroom = Insertable<ClassroomTable>;

export type Quiz = Selectable<QuizTable>;
export type QuizQuestion = Selectable<QuizQuestionTable>;
export type QuizAttempt = Selectable<QuizAttemptTable>;

export type Notification = Selectable<NotificationTable>;
export type StudentConfidence = Selectable<StudentTopicConfidenceTable>;
