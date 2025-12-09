// Data storage keys
const NOTES_KEY = 'notora_notes';
const CHECKLISTS_KEY = 'notora_checklists';

// Utility functions for localStorage
function getNotes() {
    const notes = localStorage.getItem(NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
}

function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function getChecklists() {
    const checklists = localStorage.getItem(CHECKLISTS_KEY);
    return checklists ? JSON.parse(checklists) : [];
}

function saveChecklists(checklists) {
    localStorage.setItem(CHECKLISTS_KEY, JSON.stringify(checklists));
}

// Notes CRUD operations
function createNote(title, body, color = '#ffffff') {
    const notes = getNotes();
    const note = {
        id: Date.now().toString(),
        title,
        body,
        color,
        pinned: false,
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    notes.push(note);
    saveNotes(notes);
    return note;
}

function updateNote(id, updates) {
    const notes = getNotes();
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notes[index] = { ...notes[index], ...updates };
        saveNotes(notes);
        return notes[index];
    }
    return null;
}

function deleteNote(id) {
    const notes = getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    saveNotes(filteredNotes);
}

function togglePinNote(id) {
    const notes = getNotes();
    const note = notes.find(note => note.id === id);
    if (note) {
        note.pinned = !note.pinned;
        saveNotes(notes);
    }
}

// Checklists operations
function addTask(text) {
    const checklists = getChecklists();
    const task = {
        id: Date.now().toString(),
        text,
        completed: false
    };
    checklists.push(task);
    saveChecklists(checklists);
    return task;
}

function toggleTask(id) {
    const checklists = getChecklists();
    const task = checklists.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        // Auto-sort: move completed to end
        const index = checklists.indexOf(task);
        checklists.splice(index, 1);
        checklists.push(task);
        saveChecklists(checklists);
    }
}

function deleteTask(id) {
    const checklists = getChecklists();
    const filteredChecklists = checklists.filter(task => task.id !== id);
    saveChecklists(filteredChecklists);
}

// Search and filter functions
function searchNotes(query) {
    const notes = getNotes();
    if (!query) return notes;
    return notes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.body.toLowerCase().includes(query.toLowerCase())
    );
}

function filterNotes(notes, filters) {
    let filtered = [...notes];
    if (filters.pinned) {
        filtered = filtered.filter(note => note.pinned);
    }
    if (filters.today) {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(note => note.date === today);
    }
    if (filters.checklist) {
        // For now, just return all notes (can be extended)
        filtered = filtered;
    }
    return filtered;
}

// Calendar functions
function createCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const calendar = [];
    let currentDate = new Date(startDate);

    for (let week = 0; week < 6; week++) {
        const weekDays = [];
        for (let day = 0; day < 7; day++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const isCurrentMonth = currentDate.getMonth() === month;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const hasNotes = getNotesForDate(dateStr).length > 0;

            weekDays.push({
                date: currentDate.getDate(),
                dateStr,
                isCurrentMonth,
                isToday,
                hasNotes
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        calendar.push(weekDays);
    }
    return calendar;
}

function getNotesForDate(dateStr) {
    const notes = getNotes();
    return notes.filter(note => note.date === dateStr);
}

// Render functions
function renderNotes() {
    const notesGrid = document.getElementById('notes-grid');
    if (!notesGrid) return;

    const searchQuery = document.getElementById('search-input')?.value || '';
    const filters = {
        pinned: document.getElementById('filter-pinned')?.classList.contains('active') || false,
        today: document.getElementById('filter-today')?.classList.contains('active') || false,
        checklist: document.getElementById('filter-checklist')?.classList.contains('active') || false
    };

    let notes = searchNotes(searchQuery);
    notes = filterNotes(notes, filters);

    // Sort: pinned first, then by date descending
    notes.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date) - new Date(a.date);
    });

    notesGrid.innerHTML = notes.map(note => `
        <div class="note-card ${note.pinned ? 'pinned' : ''}" style="background-color: ${note.color}" onclick="editNote('${note.id}')">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-preview">${note.body.substring(0, 100)}...</p>
            <p class="note-date">${note.date}</p>
            <span class="pin-icon" onclick="event.stopPropagation(); togglePin('${note.id}')">📌</span>
            <span class="delete-icon" onclick="event.stopPropagation(); deleteNote('${note.id}')">🗑️</span>
            <div class="share-buttons">
                <button class="share-text-btn" onclick="event.stopPropagation(); shareNoteAsText('${note.id}')">📄</button>
                <button class="share-image-btn" onclick="event.stopPropagation(); shareNoteAsImage('${note.id}')">🖼️</button>
            </div>
        </div>
    `).join('');
}

function renderChecklists() {
    const checklistContainer = document.getElementById('checklist-container');
    if (!checklistContainer) return;

    const checklists = getChecklists();
    checklistContainer.innerHTML = `
        <div class="add-task">
            <input type="text" id="new-task-input" placeholder="Add a new task">
            <button onclick="addNewTask()">Add</button>
        </div>
        <div id="tasks-list">
            ${checklists.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                    <span class="task-text">${task.text}</span>
                    <button class="delete-task" onclick="deleteTask('${task.id}')">×</button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderCalendar(year, month) {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;

    const calendar = createCalendar(year, month);
    calendarGrid.innerHTML = calendar.map(week =>
        week.map(day => `
            <div class="calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${day.isToday ? 'today' : ''} ${day.hasNotes ? 'has-notes' : ''}" onclick="showNotesForDate('${day.dateStr}')">
                ${day.date}
            </div>
        `).join('')
    ).join('');
}

// Event handlers
function editNote(id) {
    window.location.href = `note-editor.html?id=${id}`;
}

function togglePin(id) {
    togglePinNote(id);
    renderNotes();
}

function addNewTask() {
    const input = document.getElementById('new-task-input');
    const text = input.value.trim();
    if (text) {
        addTask(text);
        input.value = '';
        renderChecklists();
    }
}

// Calendar navigation
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function navigateMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
    updateCalendarHeader();
}

function updateCalendarHeader() {
    const header = document.getElementById('calendar-header');
    if (header) {
        header.innerHTML = `
            <button onclick="navigateMonth(-1)">‹</button>
            <h2>${new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
            <button onclick="navigateMonth(1)">›</button>
        `;
    }
}

function showNotesForDate(dateStr) {
    const notes = getNotesForDate(dateStr);
    const dayNotes = document.getElementById('day-notes');
    if (dayNotes) {
        dayNotes.innerHTML = `
            <h3>Notes for ${dateStr}</h3>
            ${notes.length ? notes.map(note => `<div class="note-card" style="background-color: ${note.color}"><h4>${note.title}</h4><p>${note.body}</p></div>`).join('') : '<p>No notes for this date.</p>'}
        `;
        dayNotes.classList.add('show');
    }
}

// Initialize functions
function initNotesPage() {
    renderNotes();
}

function initChecklistPage() {
    renderChecklists();
}

function initCalendarPage() {
    updateCalendarHeader();
    renderCalendar(currentYear, currentMonth);
}

function initNoteEditorPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        const notes = getNotes();
        const note = notes.find(n => n.id === id);
        if (note) {
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-body').innerHTML = note.body;
            document.querySelector(`.color-option[data-color="${note.color}"]`).classList.add('selected');
            // Show delete button for existing notes
            document.getElementById('delete-note-btn').style.display = 'inline-block';
        }
    }
}

function formatText(command, value = null) {
    const editor = document.getElementById('note-body');

    try {
        // Try modern execCommand first
        if (document.execCommand) {
            document.execCommand(command, false, value);
        } else {
            // Fallback for modern browsers
            console.warn('execCommand not supported, using alternative methods');

            // Handle specific commands with modern alternatives
            switch (command) {
                case 'bold':
                    document.execCommand('bold', false, null);
                    break;
                case 'italic':
                    document.execCommand('italic', false, null);
                    break;
                case 'underline':
                    document.execCommand('underline', false, null);
                    break;
                case 'insertUnorderedList':
                    document.execCommand('insertUnorderedList', false, null);
                    break;
                case 'insertOrderedList':
                    document.execCommand('insertOrderedList', false, null);
                    break;
                case 'fontSize':
                    document.execCommand('fontSize', false, value);
                    break;
                case 'backColor':
                    document.execCommand('backColor', false, value);
                    break;
                case 'justifyLeft':
                    document.execCommand('justifyLeft', false, null);
                    break;
                case 'justifyCenter':
                    document.execCommand('justifyCenter', false, null);
                    break;
                case 'justifyRight':
                    document.execCommand('justifyRight', false, null);
                    break;
                default:
                    console.warn('Command not supported:', command);
            }
        }
    } catch (error) {
        console.error('Error executing format command:', command, error);
    }

    editor.focus();
}

function saveNote() {
    console.log('saveNote function called');

    const titleElement = document.getElementById('note-title');
    const bodyElement = document.getElementById('note-body');

    if (!titleElement || !bodyElement) {
        console.error('Required elements not found');
        return;
    }

    const title = titleElement.value.trim();
    const body = bodyElement.innerHTML.trim();
    const color = document.querySelector('.color-option.selected')?.dataset.color || '#ffffff';

    console.log('Title:', title);
    console.log('Body:', body);
    console.log('Color:', color);

    if (!title || !body) {
        console.warn('Title or body is empty, not saving');
        alert('Please enter both a title and content for your note.');
        return;
    }

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        console.log('Note ID:', id);

        if (id) {
            const result = updateNote(id, { title, body, color });
            console.log('Updated note:', result);
        } else {
            const result = createNote(title, body, color);
            console.log('Created note:', result);
        }

        console.log('Redirecting to index.html');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Error saving note. Please try again.');
    }
}

// Share functions for current note in editor
function shareCurrentNoteAsText() {
    const title = document.getElementById('note-title').value.trim();
    const body = document.getElementById('note-body').innerHTML.trim();

    if (!title || !body) {
        alert('Please enter both a title and content before sharing.');
        return;
    }

    const textToShare = `📝 ${title}\n\n${body.replace(/<[^>]*>/g, '')}\n\nCreated with Notora`;

    if (navigator.share) {
        navigator.share({
            title: title,
            text: textToShare
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(textToShare).then(() => {
            alert('Note copied to clipboard!');
        }).catch(() => {
            // Fallback: open in new window
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`<pre>${textToShare}</pre>`);
        });
    }
}

function shareCurrentNoteAsImage() {
    const title = document.getElementById('note-title').value.trim();
    const body = document.getElementById('note-body').innerHTML.trim();
    const color = document.querySelector('.color-option.selected')?.dataset.color || '#ffffff';

    if (!title || !body) {
        alert('Please enter both a title and content before sharing.');
        return;
    }

    // Create a temporary element to render the note
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
        background-color: ${color};
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        font-family: Arial, sans-serif;
        color: #333;
        max-width: 400px;
        margin: 20px;
    `;
    tempDiv.innerHTML = `
        <h2 style="margin: 0 0 10px 0; color: #333;">${title}</h2>
        <div style="line-height: 1.5;">${body}</div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Created with Notora</p>
    `;

    document.body.appendChild(tempDiv);

    html2canvas(tempDiv).then(canvas => {
        canvas.toBlob(blob => {
            const file = new File([blob], `${title}.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                navigator.share({
                    title: title,
                    files: [file]
                }).catch(console.error);
            } else {
                // Fallback: download the image
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
        document.body.removeChild(tempDiv);
    }).catch(error => {
        console.error('Error generating image:', error);
        document.body.removeChild(tempDiv);
    });
}

function deleteCurrentNote() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        alert('No note to delete.');
        return;
    }

    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        deleteNote(id);
        window.location.href = 'index.html';
    }
}

// Share functions
function shareNoteAsText(id) {
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const textToShare = `📝 ${note.title}\n\n${note.body.replace(/<[^>]*>/g, '')}\n\nCreated: ${note.date}`;

    if (navigator.share) {
        navigator.share({
            title: note.title,
            text: textToShare
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(textToShare).then(() => {
            alert('Note copied to clipboard!');
        }).catch(() => {
            // Fallback: open in new window
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`<pre>${textToShare}</pre>`);
        });
    }
}

function shareNoteAsImage(id) {
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    if (!note) return;

    // Create a temporary element to render the note
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
        background-color: ${note.color};
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        font-family: Arial, sans-serif;
        color: #333;
        max-width: 400px;
        margin: 20px;
    `;
    tempDiv.innerHTML = `
        <h2 style="margin: 0 0 10px 0; color: #333;">${note.title}</h2>
        <div style="line-height: 1.5;">${note.body}</div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Created: ${note.date}</p>
    `;

    document.body.appendChild(tempDiv);

    html2canvas(tempDiv).then(canvas => {
        canvas.toBlob(blob => {
            const file = new File([blob], `${note.title}.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                navigator.share({
                    title: note.title,
                    files: [file]
                }).catch(console.error);
            } else {
                // Fallback: download the image
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${note.title}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
        document.body.removeChild(tempDiv);
    }).catch(error => {
        console.error('Error generating image:', error);
        document.body.removeChild(tempDiv);
    });
}
