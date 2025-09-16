import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/SignUp" element ={<SignUp/>}/>
            <Route path="/LogIn" element ={<LogIn/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
