import { useEffect, useState } from "react"
import { getFolders, createFolder, deleteFolder, updateFolder } from "../api/folders"

type Folder = { id: number; name: string }
type Selected = number | "important" | "planned"

export function useFolders(closeModal: () => void) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [selected, setSelected] = useState<Selected | null>(null)

  useEffect(() => {
    getFolders().then(data => {
      setFolders(data)
      if (data.length > 0) setSelected(data[0].id)
    })
  }, [])

  const addFolder = async () => {
    const name = folders.length === 0 ? "Список без названия" : `Список без названия (${folders.length})`
    const folder = await createFolder(name)
    setFolders([...folders, folder])
    setSelected(folder.id)
  }

  const deleteSelectedFolder = async (id: number) => {
    await deleteFolder(id)
    const remaining = folders.filter(f => f.id !== id)
    setFolders(remaining)
    if (selected === id) {
      setSelected(remaining.length > 0 ? remaining[0].id : null)
      closeModal()
    }
  }

  const renameFolder = async (id: number, name: string) => {
    if (!name.trim()) return
    const updated = await updateFolder(id, name.trim())
    setFolders(folders.map(f => f.id === id ? updated : f))
  }

  const getFolderName = () => {
    if (selected === "important") return "Важно"
    if (selected === "planned") return "Запланировано"
    return folders.find(f => f.id === selected)?.name ?? ""
  }

  return { folders, selected, setSelected, addFolder, deleteSelectedFolder, renameFolder, getFolderName }
}