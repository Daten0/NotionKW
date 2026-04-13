export interface Note {
  id: number;
  title: string;
  content: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface NoteInput {
  title: string;
  content: string;
}