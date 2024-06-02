document.addEventListener('DOMContentLoaded', function () {
    const noteList = document.getElementById('noteList');
    const noteTitle = document.getElementById('noteTitle');
    const noteText = document.getElementById('noteText');
    const clearForm = document.getElementById('clearForm');
    const saveNote = document.getElementById('saveNote');
    const newNote = document.getElementById('newNote');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (notes.length === 0) {
        notes = [
            { id: '1', title: 'Call bank on Friday', text: 'Need to discuss loan options' },
            { id: '2', title: 'Reschedule delivery', text: 'Contact delivery service' },
            { id: '3', title: 'Finish payroll', text: 'Complete payroll processing' },
            { id: '4', title: 'Check in with clients', text: 'Update clients on project status' },
            { id: '5', title: 'Client lunch on Thursday', text: 'Schedule lunch meeting' }
        ];
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    let currentNoteId = null;

    function renderNotes() {
        noteList.innerHTML = '<li class="collection-header"><h5>Notes</h5></li>';
        notes.forEach(note => {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.innerHTML = `
                <span>${note.title}</span>
                <a class="secondary-content red-text" onclick="deleteNote('${note.id}')">
                    <i class="material-icons">delete</i>
                </a>
            `;
            li.addEventListener('click', () => loadNote(note.id));
            noteList.appendChild(li);
        });
    }

    function loadNote(id) {
        const note = notes.find(note => note.id === id);
        noteTitle.value = note.title;
        noteText.value = note.text;
        M.updateTextFields();
        currentNoteId = id;
        newNote.style.display = 'block';
        saveNote.style.display = 'none';
        clearForm.style.display = 'none';
    }

    function saveCurrentNote() {
        if (currentNoteId) {
            const note = notes.find(note => note.id === currentNoteId);
            note.title = noteTitle.value;
            note.text = noteText.value;
        } else {
            const newNote = {
                id: Date.now().toString(),
                title: noteTitle.value,
                text: noteText.value
            };
            notes.push(newNote);
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
        clearFormFields();
    }

    function clearFormFields() {
        noteTitle.value = '';
        noteText.value = '';
        M.updateTextFields();
        currentNoteId = null;
        saveNote.style.display = 'none';
        clearForm.style.display = 'none';
        newNote.style.display = 'none';
    }

    clearForm.addEventListener('click', clearFormFields);

    saveNote.addEventListener('click', saveCurrentNote);

    newNote.addEventListener('click', () => {
        clearFormFields();
        newNote.style.display = 'none';
    });

    noteTitle.addEventListener('input', () => {
        saveNote.style.display = 'block';
        clearForm.style.display = 'block';
    });

    noteText.addEventListener('input', () => {
        saveNote.style.display = 'block';
        clearForm.style.display = 'block';
    });

    window.deleteNote = function (id) {
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    };

    renderNotes();
});
