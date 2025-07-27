import { Routes, Route } from "react-router-dom";
import Login from "./views/login/Login.jsx";
import Signin from "./views/sign-in/Signin.jsx";
import Landing from "./views/landing/Landing.jsx";
import Nav from "./views/nav/Nav.jsx";
import Profile from "./views/profile/Profile.jsx";
import UserProfile from "./views/userProfile/UserProfile.jsx";
import UsersList from "./views/usersList/UsersList.jsx";
import CreatePost from "./views/createPost/CreatePost.jsx";
import Post from "./views/post/Post.jsx";
import EditProfile from "./views/editProfile/EditProfile.jsx";
import isLoggedIn from "./utils/isLoggedIn";
import "./App.css";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black px-8 py-10">
      {isLoggedIn() ? <Nav /> : null}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/me" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/followers/:id" element={<UsersList />} />
        <Route path="/following/:id" element={<UsersList />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
    </div>
  );
}

export default App;
