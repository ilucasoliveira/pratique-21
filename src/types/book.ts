export type BookStatus = 'Lido' | 'Não lido'

export interface Book {
  _id: string
  title: string
  author: string
  status: BookStatus
}

// O identificador é gerado pelo servidor, nunca pelo formulário.
export type BookFormState = Omit<Book, '_id'>
export type CreateBookInput = BookFormState
