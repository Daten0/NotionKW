import pool from '../config/db.js';
import { Note, NoteInput } from '../types/note.js';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { Context } from 'hono';

const noteRepository = {
  async findAll(): Promise<Note[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, created_at, updated_at FROM notes ORDER BY updated_at DESC'
    );
    return rows as Note[];
  },

  async findById(id: number): Promise<Note | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM notes WHERE id = ?', [id]);
    return rows[0] as Note | undefined;
  },

  async create({ title, content }: NoteInput): Promise<Note> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      [title, content]
    );
    const newNote = await this.findById(result.insertId);
    if (!newNote) {
      throw new Error('Failed to create or retrieve note.');
    }
    return newNote;
  },

  async update(id: number, { title, content }: NoteInput): Promise<Note | undefined> {
    await pool.query(
      'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, id]
    );
    return this.findById(id);
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM notes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

const noteController = {
  getAll: async (c: Context) => {
    try {
      const notes = await noteRepository.findAll();
      return c.json(notes);
    } catch (error: any) {
      return c.json({ message: 'Error fetching notes', error: error.message }, 500);
    }
  },

  getOne: async (c: Context) => {
    try {
      const id = Number(c.req.param('id'));
      if (isNaN(id)) {
        return c.json({ message: 'Invalid ID' }, 400);
      }
      const note = await noteRepository.findById(id);
      if (note) {
        return c.json(note);
      }
      return c.json({ message: 'Note not found' }, 404);
    } catch (error: any) {
      return c.json({ message: 'Error fetching note', error: error.message }, 500);
    }
  },

  create: async (c: Context) => {
    try {
      const body = await c.req.json<NoteInput>();
      if (!body.title || !body.content) {
        return c.json({ message: 'Title and content are required' }, 400);
      }
      const newNote = await noteRepository.create(body);
      return c.json(newNote, 201);
    } catch (error: any) {
      return c.json({ message: 'Error creating note', error: error.message }, 500);
    }
  },

  update: async (c: Context) => {
    try {
      const id = Number(c.req.param('id'));
      if (isNaN(id)) {
        return c.json({ message: 'Invalid ID' }, 400);
      }
      const body = await c.req.json<NoteInput>();
      if (!body.title || !body.content) {
        return c.json({ message: 'Title and content are required' }, 400);
      }
      const updatedNote = await noteRepository.update(id, body);
      if (updatedNote) {
        return c.json(updatedNote);
      }
      return c.json({ message: 'Note not found' }, 404);
    } catch (error: any) {
      return c.json({ message: 'Error updating note', error: error.message }, 500);
    }
  },

  delete: async (c: Context) => {
    try {
      const id = Number(c.req.param('id'));
      if (isNaN(id)) {
        return c.json({ message: 'Invalid ID' }, 400);
      }
      const success = await noteRepository.delete(id);
      if (success) {
        return c.body(null, 204);
      }
      return c.json({ message: 'Note not found' }, 404);
    } catch (error: any) {
      return c.json({ message: 'Error deleting note', error: error.message }, 500);
    }
  }
};

export { noteController };