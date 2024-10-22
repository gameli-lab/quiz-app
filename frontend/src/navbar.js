// import { NavLink } from "react-router-dom";
// import logo from "./logo.jpg";
// import { Link } from "react-router-dom";
// // import "./homepage.css";

// const Navbar = () => {
//   return (
//     // <>
//     //   <div className="branding">
//     //     <Link to="/">
//     //       <img src={logo} alt="Quiz App Logo" className="logo" />
//     //     </Link>
//     //     <h1>QuizMaster</h1>
//     //   </div>

//     <nav>
//       <ul>
//         <li>
//           <NavLink to="/">Home</NavLink>
//         </li>
//         <li>
//           <NavLink to="/signup">Signup</NavLink>
//         </li>
//         <li>
//           <NavLink to="/role">RoleSelection</NavLink>
//         </li>
//         <li>
//           <NavLink to="/login">Login</NavLink>
//         </li>
//         <li>
//           <Link to="#features">Features</Link>
//         </li>
//         <li>
//           <Link to="#testimonials">Testimonials</Link>
//         </li>
//         <li>
//           <NavLink to="/about">About</NavLink>
//         </li>
//         <li>
//           <NavLink to="/contact">Contact</NavLink>
//         </li>
//       </ul>
//     </nav>
//     // </>
//   );
// };

// export default Navbar;

import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "./logo.jpg";
import "./homepage.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="branding">
        <Link to="/">
          <img src={logo} alt="Quiz App Logo" className="logo" />
        </Link>
        <h1>QuizMaster</h1>
      </div>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "navlink-active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="#about"
          className={({ isActive }) => (isActive ? "navlink-active" : "")}
        >
          About
        </NavLink>
        <NavLink
          to="/role"
          className={({ isActive }) => (isActive ? "navlink-active" : "")}
        >
          Sign Up
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? "navlink-active" : "")}
        >
          Sign In
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
