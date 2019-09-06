import React, { useState } from 'react';
import uuid from 'uuid/v4';

const NewTodoForm = ({ todos, updateTodos }) => {
  const [text, updateText] = useState('');
  const btnDisabled = text ? '' : 'disabled';

  const handleSubmit = e => {
    e.preventDefault();
    updateTodos((todos = [...todos, { task: text, id: uuid(), completed: false }]));
    window.localStorage.setItem('todos', JSON.stringify(todos));
    updateText('');
  };

  const handleChange = e => {
    updateText(e.target.value);
  };

  return (
    <form>
      <div className='ui action input'>
        <input
          type='text'
          placeholder='add todo'
          onChange={handleChange}
          value={text}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className={`ui basic olive ${btnDisabled} button`}
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default NewTodoForm;
