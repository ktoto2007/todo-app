import { useEffect, useState } from "react"
import { getTodos, getTodosByFolder, createTodo, updateTodo, deleteTodo } from "./api/todos"
import { getFolders, createFolder, deleteFolder, updateFolder } from "./api/folders"
import Modal from "./Modal.tsx"
import "./App.css"
import folderStarIcon from "./assets/folder-star.png"
import calendarIcon from "./assets/calendar.png"
import binIcon from "./assets/bin.png"
import userFolderIcon from "./assets/user-folder-icon.png"

type Folder = { id: number; name: string }

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

const FolderItem = (props: { folder: Folder; active: boolean; onClick: () => void }) => {
  return (
    <div className={`folder-row ${props.active ? "active" : ""}`} onClick={props.onClick}>
      <img className="folder-icon" src={userFolderIcon} alt="" />
      <span>{props.folder.name}</span>
    </div>
  )
}

type TodoRowProps = {
  todo: Todo
  onCheck: (todo: Todo) => void
  onStar: (todo: Todo) => void
  onClick: (todo: Todo) => void
}

const TodoRow = (props: TodoRowProps) => {
  const todo = props.todo
  return (
    <div className="todo-row" onClick={() => props.onClick(todo)}>
      <input title="Отметить как выполненное" type="checkbox" className="todo-check" checked={props.todo.completed}
        onChange={() => props.onCheck(todo)} onClick={e => e.stopPropagation()} />
      <div className="todo-content">
        <span className="todo-name">{todo.title}</span>
        {todo.deadline && <span className="todo-date">📅 {todo.deadline}</span>}
      </div>
      <button title={!todo.important ? "Пометить как важную" : "Убрать пометку о важности"
      } className={`star-btn ${todo.important ? "starred" : ""}`}
        onClick={e => { e.stopPropagation(); props.onStar(todo) }}>
        {todo.important ? "★" : "☆"}
      </button>
    </div>
  )
}

function App() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [selected, setSelected] = useState<Selected | null>(null)
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null)
  const [display, setDisplay] = useState("none")
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDeadline, setNewDeadline] = useState("")

  const openModal = () => setDisplay("flex")
  const closeModal = () => setDisplay("none")

  useEffect(() => {
    getFolders().then(data => {
      setFolders(data)
      if (data.length > 0) setSelected(data[0].id)
    })
  }, [])

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

  const selectFolder = (id: Selected) => {
    setSelected(id)
    setIsAdding(false)
    closeModal()
  }

  const handleAddFolder = async () => {
    const name = folders.length === 0 ? "Список без названия" : `Список без названия (${folders.length})`
    const folder = await createFolder(name)
    setFolders([...folders, folder])
    setSelected(folder.id)
  }

  const handleDeleteFolder = async (id: number) => {
    await deleteFolder(id)
    const remaining = folders.filter(f => f.id !== id)
    setFolders(remaining)
    if (selected === id) {
      setSelected(remaining.length > 0 ? remaining[0].id : null)
      closeModal()
    }
  }

  const handleRenameFolder = async (id: number, name: string) => {
    if (!name.trim()) return
    const updated = await updateFolder(id, name.trim())
    setFolders(folders.map(f => f.id === id ? updated : f))
  }

  const handleAddTodo = async () => {
    if (!newTitle.trim() || typeof selected !== "number") return
    const todo = await createTodo(newTitle.trim(), selected, newDeadline || null)
    setTodos([...todos, todo])
    setNewTitle("")
    setNewDeadline("")
    setIsAdding(false)
  }

  const toggleCompleted = async (todo: Todo) => {
    const updated = await updateTodo(todo.id, { completed: !todo.completed })
    setTodos(todos.map(t => t.id === todo.id ? updated : t))
    if (activeTodo?.id === todo.id) setActiveTodo(updated)
  }

  const toggleImportant = async (todo: Todo) => {
    const updated = await updateTodo(todo.id, { important: !todo.important })
    setTodos(todos.map(t => t.id === todo.id ? updated : t))
    if (activeTodo?.id === todo.id) setActiveTodo(updated)
  }

  const updateDeadline = async (todo: Todo, deadline: string | null) => {
    const updated = await updateTodo(todo.id, { deadline })
    setTodos(todos.map(t => t.id === todo.id ? updated : t))
    if (activeTodo?.id === todo.id) setActiveTodo(updated)
  }

  const renameTodo = async (todo: Todo, title: string) => {
    if (!title.trim() || title === todo.title) return
    const updated = await updateTodo(todo.id, { title: title.trim() })
    setTodos(todos.map(t => t.id === todo.id ? updated : t))
    if (activeTodo?.id === todo.id) setActiveTodo(updated)
  }

  const handleDelete = async (id: number) => {
    await deleteTodo(id)
    setTodos(todos.filter(t => t.id !== id))
    closeModal()
  }

  const handleTodoClick = (todo: Todo) => {
    setActiveTodo(todo)
    openModal()
  }

  const getFolderName = () => {
    if (selected === "important") return "Важно"
    if (selected === "planned") return "Запланировано"
    return folders.find(f => f.id === selected)?.name ?? ""
  }

  const activeTodos = todos.filter(t => !t.completed)
  const doneTodos = todos.filter(t => t.completed)

  return (
    <div className="container">
      <div className="sidebar">
        <div className={`folder-row ${selected === "important" ? "active" : ""}`} onClick={() => selectFolder("important")}>
          <img className="folder-icon" src={folderStarIcon} alt="" /><span>Важно</span>
        </div>
        <div className={`folder-row ${selected === "planned" ? "active" : ""}`} onClick={() => selectFolder("planned")}>
          <img className="folder-icon" src={calendarIcon} alt="" /><span>Запланировано</span>
        </div>
        <div className="folders">
          {folders.map(f => (
            <FolderItem key={f.id} folder={f} active={selected === f.id} onClick={() => selectFolder(f.id)} />
          ))}
        </div>
        <div className="create-list-btn" onClick={handleAddFolder}>+ Создать список</div>
      </div>

      <div className="main">
        {typeof selected === "number" ? (
          <>
            <div
              className="list-title"
              contentEditable
              suppressContentEditableWarning
              onBlur={e => handleRenameFolder(selected, e.currentTarget.textContent ?? "")}
              onKeyDown={e => {
                if (e.key === "Enter") e.currentTarget.blur()
              }}
            >
              {getFolderName()}
            </div>
            <img title="Удалить список" className="delete-folder-btn" src={binIcon} alt="" onClick={() => handleDeleteFolder(selected)} />
          </>
        ) : (
          <div className="list-title">{getFolderName()}</div>
        )}

        <div className="todos-list">
          {activeTodos.map(todo => <TodoRow key={todo.id} todo={todo} onCheck={toggleCompleted} onClick={handleTodoClick} onStar={toggleImportant} />)}
          {doneTodos.length > 0 && (
            <>
              <div className="done-label">Завершено · {doneTodos.length}</div>
              {doneTodos.map(todo => <TodoRow key={todo.id} todo={todo} onCheck={toggleCompleted} onClick={handleTodoClick} onStar={toggleImportant} />)}
            </>
          )}
        </div>

        {typeof selected === "number" && (
          <div className="add-area">
            {isAdding ? (
              <div className="add-row">
                <span className="add-circle">○</span>
                <input autoFocus className="add-input" placeholder="Добавить задачу"
                  value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleAddTodo()
                    if (e.key === "Escape") { setIsAdding(false); setNewTitle(""); setNewDeadline("") }
                  }} />
                <input type="date" className="add-date" value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)} />
              </div>
            ) : (
              <button className="add-btn" onClick={() => setIsAdding(true)}>+ Добавить задачу</button>
            )}
          </div>
        )}
      </div>

      <Modal
        key={activeTodo?.id}
        display={display}
        onCloseButtonClick={closeModal}
        todo={activeTodo}
        onToggleImportant={toggleImportant}
        onUpdateDeadline={updateDeadline}
        onRename={renameTodo}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default App