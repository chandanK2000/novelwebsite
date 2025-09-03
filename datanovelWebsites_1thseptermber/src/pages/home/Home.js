import React from 'react'
import './Home.css'
import HeroCarousel from  '../../pages/home/herosection/HeroCarousel';
import OurClients from  '../../pages/home/ourclients/OurClients';
import TechnologiesWork from  '../../pages/home/technologies/TechnologiesWork';
import Industries from '../../pages/home/industries/Industries';
import RecentProjects from '../../pages/home/recentprojects/RecentProjects';
import ClientTestonomial from '../../pages/home/clientTestonomial/ClientTestonomial';
import OurProcess from '../../pages/home/ourprocess/OurProcess';
import LatestBlogs from '../../pages/home/latestBlogs/LatestBlogs';

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
