import React, { useState, useEffect } from 'react';

import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';

const App = () => {
  const [todos, updateTodos] = useState([]);

  useEffect(() => {
    updateTodos(JSON.parse(window.localStorage.getItem('todos')) || []);
  }, []);

  const handleSubmit = () => {
    window.localStorage.clear();
    updateTodos([]);
  };

  return (
    <div
      className='App'
      style={{
        textAlign: 'center',
        transform: 'scale(1.25)',
        marginTop: '100px',
        height: '70vh'
      }}
    >
      <div className='container' style={{ width: '300px', margin: 'auto' }}>
        <div className='ui container'>
          <h2>Todos</h2>
          <NewTodoForm todos={todos} updateTodos={updateTodos} />
          <TodoList todos={todos} updateTodos={updateTodos} />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className={`ui basic tiny fluid red button`}
        style={{ cursor: 'pointer', width: '200px', margin: '30px auto' }}
      >
        Remove All
      </button>
    </div>
  );
};

export default App;
