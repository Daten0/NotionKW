import { Context } from 'hono';
import { noteRepository } from '../repositories/noteRepository.js';

export const noteController = {
  async getAll(c: Context) {
    try {
      const notes = await noteRepository.findAll();
      return c.json(notes);
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ [GET /notes]', err);
      return c.json({ error: 'Gagal mengambil catatan' }, 500);
    }
  },

  async getOne(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) return c.json({ error: 'ID tidak valid' }, 400);
      
      const note = await noteRepository.findById(id);
      if (!note) return c.json({ error: 'Catatan tidak ditemukan' }, 404);
      
      return c.json(note);
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ [GET /notes/:id]', err);
      return c.json({ error: 'Gagal memuat catatan' }, 500);
    }
  },

  async create(c: Context) {
    try {
      const body = await c.req.json<{ title?: string; content?: string }>();
      const { title, content } = body;
      
      const newNote = await noteRepository.create({ 
        title: title?.trim() || 'Tanpa Judul', 
        content: content || '' 
      });
      return c.json(newNote, 201);
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ [POST /notes]', err);
      return c.json({ error: 'Gagal membuat catatan' }, 500);
    }
  },

  async update(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      const body = await c.req.json<{ title?: string; content?: string }>();
      const { title, content } = body;
      
      const updated = await noteRepository.update(id, {
        title: title?.trim() || 'Tanpa Judul',
        content: content || ''
      });
      return c.json(updated);
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ [PUT /notes/:id]', err);
      return c.json({ error: 'Gagal memperbarui catatan' }, 500);
    }
  },

  async delete(c: Context) {
    try {
      const id = parseInt(c.req.param('id'));
      const success = await noteRepository.delete(id);
      if (!success) return c.json({ error: 'Catatan tidak ditemukan' }, 404);
      
      return c.json({ message: 'Catatan berhasil dihapus' });
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ [DELETE /notes/:id]', err);
      return c.json({ error: 'Gagal menghapus catatan' }, 500);
    }
  }
};