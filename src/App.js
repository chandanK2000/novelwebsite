import React from "react";
import { HashRouter, Routes, Route } from 'react-router-dom'
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Footer from "./components/footer/Footer";
import ScrollToTopButton from "./pages/scrollTotop/ScrollToTopButton";
import DataQuality from "./pages/solutions/dataquality/DataQuality";
import CaseStudies from "./pages/whoweare/casestudies/CaseStudies";
import AwardsAndEvents from "./pages/whoweare/awardsAndevents/AwardsAndEvents";
import Products from "./pages/products/Products";
import ContactUs from "./pages/contactus/ContactUs";
import ScrollTotopcomponents from "./components/ScrollTotopcomponents";
// import TopScrollIndicator from "./pages/topscrollindicator/TopScrollIndicator";
function App() {
  return (
    <HashRouter>
      <ScrollTotopcomponents/>
      <Header/>
            {/* <TopScrollIndicator/> */}

      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/dataQuality" element={<DataQuality/>}/>
        <Route exact path="/casestudies" element={<CaseStudies/>}/>
        <Route exact path="/awardsandevents" element={<AwardsAndEvents/>}/>
        <Route exact path="/products" element={<Products/>}/>
        <Route exact path="/contactus" element={<ContactUs/>}/>

        
      </Routes>
      <Footer/>
      <ScrollToTopButton/>
    </HashRouter>
  );
}

export default App;
