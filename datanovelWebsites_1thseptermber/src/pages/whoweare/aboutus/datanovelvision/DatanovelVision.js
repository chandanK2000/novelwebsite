import React from 'react'
import './DatanovelVision.css'
import novelvisionImage from '../../../../assets/images/novelvisionImage.png'
import novelvisionBackgroundImage from '../../../../assets/images/novelvisionBackgroundImage.jpg'

const DatanovelVision = () => {
    return (
        <section
            className='datanovel-vision-section'
            style={{ backgroundImage: `url(${novelvisionBackgroundImage})` }}
        >
            <div className='datanovel-vision-content d-flex'>
                <div className='datanovel-vision-text'>
                    <h2>The DataNovel vision</h2>
                    <p>DataNovel has redefined conventional computer vision with </p>
                    <p>
                         DataNovel Vision AI uniquely detects, processes, and instantly analyzes visual elements in video streams but does so in nanoseconds, versus the time it takes a human being.
                    </p>
                    <p>
                        We have built the world’s best Vision AI platform engineered with the finest human qualities capable of deep understanding and the ability to make decisions. The result is a computer vision AI platform that sees, comprehends, and acts like a human, but without error, fatigue, or distraction. We envision a world where humans are free to do the things they do best, and where technology does the things better left to technology.
                    </p>
                </div>
                <div className='datanovel-vision-image'>
                    <img src={novelvisionImage} alt='DataNovel Vision' />
                </div>
            </div>
        </section>
    )
}

export default DatanovelVision
