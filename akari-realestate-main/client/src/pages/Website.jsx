import React from 'react'
import Companies from "../components/Companies/Companies";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
 
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Residencies from "../components/Residencies/Residencies";
 

const Website = () => {
  return (
    <div className="App">
    <div>
      <div className="white-gradient" />
      <Hero />
    </div>
     
    <Residencies/>
     
    <Contact/>
     
  </div>
  )
}

export default Website