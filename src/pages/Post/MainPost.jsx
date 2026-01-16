import React from 'react';
import Post from './Post';
import OfferUpJobUI from './OfferUpJobUI';

function MainPost() {
  return (
    <div className="">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <Post />
        </div>
        <div className="col-12 col-lg-4">
          <OfferUpJobUI />
        </div>
      </div>
    </div>
  );
}

export default MainPost;
