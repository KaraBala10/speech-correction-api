// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/auth/login";
import Landing from "./components/landing";
import ChildPage from "./components/forChild/childPage";
import FiveLevelPage from "./components/forChild/fiveLevel";
import LevelPage from "./components/forChild/levelPage";
import LanguagePage from "./components/languagePage";
import AdultPage from "./components/forAdults/adultPage";
import GrammerPage from "./components/forAdults/grammer/lessonsPage";
import QuizPage from "./components/forAdults/grammer/quizPage";
import AdminPage from "./components/admin/adminPage";
import UserDetails from "./components/admin/userDetails";
import VerifyCode from "./components/auth/verify";
import Register from "./components/auth/register";
import About from "./components/about";
import MyProfile from "./components/myProfile";
import Contact from "./components/contact";
import Support from "./components/support";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/:token" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact/:token" element={<Contact />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/childPage/:lan" element={<ChildPage />} />
          <Route
            path="/FiveLevelPage/:lan/:letter"
            element={<FiveLevelPage />}
          />
          <Route
            path="/levelPage/:lan/:letter/:level"
            element={<LevelPage />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/VerifyCode" element={<VerifyCode />} />
          <Route path="/LanguagePage" element={<LanguagePage />} />
          <Route path="/AdultPage" element={<AdultPage />} />
          <Route path="/:skillName" element={<GrammerPage />} />
          <Route path="/:skillName/:lessonName" element={<QuizPage />} />
          <Route path="/MyProfile" element={<MyProfile />} />
          <Route path="/AdminPage" element={<AdminPage />} />
          <Route path="/UserDetails/:name" element={<UserDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
