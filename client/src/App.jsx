/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Editor from "./pages/WebSiteEditor";
import LiveSite from "./pages/LiveSite";
import Pricing from "./pages/Pricing";

const App = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-paper font-sans text-ink">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/site/:id" element={<LiveSite />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Dashboard />} />
                    <Route path="/generate" element={<Generate />} />
                    <Route path="/editor/:id" element={<Editor />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
