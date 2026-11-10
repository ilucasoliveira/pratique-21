import { BookList } from './components/BookList'

export default function App() {
  return <div className="app">
    <header><a className="brand" href="./"><span aria-hidden="true">▥</span> Entre páginas</a><span className="header-note">SEU CATÁLOGO PESSOAL</span></header>
    <main><div className="intro"><span className="eyebrow">HISTÓRIAS QUE FICAM</span><h1>Uma estante.<br /><em>Muitas possibilidades.</em></h1><p>Organize seus livros e acompanhe cada nova leitura.</p></div><BookList /></main>
    <footer>Entre páginas · Catálogo de livros em React + TypeScript</footer>
  </div>
}
