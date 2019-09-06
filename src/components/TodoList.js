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
    window.localStorage.setItem('todo', JSON.stringify(todos));
  };

  const removeTodo = id => {
    updateTodos(todos = todos.filter(todo => todo.id !== id));
    window.localStorage.setItem('todos', JSON.stringify(todos));
  };

  const updateCompleted = id => {
    updateTodos(
      (todos = todos.map(todo => {
        if (todo.id === id) return { ...todo, completed: !todo.completed };
        return todo;
      }))
    );
    window.localStorage.setItem('todos', JSON.stringify(todos));
  };

  return (
    <div className='ui  aligned divided list'>
      {todos.map(({ task, id, completed }) => (
        <Todo
          task={task}
          id={id}
          key={id}
          completed={completed}
          updateTodo={updateTodo}
          removeTodo={removeTodo}
          updateCompleted={updateCompleted}
        />
      ))}
    </div>
  );
};

export default TodoList;
