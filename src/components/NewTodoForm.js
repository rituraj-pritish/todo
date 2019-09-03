import React, { useState } from 'react';

const NewTodoForm = ({ todos, updateTodos }) => {
  const [text, updateText] = useState('');
  let [count, countPlusOne] = useState(0);
  const btnDisabled = text ? '' : 'disabled';

  const handleSubmit = e => {
    e.preventDefault();
    countPlusOne(count + 1);
    updateTodos([...todos, { task: text, id: count }]);
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
