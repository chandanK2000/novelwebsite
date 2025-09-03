import React from 'react'
import './Products.css';
import ProductBanner from './productBanner/ProductBanner';
import DigitalExperience from './digitalexperience/DigitalExperience';
import Keycapabilities from './keycapabilities/Keycapabilities';
import DataNovelBenefits from './datanovelBenefits/DataNovelBenefits';
import Services from './services/Services';
import DynamicDashboard from './dynamicDashboard/DynamicDashboard';
import ChooseUs from './chooseUs/ChooseUs';
import SendMessage from './sendMessage/SendMessage';
const Products = () => {
  return (
    <div>
      <ProductBanner/>
      <DigitalExperience/>
      <Keycapabilities/>
      <DataNovelBenefits/>
      <Services/>
      <DynamicDashboard/>
      <ChooseUs/>
      <SendMessage/>
    </div>
  )
}

export default Products;
