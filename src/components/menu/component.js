import React from "react";
import { Link } from "react-router-dom";

class Menu extends React.Component {
  render(props) {
    return (
      <React.Fragment>
        <nav>
          <ul>
            <Link to="/" className="text-link">
              Home
            </Link>
            <Link to="/papi" className="text-link">
              Papier
            </Link>
            <Link to="/capi" className="text-link">
              Face à face
            </Link>
            <Link to="/cawi" className="text-link">
              Web (Stromae)
            </Link>
            <Link to="/cawiv2" className="text-link">
              Web (Stromae V2)
            </Link>
          </ul>
        </nav>
      </React.Fragment>
    );
  }
}

export default Menu;
