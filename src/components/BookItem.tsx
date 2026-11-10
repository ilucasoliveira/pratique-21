import { useState } from 'react'
import type { Book } from '../types/book'
import { deleteBook, updateBook, errorMessage } from '../services/books'

interface BookItemProps {
  book: Book
  onDeleted: (id: string) => void
  onUpdated: (book: Book) => void
}

export function BookItem({ book, onDeleted, onUpdated }: BookItemProps) {
  const [busy, setBusy] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(): Promise<void> {
    if (busy || !window.confirm(`Remover “${book.title}” do catálogo?`)) return
    setBusy(true); setError(null)
    try { await deleteBook(book._id); onDeleted(book._id) }
    catch (error: unknown) { setError(errorMessage(error)) }
    finally { setBusy(false) }
  }

  async function handleToggle(): Promise<void> {
    if (busy) return
    setBusy(true); setError(null)
    const updated: Book = { ...book, status: book.status === 'Lido' ? 'Não lido' : 'Lido' }
    try {
      await updateBook(book._id, { title: updated.title, author: updated.author, status: updated.status })
      onUpdated(updated)
    } catch (error: unknown) { setError(errorMessage(error)) }
    finally { setBusy(false) }
  }

  return <li className="book-card" aria-busy={busy}>
    <div className="book-icon" aria-hidden="true">{book.title.slice(0, 1).toLocaleUpperCase()}</div>
    <div className="book-info"><span className={`badge ${book.status === 'Lido' ? 'read' : ''}`}>{book.status}</span>
      <h3>{book.title}</h3><p>{book.author}</p>
      <div className="actions">
        <button disabled={busy} onClick={handleToggle}>{book.status === 'Lido' ? 'Marcar como não lido' : 'Marcar como lido'}</button>
        <button className="danger" disabled={busy} onClick={handleDelete} aria-label={`Remover ${book.title}`}>Remover</button>
      </div>
      {busy && <small role="status">Salvando alteração…</small>}
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  </li>
}
