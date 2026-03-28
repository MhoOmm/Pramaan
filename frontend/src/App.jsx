import React from 'react';
import Home from './pages/Home';
import './App.css';
import AiTextDetectionPage from './pages/AiTextDetectionPage';

import SMSClassifierPage from './pages/SmsClassifierPage';
import DetectFakeImage from "./pages/FakeImage/detectFakeImage"
import DetectFakeNews from "./pages/FakeNews/fakeNews"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/authpage/Auth"
import LinkClassifierPage from './pages/LinkClassifier/LinkClassifierPage';
import EmailClassifierPage from './pages/EmailClassifier/EmailClassifierPage';

import CommunityFeed from './pages/community/CommunityFeed';
import PrivateRoute from './components/community/PrivateRoute';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  // App.jsx is now clean and acts as the root component loader
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/detect/sms" element={<SMSClassifierPage/>} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/login" element={<Auth initialView="login" />} />
        <Route path="/detect/fakelinks" element={<LinkClassifierPage/>} />
        <Route path="/detect/AItext" element={<AiTextDetectionPage />} />
        <Route path='/detect/deepfake' element={<DetectFakeImage/>}/>
        <Route path='/community' element={<PrivateRoute><CommunityFeed /></PrivateRoute>} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/detect/fakenews' element={<DetectFakeNews/>}/>
        <Route path='/detect/phishing' element={<EmailClassifierPage />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
