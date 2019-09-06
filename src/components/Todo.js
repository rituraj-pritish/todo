import React, { useState } from 'react';

import './Todo.scss';

const Todo = ({
  task,
  id,
  completed,
  updateTodo,
  removeTodo,
  updateCompleted
}) => {
  const [editing, toggleEditing] = useState(false);
  const [text, updateText] = useState(task);

  const color = completed ? 'green' : '';
  const done = completed ? 'strike' : '';

  const handleChange = e => {
    updateText(e.target.value);
  };

  const handleSave = () => {
    updateTodo(text, id);
    toggleEditing(!editing);
  };

  const render = editing ? (
    <div
      className='edit-container'
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 10px',
        padding: '0 25px'
      }}
    >
      <input
        className='ui fluid input'
        value={text}
        onChange={handleChange}
        style={{ width: '80%' }}
        autoFocus
      />
      <i className='thumbs up green outline icon' onClick={handleSave} />
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
          onClick={() => updateCompleted(id)}
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
