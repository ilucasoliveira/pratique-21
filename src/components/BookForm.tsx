import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Book, BookFormState } from '../types/book'
import { createBook, errorMessage } from '../services/books'

interface BookFormProps {
  onBookAdded: (book: Book) => void
  disabled?: boolean
}

const initialState: BookFormState = { title: '', author: '', status: 'Não lido' }

export function BookForm({ onBookAdded, disabled = false }: BookFormProps) {
  const [form, setForm] = useState<BookFormState>(initialState)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    const { name, value } = event.currentTarget
    if (name === 'title' || name === 'author') setForm(previous => ({ ...previous, [name]: value }))
    if (name === 'status' && (value === 'Lido' || value === 'Não lido')) {
      setForm(previous => ({ ...previous, status: value }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (saving || disabled) return
    const input: BookFormState = { ...form, title: form.title.trim(), author: form.author.trim() }
    if (!input.title || !input.author) { setError('Preencha o título e o autor.'); return }
    setSaving(true)
    setError(null)
    try {
      const book = await createBook(input)
      onBookAdded(book)
      setForm(initialState)
    } catch (error: unknown) { setError(errorMessage(error)) }
    finally { setSaving(false) }
  }

  return <section className="panel form-panel" aria-labelledby="form-title">
    <span className="eyebrow">UM NOVO CAPÍTULO</span>
    <h2 id="form-title">Adicionar livro</h2>
    <p>Guarde sua próxima leitura aqui.</p>
    <form onSubmit={handleSubmit}>
      <fieldset disabled={disabled || saving}>
        <label htmlFor="title">Título</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required maxLength={180} placeholder="Ex.: O Hobbit" />
        <label htmlFor="author">Autor</label>
        <input id="author" name="author" value={form.author} onChange={handleChange} required maxLength={120} placeholder="Ex.: J. R. R. Tolkien" />
        <label htmlFor="status">Status da leitura</label>
        <select id="status" name="status" value={form.status} onChange={handleChange}>
          <option value="Não lido">Não lido</option><option value="Lido">Lido</option>
        </select>
        <button className="primary" type="submit">{saving ? 'Salvando…' : '+ Adicionar livro'}</button>
      </fieldset>
      {error && <p role="alert" className="error">{error}</p>}
    </form>
  </section>
}
