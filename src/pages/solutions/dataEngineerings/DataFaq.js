import React from 'react';
import './DataFaq.css';

const faqs = [
  {
    question: "How long until we deliver your first blog post?",
    answer: "Really boy law county she unable her sister. Feet you off its like like six..."
  },
  {
    question: "What is data engineering and why is it important?",
    answer: "Data engineering involves building pipelines and systems to collect, process, and store data efficiently."
  },
  {
    question: "How do you handle large datasets?",
    answer: "We use distributed systems and optimized storage solutions to manage large datasets."
  },
  {
    question: "Can you integrate data from multiple sources?",
    answer: "Yes, we can combine data from various sources and create a unified view for analysis."
  }
];

const DataFaq = () => {
  return (
    <section className='data-faq-section container py-5'>
      <h2 className='data-faq-heading mb-4 text-center'>Data Engineering FAQ</h2>

      <div className="accordion" id="faqAccordion">
        {faqs.map((faq, index) => (
          <div className="accordion-item faq-accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button 
                className="accordion-button collapsed faq-accordion-button" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#collapse${index}`} 
                aria-expanded="false" 
                aria-controls={`collapse${index}`}
              >
                {faq.question}
              </button>
            </h2>
            <div 
              id={`collapse${index}`} 
              className="accordion-collapse collapse" 
              aria-labelledby={`heading${index}`} 
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DataFaq;
