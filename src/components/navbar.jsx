import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-blue-600 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-xl font-bold">Utility Hub</h1>

        <div className="flex gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/translator">Translator</NavLink>
          <NavLink to="/random-generator">Random Generator</NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar