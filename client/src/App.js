import Home from "./pages/Home";
import Article from "./pages/Article";
import Login from "./pages/Login"
import Register from "./pages/Register"
import User from "./pages/User"
import "./app.scss";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import CategoryArticle from "./pages/CategoryArticle";

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter> */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/article/:id" element={<Article/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/user/:id" element={<User/>}></Route>
          <Route path="/findArticle/category" element={<CategoryArticle/>}></Route>
        </Routes>
      </HashRouter>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
