import pool from '../config/db.js';
import { Note, NoteInput } from '../types/note.js';

export const noteRepository = {
  async findAll(): Promise<Note[]> {
    const [rows] = await pool.query<Note[]>(
      'SELECT id, title, content, created_at, updated_at FROM notes ORDER BY updated_at DESC'
    );
    return rows;
  },

  async findById(id: number): Promise<Note | undefined> {
    const [rows] = await pool.query<Note[]>('SELECT * FROM notes WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ title, content }: NoteInput): Promise<Note> {
    const [result] = await pool.query(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      [title, content]
    );
    return {
      id: (result as any).insertId,
      title,
      content,
      created_at: new Date(),
      updated_at: new Date()
    } as Note;
  },

  async update(id: number, { title, content }: NoteInput): Promise<Note> {
    await pool.query(
      'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, id]
    );
    return { id, title, content, created_at: new Date(), updated_at: new Date() } as Note;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM notes WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
};