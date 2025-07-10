import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/signup.tsx';
import Login from './pages/login.tsx';
import HomePage from './pages/HomePage';
const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
