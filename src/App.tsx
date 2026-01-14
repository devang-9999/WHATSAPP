import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import SignUp from './components/register/Register';
import Main from './pages/main/Main';
import ProtectedRoute from './components/routes/ProtectedRoute';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/dashboard' 
          element = { <ProtectedRoute>
            <Main/>
            </ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
