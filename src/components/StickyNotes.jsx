import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Plus, X, Pin, Trash2 } from 'lucide-react';
import './StickyNotes.css';

const StickyNotes = () => {
    const [notes, setNotes] = useLocalStorage('rex_sticky_notes', []);
    const [newNote, setNewNote] = useState('');

    const addNote = () => {
        if (!newNote.trim()) return;
        // No more random colors, just plain list items
        setNotes([...notes, { id: Date.now(), text: newNote }]);
        setNewNote('');
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') addNote();
    };

    return (
        <div className="sticky-notes-widget">
            <div className="widget-header">
                <h3><Pin size={18} /> Quick Notes</h3>
            </div>

            <div className="add-note-row">
                <input
                    type="text"
                    placeholder="Jot down a thought..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={addNote} className="add-btn">
                    <Plus size={20} />
                </button>
            </div>

            <div className="notes-list">
                {notes.length === 0 && <div className="empty-state">No notes yet.</div>}

                {notes.map(note => (
                    <div key={note.id} className="note-item">
                        <span className="note-text">{note.text}</span>
                        <button onClick={() => deleteNote(note.id)} className="delete-btn">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StickyNotes;
