import React from 'react'
import './OurPartners.css'
import logo1 from '../../../../assets/icons/Logo1.png'
import logo2 from '../../../../assets/icons/Logo2.png'
import logo3 from '../../../../assets/icons/Logo3.png'
import logo4 from '../../../../assets/icons/Logo4.png'
import logo5 from '../../../../assets/icons/Logo5.png'
import logo6 from '../../../../assets/icons/Logo6.png'

const OurPartners = ({headerContent}) => {
    return (
        <section className="partners-section">
            <div className="partners-container">

                <div className="partners-text">
                    {headerContent ? headerContent : <h3>DataNovel Visionary Partners</h3>}
                </div>

                <div className="partners-logos">
                    <img src={logo1} alt="Client 1" className="partner-logo" />
                    <img src={logo2} alt="Client 2" className="partner-logo" />
                    <img src={logo3} alt="Client 3" className="partner-logo" />
                    <img src={logo4} alt="Client 4" className="partner-logo" />
                    <img src={logo5} alt="Client 5" className="partner-logo" />
                    <img src={logo6} alt="Client 6" className="partner-logo" />
                </div>

            </div>
        </section>
    )
}

export default OurPartners
