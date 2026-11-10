import { useEffect, useState } from 'react'
import type { Book } from '../types/book'
import { getBooks, errorMessage, isApiConfigured } from '../services/books'
import { BookForm } from './BookForm'
import { BookItem } from './BookItem'

export function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState<number>(0)

  useEffect(() => {
    const controller = new AbortController()
    async function loadBooks(): Promise<void> {
      setLoading(true); setError(null)
      try {
        const data = await getBooks(controller.signal)
        if (!controller.signal.aborted) setBooks(data)
      } catch (error: unknown) {
        if (!controller.signal.aborted) setError(errorMessage(error))
      } finally { if (!controller.signal.aborted) setLoading(false) }
    }
    void loadBooks()
    return () => controller.abort()
  }, [attempt])

  function handleAdded(book: Book): void { setBooks(current => [...current, book]) }
  function handleDeleted(id: string): void { setBooks(current => current.filter(book => book._id !== id)) }
  function handleUpdated(updated: Book): void {
    setBooks(current => current.map(book => book._id === updated._id ? updated : book))
  }

  return <>
    <div className="stats" aria-label="Resumo do catálogo">
      <div><strong>{books.length}</strong><span>livros na estante</span></div>
      <div><strong>{books.filter(book => book.status === 'Lido').length}</strong><span>leituras concluídas</span></div>
      <div><strong>{books.filter(book => book.status === 'Não lido').length}</strong><span>novas histórias</span></div>
    </div>
    <div className="layout">
      <BookForm onBookAdded={handleAdded} disabled={!isApiConfigured || loading || error !== null} />
      <section className="collection" aria-labelledby="list-title" aria-busy={loading}>
        <div className="section-heading"><h2 id="list-title">Minha coleção</h2><span>{books.length} livros</span></div>
        {loading ? <p role="status" className="empty">Carregando sua estante…</p> : error ?
          <div className="empty"><p role="alert" className="error">{error}</p>
            {isApiConfigured && <button onClick={() => setAttempt(value => value + 1)}>Tentar novamente</button>}
          </div> : books.length === 0 ?
          <div className="empty"><h3>Sua próxima história começa aqui.</h3><p>Cadastre seu primeiro livro pelo formulário.</p></div> :
          <ul className="book-list">{books.map(book => <BookItem key={book._id} book={book} onDeleted={handleDeleted} onUpdated={handleUpdated} />)}</ul>}
      </section>
    </div>
  </>
}
