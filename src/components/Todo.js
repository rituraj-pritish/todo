import React, { useState } from 'react';

import './Todo.scss';

const Todo = ({ task, id, updateTodo, removeTodo }) => {
  const [editing, toggleEditing] = useState(false);
  const [isDone, toggleDone] = useState(false);
  const [text, updateText] = useState(task);

  const color = isDone ? 'green' : '';
  const done = isDone ? 'strike' : '';

  const handleChange = e => {
    updateText(e.target.value);
  };

  const handleSave = () => {
    //update todo
    updateTodo(text, id);
    toggleEditing(!editing);
  };

  const render = editing ? (
    <div
      className='edit-container'
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 10px'
      }}
    >
      <input
        className='ui fluid input'
        value={text}
        onChange={handleChange}
        style={{ width: '80%' }}
        autoFocus
      />
      <i
        className='thumbs up green outline icon'
        onClick={handleSave}
        style={{ margin: 'auto' }}
      />
    </div>
  ) : (
    <div
      className='todo-container'
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 10px'
      }}
    >
      <div>
        <i
          onClick={() => toggleDone(!done)}
          className={`check ${color} icon`}
          style={{ marginRight: '10px' }}
        />
        <span className={done}>{task}</span>
      </div>
      <div>
        <i onClick={() => toggleEditing(!editing)} className='edit blue icon' />
        <i onClick={() => removeTodo(id)} className='times circle red icon' />
      </div>
    </div>
  );

  return (
    <div className='item' style={{ maxWidth: '300px', wordBreak: 'break-all' }}>
      {render}
    </div>
  );
};

export default Todo;
