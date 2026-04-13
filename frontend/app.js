// 🔌 Konfigurasi API (akan di-proxy oleh Nginx di Docker nanti)
const API_BASE = '/api'; 

let currentNoteId = null;
let autoSaveTimer = null;
const DEBOUNCE_DELAY = 1200; // ms

const titleInput = document.getElementById('note-title');
const markdownInput = document.getElementById('markdown-input');
const previewDiv = document.getElementById('markdown-preview');
const notesList = document.getElementById('notes-list');
const saveBtn = document.getElementById('save-btn');
const newNoteBtn = document.getElementById('new-note-btn');

document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    setupListeners();
});

function setupListeners() {
    saveBtn.addEventListener('click', saveNote);
    newNoteBtn.addEventListener('click', createNewNote);
    
    // Realtime Preview + Auto-save
    markdownInput.addEventListener('input', () => {
        updatePreview();
        triggerAutoSave();
    });
    titleInput.addEventListener('input', triggerAutoSave);
}

function updatePreview() {
    // Render markdown mentah ke HTML
    previewDiv.innerHTML = marked.parse(markdownInput.value || '');
}

// ⏱️ Debounce: Mencegah save berlebihan saat mengetik cepat
function triggerAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async () => {
        if (titleInput.value.trim() || markdownInput.value.trim()) {
            await saveNote();
        }
    }, DEBOUNCE_DELAY);
}

async function loadNotes() {
    try {
        const res = await fetch(`${API_BASE}/notes`);
        const notes = await res.json();
        renderSidebar(notes);
    } catch (err) {
        console.error('❌ Gagal memuat catatan:', err);
    }
}

function renderSidebar(notes) {
    notesList.innerHTML = '';
    notes.forEach(note => {
        const li = document.createElement('li');
        li.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
        li.innerHTML = `
            <span class="note-title">${note.title || 'Tanpa Judul'}</span>
            <div class="note-actions">
                <button onclick="loadNote(${note.id})" title="Edit">✏️</button>
                <button onclick="deleteNote(${note.id})" title="Hapus">🗑️</button>
            </div>
        `;
        // Klik area catatan (bukan tombol) -> load note
        li.addEventListener('click', (e) => {
            if (!e.target.closest('button')) loadNote(note.id);
        });
        notesList.appendChild(li);
    });
}

async function loadNote(id) {
    try {
        const res = await fetch(`${API_BASE}/notes/${id}`);
        const note = await res.json();
        currentNoteId = note.id;
        titleInput.value = note.title;
        markdownInput.value = note.content;
        updatePreview();
        // Refresh sidebar agar highlight aktif
        const allNotes = await (await fetch(`${API_BASE}/notes`)).json();
        renderSidebar(allNotes);
    } catch (err) {
        console.error('❌ Gagal memuat detail catatan:', err);
    }
}

function createNewNote() {
    currentNoteId = null;
    titleInput.value = '';
    markdownInput.value = '';
    updatePreview();
}

async function saveNote() {
    const title = titleInput.value.trim() || 'Tanpa Judul';
    const content = markdownInput.value;
    const isUpdate = !!currentNoteId;
    const url = isUpdate ? `${API_BASE}/notes/${currentNoteId}` : `${API_BASE}/notes`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        const data = await res.json();
        
        // Jika baru dibuat, simpan ID yang dikembalikan backend
        if (!isUpdate) currentNoteId = data.id;
        
        await loadNotes(); // Refresh sidebar
        console.log('✅ Catatan berhasil disimpan');
    } catch (err) {
        console.error('❌ Gagal menyimpan catatan:', err);
    }
}

async function deleteNote(id) {
    if (!confirm('Yakin ingin menghapus catatan ini?')) return;
    try {
        await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
        if (currentNoteId === id) createNewNote();
        await loadNotes();
    } catch (err) {
        console.error('❌ Gagal menghapus catatan:', err);
    }
}