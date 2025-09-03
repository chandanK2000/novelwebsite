import React, { useState } from 'react';
import './Blogs.css';
import blog1 from '../../assets/images/blog1.png';

const Blogs = () => {
  const [search, setSearch] = useState('');
  const categories = [
    "Software",
    "Healthcare",
    "Finance",
    "E-commerce",
    "Education",
    "Case studies",
    "Data Architecture",
    "Data Engineering",
    "Data Visualisation",
    "AI",
    "Data Quality",
    "Data Migration",
  ];

  // Filter categories based on search input
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="blogs-section">
      <h2>DataNovel Insights Blog</h2>
      <div className="d-flex">
        <div>
          <img src={blog1} alt="Blog Thumbnail" />
        </div>
        <div style={{background:'rgba(245, 247, 250, 1)'}}>
          <input
            type="search"
            placeholder="Search Blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='form-control'
          />
          <h4>Posts by Category</h4>
          <ul>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, index) => (
                <li key={index}>{cat}</li>
              ))
            ) : (
              <li>No results found</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
