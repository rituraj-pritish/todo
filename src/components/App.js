import React, { useState } from 'react';

import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';

const App = () => {
  const [todos, updateTodos] = useState([]);

  return (
    <div className='App' style={{ textAlign: 'center' }}>
      <div className='container' style={{ width: '300px', margin: 'auto' }}>
        <div className='ui container'>
          <h2>Todos</h2>
          <NewTodoForm todos={todos} updateTodos={updateTodos} />
          <TodoList todos={todos} updateTodos={updateTodos} />
        </div>
      </div>
    </div>
  );
};

export default App;
