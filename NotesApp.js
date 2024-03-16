import React, { useState, useRef, useReducer, useEffect } from 'react';

// Reducer actions
const ADD_NOTE = 'ADD_NOTE';
const DELETE_NOTE = 'DELETE_NOTE';
const EDIT_NOTE = 'EDIT_NOTE';

// Reducer function
const notesReducer = (state, action) => {
  switch (action.type) {
    case ADD_NOTE:
      return [...state, action.payload];
    case DELETE_NOTE:
      return state.filter((note, index) => index !== action.payload);
    case EDIT_NOTE:
      return state.map((note, index) =>
        index === action.payload.index ? { ...note, ...action.payload.note } : note
      );
    default:
      return state;
  }
};

const NotesApp = () => {
  // State for notes
  const [notes, dispatch] = useReducer(notesReducer, [], () => {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  });

  // State for title and content of the note being edited
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Ref for the text input
  const textInputRef = useRef(null);

  // Use effect to save notes in local storage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Function to handle adding a note
  const addNote = () => {
    if (title.trim() !== '' || content.trim() !== '') {
      dispatch({ type: ADD_NOTE, payload: { title, content } });
      setTitle('');
      setContent('');
    }
  };

  // Function to handle deleting a note
  const deleteNote = index => {
    dispatch({ type: DELETE_NOTE, payload: index });
  };

  // Function to handle editing a note
  const editNote = (index, newNote) => {
    dispatch({ type: EDIT_NOTE, payload: { index, note: newNote } });
  };

  return (
    <div>
      <h1>Notes App</h1>
      <div>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Note Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button onClick={addNote}>Add Note</button>
      </div>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(index)}>Delete</button>
            <button
              onClick={() => {
                setTitle(note.title);
                setContent(note.content);
                textInputRef.current.focus();
                deleteNote(index);
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesApp;
