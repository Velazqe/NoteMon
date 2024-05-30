document.addEventListener('DOMContentLoaded', function () {
    const noteList = document.getElementById('noteList');
    const noteTitle = document.getElementById('noteTitle');
    const noteText = document.getElementById('noteText');
    const clearForm = document.getElementById('clearForm');
    const saveNote = document.getElementById('saveNote');
    const newNote = document.getElementById('newNote');

    let notes = [];
    let currentNoteId = null;

    async function fetchNotes() {
        const res = await fetch('/api/notes');
        notes = await res.json();
        renderNotes();
    }

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

    async function saveCurrentNote() {
        const newNote = {
            title: noteTitle.value,
            text: noteText.value
        };

        const res = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNote)
        });

        const savedNote = await res.json();
        notes.push(savedNote);
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

    window.deleteNote = async function (id) {
        notes = notes.filter(note => note.id !== id);
        await fetch(`/api/notes/${id}`, {
            method: 'DELETE'
        });
        renderNotes();
    };

    fetchNotes();
});
