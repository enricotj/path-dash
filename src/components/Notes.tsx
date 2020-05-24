import React from 'react';

/*

TODO:
- Add delete functionality (with modal dialog)
- Fix edit bug with keyboard navigation (start editting a note, tab to another one and try editing it)
- Import from CSV
- Fix vertical scroll
- Fix horizontal scroll
- Note re-ordering (drag & drop, keyboard control, etc.)
- Insert notes in stack functionality (similar to how you insert columns to a table in Word?)
- Fix empty space notes
- Add keyboard shortcut to go back to previously edited note

COMMAND LINE UPGRADES:
- Color coded tags
- 'bang' commands: !loot or !treasure, for example
- @mentions (with auto-complete and fuzzy match)
  - Modal to add new NPC if no mention found

*/

export const Notes = (): React.ReactElement => {
  const [ text, setText ] = React.useState('');
  const [ notes, setNotes ] = React.useState<string[]>([]);
  const [ editIndex, setEditIndex ] = React.useState(-1);
  const [ editText, setEditText ] = React.useState('');
  const textRef = React.createRef<HTMLInputElement>();

  // Save the text to the list of notes on 'Enter'.
  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent): void => {
      if (ev.key === 'Enter') {
        setNotes([ text, ...notes ]);
        setText('');
      }
    }, [text, notes]);
  
  // Ensure that the text field for the note entry properly updates.
  const onChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>): void => {
      setText(ev.target.value);
    }, []);
  
  // Save in-line note edit.
  const editNote = React.useCallback(
    (newEditIndex) => {
      if (editIndex >= 0) {
        let newNotes = notes;
        newNotes[editIndex] = editText;
        setNotes(newNotes);
      }
      if ((newEditIndex < 0) && textRef.current) {
        textRef.current.focus();
      }
      setEditIndex(newEditIndex);
    }, [notes, editIndex, editText]);

  // Save the in-line note edit on 'Enter'.
  const onEditKeyDown = React.useCallback(
    (ev: React.KeyboardEvent): void => {
      if (ev.key === 'Enter') {
        editNote(-1);
      }
    }, [notes, editText]);
  
  // Ensure that the text field for the note we are currently editing properly updates.
  const onEdit = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>): void => {
      setEditText(ev.target.value);
    }, []);
  
  // When a note is clicked, start editing it.
  const onStartEdit = React.useCallback((note, index) => {
    editNote(index);
    setEditText(note);
  }, []);

  const onNoteKeyDown = React.useCallback((ev: React.KeyboardEvent, note, index) => {
    if (ev.key === ' ' || ev.key === 'Enter') {
      onStartEdit(note, index);
    }
  }, []);

  const noteItems = notes.map((note, index) => {
    if (index === editIndex) {
      return (
        <input
          className='list-item input is-focused'
          onFocus={ (ev: React.FocusEvent<HTMLInputElement>) => { ev.target.select() } }
          autoFocus
          type='text'
          value={ editText }
          onKeyDown={ onEditKeyDown }
          onChange={ onEdit } /> );
    }
    return (
      <a
        className='list-item'
        tabIndex={ 0 }
        onClick={ () => { onStartEdit(note, index); } }
        onKeyDown={ (ev) => { onNoteKeyDown(ev, note, index); } }>
        { note }
      </a>);
  });

  return (
    <>
      <input ref={ textRef } className='input' type='text' autoFocus value={ text } onKeyDown={ onKeyDown } onChange={ onChange } />
      <div className="panel list is-hoverable" style={ { marginTop: '10px', height: '90%%' } }>
        { noteItems }
      </div>
    </>
  );
};
