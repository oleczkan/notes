import React, { useState, useRef, useReducer, useEffect } from 'react';
import { View, Text, TextInput, Button, AsyncStorage } from 'react-native';


const ADD_NOTE = 'ADD_NOTE';
const DELETE_NOTE = 'DELETE_NOTE';
const EDIT_NOTE = 'EDIT_NOTE';

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
  
  const [notes, dispatch] = useReducer(notesReducer, []);

  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  
  const textInputRef = useRef(null);

  
  useEffect(() => {
    async function fetchNotes() {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes !== null) {
          dispatch({ type: 'INIT_NOTES', payload: JSON.parse(storedNotes) });
        }
      } catch (error) {
        console.error('Error retrieving notes: ', error);
      }
    }

    fetchNotes();
  }, []);

  
  useEffect(() => {
    async function saveNotes() {
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes: ', error);
      }
    }

    saveNotes();
  }, [notes]);

  const addNote = () => {
    if (title.trim() !== '' || content.trim() !== '') {
      dispatch({ type: ADD_NOTE, payload: { title, content } });
      setTitle('');
      setContent('');
    }
  };
  
  const deleteNote = index => {
    dispatch({ type: DELETE_NOTE, payload: index });
  };

  
  const editNote = (index, newNote) => {
    dispatch({ type: EDIT_NOTE, payload: { index, note: newNote } });
  };

  return (
    <View>
      <Text>Notes App</Text>
      <View>
        <TextInput
          placeholder="Note Title"
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <TextInput
          placeholder="Note Content"
          value={content}
          onChangeText={text => setContent(text)}
        />
        <Button title="Add Note" onPress={addNote} />
      </View>
      <View>
        {notes.map((note, index) => (
          <View key={index}>
            <Text>{note.title}</Text>
            <Text>{note.content}</Text>
            <Button title="Delete" onPress={() => deleteNote(index)} />
            <Button
              title="Edit"
              onPress={() => {
                setTitle(note.title);
                setContent(note.content);
                textInputRef.current.focus();
                deleteNote(index);
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default NotesApp;
