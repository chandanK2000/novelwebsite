import React from 'react'
import './DataEngineerings.css'
import DataEngineeringBanners from './dataengineeringBanners/DataEngineeringBanners';
import BusinessGoals from './businessgoals/BusinessGoals';
import OurCoreOfferings from './ourcoreoffirings/OurCoreOfferings';
import MeetOurResults from './meetourResults/MeetOurResults';
import WhatOurClientsSays from './whatourClientSays/WhatOurClientsSays';
import SelectedClients from './selectedClients/SelectedClients';
import BusinessSupport from './businessSupport/BusinessSupport';
import DigitalTransformation from './digitalTransformation/DigitalTransformation';
import TalToExperts from './talkToExpert/TalToExperts';
const DataEngineerings = () => {
  return (
    <div>
      <DataEngineeringBanners/>
      <BusinessGoals/>
      <OurCoreOfferings/>
      <MeetOurResults/>
      <WhatOurClientsSays/>
      <SelectedClients/>
      <BusinessSupport/>
      <DigitalTransformation/>
      <TalToExperts/>
    </div>
  )
}

export default DataEngineerings;
