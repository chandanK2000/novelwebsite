import React from 'react';
import './AwardsAndEvents.css';
import AwardsProcess from './AwardsProcess';
import AwardsBanner from './AwardsBanner';
import VoiceRecognition from './VoiceRecognition';
import OurPartners from '../aboutus/ourPartners/OurPartners';
import AwardsEvents from './AwardsEvents';
import FeatureEvents from './FeatureEvents';
import AwardsReviews from './AwardsReviews';
import DataNovelLeadership from '../aboutus/dataNovelLeadership/DataNovelLeadership';
import SendMessage from '../../products/sendMessage/SendMessage';

const AwardsAndEvents = () => {
  return (
    <>
      <AwardsBanner />
      <AwardsProcess />
      <VoiceRecognition />
      <OurPartners
        headerContent={
          <div className='text-center partners-header'>
            <h2 className='partners-title'>Our Clients</h2>
            <p className='partners-description'>We have been working with some Fortune 500+ clients</p>
          </div>

        }
      />
      <AwardsEvents/>
      <FeatureEvents/>
      <AwardsReviews/>
      <DataNovelLeadership 
        headerContent={
          <div className='text-center leadership-header'>
            <h2 className='leadership-title'>Upcoming Events</h2>
            <p className='leadership-description'>Join us at the next Event!</p>
          </div>
        }
      />
      <SendMessage/>

    </>
  );
};

export default AwardsAndEvents;
