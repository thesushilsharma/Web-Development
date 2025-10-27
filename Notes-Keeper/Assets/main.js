// Storage Configuration using localStorage
const STORAGE_KEY = 'noteskeeper_data';
const COUNTER_KEY = 'noteskeeper_counter';

// Initialize Storage
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(COUNTER_KEY)) {
        localStorage.setItem(COUNTER_KEY, '0');
    }
}

// Storage Helper Functions
function getAllNotes() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        console.error('Error reading notes:', error);
        return [];
    }
}

function saveNotes(notes) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        return true;
    } catch (error) {
        console.error('Error saving notes:', error);
        showNotification('Error saving notes. Storage might be full.', 'error');
        return false;
    }
}

function getNextId() {
    const currentId = parseInt(localStorage.getItem(COUNTER_KEY)) || 0;
    const nextId = currentId + 1;
    localStorage.setItem(COUNTER_KEY, nextId.toString());
    return nextId;
}

// Initialize storage on load
initializeStorage();

// Global variables
let currentFilter = 'all';
let allNotes = [];

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getCategoryIcon(category) {
    const icons = {
        'personal': '📝',
        'work': '💼',
        'ideas': '💡',
        'important': '⭐',
        'todo': '✅'
    };
    return icons[category] || '📝';
}

function getCategoryColor(category) {
    const colors = {
        'personal': 'bg-blue-100 text-blue-800',
        'work': 'bg-purple-100 text-purple-800',
        'ideas': 'bg-yellow-100 text-yellow-800',
        'important': 'bg-red-100 text-red-800',
        'todo': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Enhanced function to display notes
function updateNotes() {
    const container = document.getElementById("savednotes");
    const emptyState = document.getElementById("emptyState");

    allNotes = getAllNotes();
    const filteredNotes = filterNotesByCategory(allNotes);

    if (filteredNotes.length === 0) {
        container.innerHTML = "";
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = "";

    filteredNotes.forEach(note => {
        const noteElement = createNoteElement(note);
        container.appendChild(noteElement);
    });
}

function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'bg-gray-50 rounded-lg p-4 border-l-4 border-primary hover:shadow-md transition-shadow duration-200';

    noteDiv.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
                <span class="text-lg">${getCategoryIcon(note.category)}</span>
                <h3 class="font-semibold text-gray-800">${escapeHtml(note.title)}</h3>
                <span class="px-2 py-1 text-xs rounded-full ${getCategoryColor(note.category)}">
                    ${note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                </span>
            </div>
            <div class="flex gap-2">
                <button onclick="toggleImportant(${note.id}, ${note.is_important})" 
                    class="text-yellow-500 hover:text-yellow-600 transition-colors">
                    ${note.is_important ? '⭐' : '☆'}
                </button>
                <button onclick="editNote(${note.id})" 
                    class="text-blue-500 hover:text-blue-600 transition-colors">
                    ✏️
                </button>
                <button onclick="deleteNote(${note.id})" 
                    class="text-red-500 hover:text-red-600 transition-colors">
                    🗑️
                </button>
            </div>
        </div>
        <p class="text-gray-700 mb-3 whitespace-pre-wrap">${escapeHtml(note.content)}</p>
        <div class="text-xs text-gray-500">
            Created: ${formatDate(note.created_at)}
            ${note.updated_at !== note.created_at ? `• Updated: ${formatDate(note.updated_at)}` : ''}
        </div>
    `;

    return noteDiv;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filter notes by category
function filterNotesByCategory(notes) {
    if (currentFilter === 'all') return notes;
    return notes.filter(note => note.category === currentFilter);
}

function filterNotes() {
    currentFilter = document.getElementById('filterCategory').value;
    outputNotes();
}

// Display all notes
function outputNotes() {
    updateNotes();
}

// Create new note
function createNote() {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("note").value.trim();
    const category = document.getElementById("category").value;

    if (!title) {
        showNotification("Please enter a title for your note", "error");
        document.getElementById("title").focus();
        return;
    }

    if (!content) {
        showNotification("Please enter some content for your note", "error");
        document.getElementById("note").focus();
        return;
    }

    const notes = getAllNotes();
    const newNote = {
        id: getNextId(),
        title: title,
        content: content,
        category: category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_important: false
    };

    notes.push(newNote);

    if (saveNotes(notes)) {
        showNotification("Note added successfully!");
        clearForm();
        clearDraft();
        outputNotes();
    }
}

// Toggle important status
function toggleImportant(id, currentStatus) {
    const notes = getAllNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex !== -1) {
        notes[noteIndex].is_important = !currentStatus;
        notes[noteIndex].updated_at = new Date().toISOString();

        if (saveNotes(notes)) {
            showNotification(notes[noteIndex].is_important ? "Note marked as important" : "Note unmarked as important");
            outputNotes();
        }
    }
}

// Edit note (simplified version - could be enhanced with modal)
function editNote(id) {
    const note = allNotes.find(n => n.id === id);
    if (!note) return;

    const newTitle = prompt("Edit title:", note.title);
    if (newTitle === null) return;

    const newContent = prompt("Edit content:", note.content);
    if (newContent === null) return;

    if (newTitle.trim() && newContent.trim()) {
        const notes = getAllNotes();
        const noteIndex = notes.findIndex(n => n.id === id);

        if (noteIndex !== -1) {
            notes[noteIndex].title = newTitle.trim();
            notes[noteIndex].content = newContent.trim();
            notes[noteIndex].updated_at = new Date().toISOString();

            if (saveNotes(notes)) {
                showNotification("Note updated successfully!");
                outputNotes();
            }
        }
    }
}

// Delete individual note
function deleteNote(id) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const notes = getAllNotes();
    const filteredNotes = notes.filter(note => note.id !== id);

    if (saveNotes(filteredNotes)) {
        showNotification("Note deleted successfully!");
        outputNotes();
    }
}

// Clear form
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("note").value = "";
    document.getElementById("category").value = "personal";
}

// Confirmation modal functions
function confirmClearDatabase() {
    document.getElementById("confirmModal").classList.remove('hidden');
    document.getElementById("confirmModal").classList.add('flex');
}

function hideConfirmModal() {
    document.getElementById("confirmModal").classList.add('hidden');
    document.getElementById("confirmModal").classList.remove('flex');
}

// Clear all notes
function clearDatabase() {
    hideConfirmModal();

    if (saveNotes([])) {
        localStorage.setItem(COUNTER_KEY, '0'); // Reset counter
        showNotification("All notes cleared successfully!");
        outputNotes();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + Enter to save note
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        createNote();
    }

    // Escape to clear form
    if (e.key === 'Escape') {
        clearForm();
    }
});

// Form submission handling
document.getElementById('noteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    createNote();
});

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    outputNotes();
    document.getElementById("title").focus();
});

// Auto-save draft (optional enhancement)
let draftTimer;
function saveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
        const title = document.getElementById("title").value;
        const content = document.getElementById("note").value;
        const category = document.getElementById("category").value;

        if (title || content) {
            localStorage.setItem('notesDraft', JSON.stringify({
                title, content, category, timestamp: Date.now()
            }));
        }
    }, 1000);
}

// Load draft on page load
function loadDraft() {
    const draft = localStorage.getItem('notesDraft');
    if (draft) {
        const draftData = JSON.parse(draft);
        // Only load if draft is less than 24 hours old
        if (Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000) {
            document.getElementById("title").value = draftData.title || '';
            document.getElementById("note").value = draftData.content || '';
            document.getElementById("category").value = draftData.category || 'personal';
        }
    }
}

// Add event listeners for auto-save
document.getElementById("title").addEventListener('input', saveDraft);
document.getElementById("note").addEventListener('input', saveDraft);
document.getElementById("category").addEventListener('change', saveDraft);

// Clear draft when note is saved
function clearDraft() {
    localStorage.removeItem('notesDraft');
}

// Load draft on page load
loadDraft();