import { useState } from "react"
import { useFolders } from "./hooks/useFolders"
import { useTodos } from "./hooks/useTodos"
import Modal from "./Modal.tsx"
import "./App.css"

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
      <img className="folder-icon" src="/icons/user-folder-icon.png" alt="" />
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
      <button title={!todo.important ? "Пометить как важную" : "Убрать пометку о важности"}
        className={`star-btn ${todo.important ? "starred" : ""}`}
        onClick={e => { e.stopPropagation(); props.onStar(todo) }}>
        {todo.important ? "★" : "☆"}
      </button>
    </div>
  )
}

function App() {
  const [display, setDisplay] = useState("none")
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDeadline, setNewDeadline] = useState("")

  const openModal = () => setDisplay("flex")
  const closeModal = () => setDisplay("none")

  const { folders, selected, setSelected, addFolder, deleteSelectedFolder, renameFolder, getFolderName } = useFolders(closeModal)
  const { todos, activeTodo, toggleCompleted, toggleImportant, updateDeadline, renameTodo, removeTodo, addTodo, handleTodoClick } = useTodos(selected, closeModal)

  const selectFolder = (id: Selected) => {
    setSelected(id)
    setIsAdding(false)
    closeModal()
  }

  const handleAddTodo = async () => {
    if (!newTitle.trim() || typeof selected !== "number") return
    await addTodo(newTitle.trim(), selected, newDeadline || null)
    setNewTitle("")
    setNewDeadline("")
    setIsAdding(false)
  }

  const activeTodos = todos.filter(t => !t.completed)
  const doneTodos = todos.filter(t => t.completed)

  return (
    <div className="container">
      <div className="sidebar">
        <div className={`folder-row ${selected === "important" ? "active" : ""}`} onClick={() => selectFolder("important")}>
          <img className="folder-icon" src="/icons/folder-star.png" alt="" /><span>Важно</span>
        </div>
        <div className={`folder-row ${selected === "planned" ? "active" : ""}`} onClick={() => selectFolder("planned")}>
          <img className="folder-icon" src="/icons/calendar.png" alt="" /><span>Запланировано</span>
        </div>
        <div className="folders">
          {folders.map(f => (
            <FolderItem key={f.id} folder={f} active={selected === f.id} onClick={() => selectFolder(f.id)} />
          ))}
        </div>
        <div className="create-list-btn" onClick={addFolder}>+ Создать список</div>
      </div>

      <div className="main">
        {typeof selected === "number" ? (
          <>
            <div
              className="list-title"
              contentEditable
              suppressContentEditableWarning
              onBlur={e => renameFolder(selected, e.currentTarget.textContent ?? "")}
              onKeyDown={e => {
                if (e.key === "Enter") e.currentTarget.blur()
              }}
            >
              {getFolderName()}
            </div>
            <img title="Удалить список" className="delete-folder-btn" src="/icons/bin.png" alt=""
              onClick={() => deleteSelectedFolder(selected)} />
          </>
        ) : (
          <div className="list-title">{getFolderName()}</div>
        )}

        <div className="todos-list">
          {activeTodos.map(todo => (
            <TodoRow key={todo.id} todo={todo} onCheck={toggleCompleted}
              onClick={t => handleTodoClick(t, openModal)} onStar={toggleImportant} />
          ))}
          {doneTodos.length > 0 && (
            <>
              <div className="done-label">Завершено · {doneTodos.length}</div>
              {doneTodos.map(todo => (
                <TodoRow key={todo.id} todo={todo} onCheck={toggleCompleted}
                  onClick={t => handleTodoClick(t, openModal)} onStar={toggleImportant} />
              ))}
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
        onDelete={removeTodo}
      />
    </div>
  )
}

export default App