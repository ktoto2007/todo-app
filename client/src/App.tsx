import { useEffect, useState } from "react";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from "./api/todos";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  // загрузка задач
  const loadTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // добавить задачу
  const handleAdd = async () => {
    if (!title.trim()) return;

    const newTodo = await createTodo(title);
    setTodos([...todos, newTodo]);
    setTitle("");
  };

  // переключить completed
  const handleToggle = async (todo: Todo) => {
    const updated = await updateTodo(todo.id, !todo.completed);

    setTodos(
      todos.map((t) =>
        t.id === todo.id ? updated : t
      )
    );
  };

  // удалить
  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto" }}>
      <h1>Todo App</h1>
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая задача"
        />
        <button onClick={handleAdd}>
          Добавить
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
            />
            <span
              style={{
                textDecoration: todo.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {todo.title}
            </span>

            <button onClick={() => handleDelete(todo.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;