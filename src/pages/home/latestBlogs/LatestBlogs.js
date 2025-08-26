import React from 'react';
import './LatestBlogs.css';
import { FaArrowRight } from 'react-icons/fa';

import blog1 from '../../../assets/images/blog1.png';
import blog2 from '../../../assets/images/blog2.png';
import blog3 from '../../../assets/images/blog3.png';
import blogs4 from '../../../assets/images/blogs4.png';

const blogData = {
  featured: {
    image: blog1,
    category: 'Featured Blogs',
    title: 'Generative AI for Facility Safety: Creating the Uncapturable',
    description:
      "When it comes to facility safety, the most dangerous incidents are often the hardest to capture—and the hardest ...",
    link: '#',
  },
  others: [
    {
      image: blog2,
      category: 'Blog',
      title: 'Generative AI for Facility Safety: Creating Uncapturable',
      description: 'When it comes to facility safety, the most dangerous incidents are',
      link: '#',
    },
    {
      image: blog3,
      category: 'Blog',
      title: 'How AI is Transforming Security Surveillance',
      description: 'AI-driven surveillance can anticipate threats before they happen',
      link: '#',
    },
    {
      image: blogs4,
      category: 'Blog',
      title: 'Workplace Safety with Machine Vision',
      description: 'Machine vision can identify hazardous patterns in real-time',
      link: '#',
    },
  ],
};

const LatestBlogs = ({heading}) => {
  return (
    <section className='latestblogs_section'>
      <h3 className='section-title'>{heading ? heading : 'Latest from the Blog'}</h3>

      <div className='blogs-wrapper'>
        {/* Featured blog */}
        <div className='featured-blog'>
          <h4 className='blog-category'>{blogData.featured.category}</h4>
          <div className='featured-image'>
            <img src={blogData.featured.image} alt="Featured blog" />
          </div>
          <h5 className='blog-title'>{blogData.featured.title}</h5>
          <p className='blog-description'>
            {blogData.featured.description}
            <a href={blogData.featured.link} className='read-more'> <br/>Read More ... <FaArrowRight style={{ marginLeft: '5px' }}/></a>
          </p>
          <button className='visit-button'>Visit Our Blogs</button>
        </div>

        {/* Other blogs */}
        <div className='other-blogs'>
          {blogData.others.map((blog, index) => (
            <div className='blog-item' key={index}>
              <div className='blog-image'>
                <img src={blog.image} alt={`Blog ${index + 1}`} />
              </div>
              <div className='blog-content'>
                <h4 className='blog-category'>{blog.category}</h4>
                <h5 className='blog-title'>{blog.title}</h5>
                <p className='blog-description'>
                  {blog.description}
                  <a href={blog.link} className='read-more'><br/> Read More ... <FaArrowRight style={{ marginLeft: '5px' }}/></a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;
