import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Auth from './pages/Auth'
import Home from './pages/Home'
import NotFound from "./layout/NotFound";

const App=() =>{

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
