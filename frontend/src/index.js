import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './landing-page/home/HomePage';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import AboutPage from './landing-page/about/AboutPage';
import PricingPage from './landing-page/pricing/PricingPage';
import Heros from './landing-page/support/Heros';
import Navbar from "./landing-page/Navbar";
import Footer from "./landing-page/Footer";
import NotFound from './NotFound';
import Hero from './landing-page/product/Hero'
import Dashboard from './landing-page/dashboard/Dashboard';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.Fragment>
  <BrowserRouter>
  <Navbar/>
  <Routes>
    <Route path="/" element={<HomePage />} />
     <Route path="/about" element={<AboutPage />} />
    <Route path="/pricing" element={<PricingPage />} />
    <Route path="/support" element={<Heros />} />
     <Route path="/product" element={<Hero />} />
      
     <Route path="/dashboard" element={<Dashboard />} />
    <Route path="*" element={<NotFound />} />   
  </Routes>
  <Footer/>
  </BrowserRouter>
  
</React.Fragment>
);
export default HomePage;
