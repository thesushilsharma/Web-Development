// IndexedDB Configuration
const DB_NAME = 'NotesKeeperDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

let db = null;

// IndexedDB Helper Functions
function initializeDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Database failed to open');
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.log('Database opened successfully');
            resolve(db);
        };

        request.onupgradeneeded = (e) => {
            db = e.target.result;

            // Create object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });

                // Create indexes for better querying
                objectStore.createIndex('category', 'category', { unique: false });
                objectStore.createIndex('created_at', 'created_at', { unique: false });
                objectStore.createIndex('is_important', 'is_important', { unique: false });

                console.log('Database setup complete');
            }
        };
    });
}

// Get all notes from IndexedDB
function getAllNotes() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();

        request.onsuccess = () => {
            // Sort by importance and creation date
            const notes = request.result.sort((a, b) => {
                if (a.is_important !== b.is_important) {
                    return b.is_important - a.is_important;
                }
                return new Date(b.created_at) - new Date(a.created_at);
            });
            resolve(notes);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Add a new note to IndexedDB
function addNote(noteData) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);

        const note = {
            ...noteData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_important: false
        };

        const request = objectStore.add(note);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Update an existing note in IndexedDB
function updateNote(id, updates) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);

        // First get the existing note
        const getRequest = objectStore.get(id);

        getRequest.onsuccess = () => {
            const note = getRequest.result;
            if (!note) {
                reject(new Error('Note not found'));
                return;
            }

            // Update the note with new data
            const updatedNote = {
                ...note,
                ...updates,
                updated_at: new Date().toISOString()
            };

            const putRequest = objectStore.put(updatedNote);

            putRequest.onsuccess = () => {
                resolve(updatedNote);
            };

            putRequest.onerror = () => {
                reject(putRequest.error);
            };
        };

        getRequest.onerror = () => {
            reject(getRequest.error);
        };
    });
}

// Delete a note from IndexedDB
function deleteNoteFromDB(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Clear all notes from IndexedDB
function clearAllNotes() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

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
async function updateNotes() {
    const container = document.getElementById("savednotes");
    const emptyState = document.getElementById("emptyState");

    try {
        allNotes = await getAllNotes();
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
    } catch (error) {
        console.error('Error loading notes:', error);
        showNotification('Error loading notes', 'error');
    }
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
async function outputNotes() {
    await updateNotes();
}

// Create new note
async function createNote() {
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

    try {
        await addNote({
            title: title,
            content: content,
            category: category
        });

        showNotification("Note added successfully!");
        clearForm();
        clearDraft();
        await outputNotes();
    } catch (error) {
        console.error('Error creating note:', error);
        showNotification("Error adding note", "error");
    }
}

// Toggle important status
async function toggleImportant(id, currentStatus) {
    try {
        const newStatus = !currentStatus;
        await updateNote(id, { is_important: newStatus });

        showNotification(newStatus ? "Note marked as important" : "Note unmarked as important");
        await outputNotes();
    } catch (error) {
        console.error('Error toggling importance:', error);
        showNotification("Error updating note", "error");
    }
}

// Edit note (simplified version - could be enhanced with modal)
async function editNote(id) {
    const note = allNotes.find(n => n.id === id);
    if (!note) return;

    const newTitle = prompt("Edit title:", note.title);
    if (newTitle === null) return;

    const newContent = prompt("Edit content:", note.content);
    if (newContent === null) return;

    if (newTitle.trim() && newContent.trim()) {
        try {
            await updateNote(id, {
                title: newTitle.trim(),
                content: newContent.trim()
            });

            showNotification("Note updated successfully!");
            await outputNotes();
        } catch (error) {
            console.error('Error updating note:', error);
            showNotification("Error updating note", "error");
        }
    }
}

// Delete individual note
async function deleteNote(id) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
        await deleteNoteFromDB(id);
        showNotification("Note deleted successfully!");
        await outputNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
        showNotification("Error deleting note", "error");
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
async function clearDatabase() {
    hideConfirmModal();

    try {
        await clearAllNotes();
        showNotification("All notes cleared successfully!");
        await outputNotes();
    } catch (error) {
        console.error('Error clearing database:', error);
        showNotification("Error clearing notes", "error");
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
document.addEventListener('DOMContentLoaded', async function () {
    try {
        await initializeDB();
        await outputNotes();
        document.getElementById("title").focus();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showNotification('Failed to initialize database', 'error');
    }
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