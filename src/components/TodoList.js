import React from 'react';

import Todo from './Todo';

const TodoList = ({ todos, updateTodos }) => {
  const updateTodo = (updatedTask, id) => {
    updateTodos(
      todos.map(todo => {
        if (todo.id === id) return { ...todo, task: updatedTask };
        return todo;
      })
    );
  };

  const removeTodo = id => {
    updateTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className='ui  aligned divided list'>
      {todos.map(({ task, id }) => (
        <Todo
          task={task}
          id={id}
          key={id}
          updateTodo={updateTodo}
          removeTodo={removeTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;
