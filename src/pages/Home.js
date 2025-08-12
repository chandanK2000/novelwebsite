import React from 'react'
// import HeroSection from './herosection/HeroSection';
import OurClients from './ourclients/OurClients';
// import './Home.css'
import TechnologiesWork from './technologies/TechnologiesWork';
import Industries from './industries/Industries';
import RecentProjects from './recentprojects/RecentProjects';
import ClientTestonomial from './clientTestonomial/ClientTestonomial';
import OurProcess from './ourprocess/OurProcess';
import LatestBlogs from './latestBlogs/LatestBlogs';
import HeroCarousel from './herosection/HeroCarousel';
const Home = () => {
  return (
    <div className='home-container '>
      {/* <HeroSection /> */}
      <HeroCarousel/>
      <OurClients />
      <TechnologiesWork/>
      <Industries/>
      <RecentProjects/>
      <ClientTestonomial/>
      <OurProcess/>
      <LatestBlogs/>
    
    </div>
  )
}

export default Home;
