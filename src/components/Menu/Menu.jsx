import './Menu.css'
import { play } from '../Game/Game.jsx'

const Menu = {
  render() {
    return (
      <>
        <button className="play-btn" onClick={play}>
          play
        </button>
      </>
    )
  }
}

export default Menu
