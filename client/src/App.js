import Home from "./pages/Home";
import Article from "./pages/Article";
import Login from "./pages/Login"
import Register from "./pages/Register"
import User from "./pages/User"
import HomePage from "./pages/HomePage"
import News from "./pages/News";
import EditorConvertToHTMLForArticle from "./pages/EditArticle"
import EditorConvertToHTMLForNews from "./pages/EditNews"
import "./app.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoryArticle from "./pages/CategoryArticle";
import AddNewPost from "./pages/AddNewPost";
import AddNewNews from "./pages/AddNewNews";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/article/:id" element={<Article/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/user/:id" element={<User/>}></Route>
          <Route path="/user/:id/home" element={<HomePage/>}></Route>
          <Route path="/findArticle/category" element={<CategoryArticle/>}></Route>
          <Route path="/article/edit/:articleId" element={<EditorConvertToHTMLForArticle />}></Route>
          <Route path="/article/add" element={<AddNewPost />}></Route>
          <Route path="/news" element={<News />}></Route>
          <Route path="/news/edit/:articleId" element={<EditorConvertToHTMLForNews />}></Route>
          <Route path="/news/add" element={<AddNewNews />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
