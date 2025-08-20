import React from 'react'
import './DataEngineerings.css'
import DataEngineeringBanners from './dataengineeringBanners/DataEngineeringBanners';
import BusinessGoals from './businessgoals/BusinessGoals';
const DataEngineerings = () => {
  return (
    <div>
      <DataEngineeringBanners/>
      <BusinessGoals/>
    </div>
  )
}

export default DataEngineerings;
