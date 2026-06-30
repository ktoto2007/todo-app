import { useState } from "react"

type Todo = {
  id: number
  title: string
  completed: boolean
  important: boolean
  deadline: string | null
  folder_id: number
  created_at: string
}

type ModalProps = {
  display: string
  onCloseButtonClick: () => void
  todo: Todo | null
  onToggleImportant: (todo: Todo) => void
  onUpdateDeadline: (todo: Todo, deadline: string | null) => void
  onRename: (todo: Todo, title: string) => void
  onDelete: (id: number) => void
}

function Modal(props: ModalProps) {
  const [note, setNote] = useState("")

  if (!props.todo) return null
  const todo = props.todo

  return (
    <div className="modal-container" style={{ display: props.display }}>
      <div className="modal-close" onClick={props.onCloseButtonClick}>✕</div>

      <div className="modal-header">
        <input
          key={todo.id}
          className="modal-title"
          defaultValue={todo.title}
          onBlur={e => props.onRename(todo, e.target.value)}
          onKeyDown={e => e.key === "Enter" && props.onRename(todo, e.currentTarget.value)}
        />
        <button className={`star-btn ${todo.important ? "starred" : ""}`}
          onClick={() => props.onToggleImportant(todo)}>
          {todo.important ? "★" : "☆"}
        </button>
      </div>

      <div className="modal-row">
        <span>📅</span>
        <span style={{ flex: 1 }}>Срок выполнения</span>
        <input key={todo.id} type="date" className="panel-date" value={todo.deadline ? todo.deadline.slice(0, 10) : ""}
          onChange={e => props.onUpdateDeadline(todo, e.target.value || null)} />
        {todo.deadline && (
          <button className="clear-btn" onClick={() => props.onUpdateDeadline(todo, null)}>✕</button>
        )}
      </div>

      <div className="modal-row">
        <span>📎</span>
        <span style={{ flex: 1 }}>Добавить файл</span>
        <input type="file" id="file-input" style={{ display: "none" }} />
        <label htmlFor="file-input" className="file-label">Выбрать</label>
      </div>

      <textarea
        className="modal-note"
        placeholder="Добавить заметку"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <div className="modal-footer">
        <span className="created-at">Создано {new Date(todo.created_at).toLocaleDateString()}</span>
        <div className="delete-btn" onClick={() => props.onDelete(todo.id)}>🗑 Удалить</div>
      </div>
    </div>
  )
}

export default Modal