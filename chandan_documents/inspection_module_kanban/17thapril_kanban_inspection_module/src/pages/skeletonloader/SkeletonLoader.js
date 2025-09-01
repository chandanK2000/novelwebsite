import React from "react";
import Skeleton from "react-loading-skeleton"; // Using the react-loading-skeleton library

const SkeletonLoader = ({ numItems = 4 }) => {
  const skeletonItems = [];
  for (let i = 0; i < numItems; i++) {
    skeletonItems.push(
      <div key={i} className="skeleton-item">
        <Skeleton height={150} width={150} />
      </div>
    );
  }

  return (
    <div className="skeleton-grid">
      {skeletonItems}
    </div>
  );
};

export default SkeletonLoader;
