import type { Book, CreateBookInput } from '../types/book'

const baseUrl = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '')
export const isApiConfigured = /^https:\/\/(www\.)?crudcrud\.com\/api\/[a-f0-9]{32}$/i.test(baseUrl)

function endpoint(id?: string): string {
  if (!isApiConfigured) throw new Error('Configure VITE_API_URL no arquivo .env e reinicie o servidor.')
  return `${baseUrl}/books${id ? `/${encodeURIComponent(id)}` : ''}`
}

async function request(id: string | undefined, options: RequestInit): Promise<Response> {
  const response = await fetch(endpoint(id), options)
  if (!response.ok) {
    throw new Error(`Falha na API (HTTP ${response.status}). Verifique a URL, a validade e o limite de requisições no CrudCrud.`)
  }
  return response
}

function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) return false
  const b = value as Record<string, unknown>
  return typeof b._id === 'string' && typeof b.title === 'string' &&
    typeof b.author === 'string' && (b.status === 'Lido' || b.status === 'Não lido')
}

export async function getBooks(signal?: AbortSignal): Promise<Book[]> {
  const response = await request(undefined, { method: 'GET', signal })
  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isBook)) throw new Error('A API retornou livros em um formato inválido.')
  return data
}

export async function createBook(book: CreateBookInput): Promise<Book> {
  const response = await request(undefined, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(book),
  })
  const data: unknown = await response.json()
  if (!isBook(data)) throw new Error('Resposta inesperada após cadastro. Recarregue a lista antes de tentar novamente.')
  return data
}

export async function deleteBook(id: string): Promise<void> {
  await request(id, { method: 'DELETE' })
}

export async function updateBook(id: string, book: CreateBookInput): Promise<void> {
  // O CrudCrud não aceita _id no corpo do PUT.
  await request(id, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(book),
  })
}

export function errorMessage(error: unknown): string {
  if (error instanceof TypeError) return 'Não foi possível acessar a API. Verifique sua conexão e a URL configurada.'
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado. Tente novamente.'
}
