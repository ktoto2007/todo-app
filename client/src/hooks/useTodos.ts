import { useEffect, useState } from "react"
import { getTodos, getTodosByFolder, createTodo, updateTodo, deleteTodo } from "../api/todos"

type Todo = {
  id: number
  title: string
  completed: boolean
  important: boolean
  deadline: string | null
  folder_id: number
  created_at: string
}
type Selected = number | "important" | "planned"

export function useTodos(selected: Selected | null, closeModal: () => void) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null)

  useEffect(() => {
    if (selected === null) return
    if (selected === "important") {
      getTodos().then(data => setTodos(data.filter((t: Todo) => t.important)))
    } else if (selected === "planned") {
      getTodos().then(data => setTodos(data.filter((t: Todo) => t.deadline !== null)))
    } else {
      getTodosByFolder(selected).then(data => setTodos(data))
    }
  }, [selected])

  const syncUpdate = (updated: Todo) => {
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
    setActiveTodo(prev => prev?.id === updated.id ? updated : prev)
  }

  const addTodo = async (title: string, folderId: number, deadline: string | null) => {
    const todo = await createTodo(title, folderId, deadline)
    setTodos(prev => [...prev, todo])
  }

  const toggleCompleted = async (todo: Todo) => {
    syncUpdate(await updateTodo(todo.id, { completed: !todo.completed }))
  }

  const toggleImportant = async (todo: Todo) => {
    syncUpdate(await updateTodo(todo.id, { important: !todo.important }))
  }

  const updateDeadline = async (todo: Todo, deadline: string | null) => {
    syncUpdate(await updateTodo(todo.id, { deadline }))
  }

  const renameTodo = async (todo: Todo, title: string) => {
    if (!title.trim() || title === todo.title) return
    syncUpdate(await updateTodo(todo.id, { title: title.trim() }))
  }

  const removeTodo = async (id: number) => {
    await deleteTodo(id)
    setTodos(prev => prev.filter(t => t.id !== id))
    closeModal()
  }

  const handleTodoClick = (todo: Todo, openModal: () => void) => {
    setActiveTodo(todo)
    openModal()
  }

  return {
    todos, activeTodo, setActiveTodo,
    addTodo, toggleCompleted, toggleImportant, updateDeadline, renameTodo, removeTodo, handleTodoClick
  }
}