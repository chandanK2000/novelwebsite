import React from 'react';
import './VoiceRecognition.css';
import awardsandevents from '../../../assets/images/awardsandEvents2.png';
import voicerecognitionImage from '../../../assets/images/voicerecognitionImage.png';

const VoiceRecognition = () => {
  return (
    <section className="voice-recognition-section">
      <div className="voice-recognition-header">
        <h2>Voices of Recognition</h2>
        <p>
          Hear from the esteemed individuals and organizations who’ve honored our work.
          Their words inspire us to keep pushing the boundaries of data engineering and innovation.
        </p>
        {/* <hr style={{ border: '1px solid rgba(241, 27, 27, 1)', margin: '20px 0' }} /> */}

      </div>

      <div className="voice-recognition-contents">
        {/* Left Block */}
        <div className="left-block">
          <div className="voice-image">
            <img src={voicerecognitionImage} alt="Voice Recognition 1" />
          </div>
          <div className="voice-details">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised
            </p>
            <div className="voice-meta">
              <p className="voice-name"><strong>Name:</strong> Chanan Kumar</p>
              <p className="voice-designation"><strong></strong> Data Engineer</p>
            </div>
          </div>
        </div>

        {/* Right Block */}
        <div className="right-block">
          <div className="voice-image awards">
            <img src={awardsandevents} alt="Voice Recognition 2" />
          </div>
          <div className="award-details">
            <p className="award-title">Award Name</p>
            <button className="view-btn">View More</button>
            <p className="award-year">Winning Year</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceRecognition;
