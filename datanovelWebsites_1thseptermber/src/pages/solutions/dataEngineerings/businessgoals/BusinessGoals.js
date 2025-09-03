import React from 'react'
import './BusinessGaols.css'
import businessgoals from '../../../../assets/images/businessgoals.png';
const BusinessGoals = () => {
    return (
        <section className="business_goals_section">
            <div className="extra-box top-right"></div>  {/* New box */}


            <div className='business-goals-content'>
                <div className='business-left-section'>
                    <h2>Achieve business goals with data masters</h2>
                    <p>
                        Today’s organizations generate a huge amount of data that needs to be optimized and transformed into useful business knowledge. Our team of qualified and experienced Data Engineers and Consultants will create high-performance infrastructure and optimize your data to help you make better decisions and achieve your business goals.
                    </p>
                </div>
                <div className='business-right-section'>
                    <img src={businessgoals} alt='Business Goals' />
                    <div className="cut-piece-below"></div>

                </div>
            </div>

        </section>
    )
}

export default BusinessGoals;
