import React from "react";
import './MeetOurResults.css';
import meetresultimage1 from '../../../../assets/images/meetresultsImage1.png';
import meetresultsimage2 from '../../../../assets/images/meetresultsImage2.png';
import meetresultsimage3 from '../../../../assets/images/meetresultsImage3.png';

const resultsData = [
    {
        id: 1,
        img: meetresultimage1,
        title: "Optimizing Feature Store and ",
        description:
            "time from four hours to ten minutes whileDS Stream helped Kpler cut data processing time from four hours to ten minutes while improving system stability and scalability.",
        company: "Kpler",
    },
    {
        id: 2,
        img: meetresultsimage2,
        title: "Transforming ML Workflow ThroughStandardization and Automation",
        description:
            "DS Stream helped Kpler cut data processing time from four hours to ten minutes while improving system stability and scalability.",
        company: "Global FMCG / CPG Company",
    },
    {
        id: 3,
        img: meetresultsimage3,
        title: "Standardizing FMCG Operations with the MLOps best practices Across Multiple Cloud Platforms",
        description:
            "DS Stream helped Kpler cut data processing time from four hours to ten minutes while improving system stability and scalability.",
        company: "Global FMCG / CPG Company",
    },
];

const MeetOurResults = () => {
    return (
        <section className="meet-our-results-section">
            <div className="results-header">
                <h2>Meet Our Results</h2>
                <button className="discover-btn">Discover More</button>
            </div>

            <div className="results-grid">
                {resultsData.map((item) => (
                    <div key={item.id} className="result-card">
                        <img src={item.img} alt={item.title} />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <div className="company" style={{width:'fit-content'}}>{item.company}</div>
                        <button className="project-btn">VIEW PROJECT →</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MeetOurResults;
