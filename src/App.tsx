import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import SignUp from './signup/Register';
import Main from "./main/Main"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<Main />} />
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<SignUp />} />
  
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;