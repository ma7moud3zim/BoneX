import React, { useState, useEffect } from 'react';
import { Rating } from '@mui/material';
import quote from '../icons/images-removebg-preview.png';
// Review data with real usernames and unique images from Unsplash
const reviewSets = [
  [
    {
      text: "I contacted a doctor through the app and was surprised by the fast response and support. The doctor was very cooperative.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=60",
      username: "John Doe",
    },
    {
      text: "I was hesitant to share my personal data, but after experiencing the service and communicating with the doctor, I felt safe and secure.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1557296387-5358ad7997bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=60",
      username: "Alice Smith",
    },
    {
      text: "An amazing app that helped me connect with a doctor, especially when I had an urgent health issue.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=60",
      username: "Michael Kim",
    },
  ],
  [
    {
      text: "Thank you for the excellent services! Altibbi made the treatment experience easier with the doctor's recommendations and accurate, high-quality answers.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=60",
      username: "Laura Miller",
    },
    {
      text: "Telemedicine completely changed my life! I no longer need to wait in clinics. I can communicate with the doctor anytime and anywhere.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=60",
      username: "Robert Turner",
    },
    {
      text: "It made follow-up visits with the doctor easier after taking tests or prescribed medications.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=60",
      username: "Sophia Parker",
    },
  ],
 
];

// ReviewCard component
function ReviewCard({ review }) {
    return (
      <div className="w-[438px] h-[257px]">
        <div className="border border-gray-200 shadow-md animate__animated animate__backInLeft  rounded-lg p-4 h-full flex flex-col justify-between">
          <div className="h-24 overflow-hidden">
            <p className="text-center text-gray-700">{review.text}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
          <img src={quote} alt="quote"  style={{width:'50px',height:'50px'}} className="w-8 h-8 mr-2" />
        
            <div className="flex items-center justify-end w-full">
                
              <div style={{display:'flex',flexDirection:'column' ,  alignItems:'end'}}>
              <span className="bg-[#287DA5] text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                {review.username[0]}
              </span>
            <Rating value={review.rating} readOnly />
            </div>
              <img 
                src={review.imageUrl} 
                alt={review.username} 
                className="w-[80px] h-[80px] rounded-full" 
              />
            </div>
          </div>
        
        </div>
      </div>
    );
  }

// Main ReviewsComponent
function ReviewsComponent() {
  const [currentSet, setCurrentSet] = useState(0);

  // Automatic cycling of reviews every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % reviewSets.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white py-8">
      {/* Main Header */}
      <div className="text-center">
      <h2 style={{
    fontFamily: 'Tajawal-Bold, serif',
    fontWeight: 500,
    color: 'rgb(23, 23, 37)',
    fontSize: '32px',
    lineHeight: '38px',
  }}
>
  Customer Reviews
</h2>

        <p className="text-gray-600 mt-2">
          See the experiences of our previous clients and their opinions about our services, and benefit from their expertise to make the best decision for you.
        </p>
      </div>

      {/* Review Cards */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-10">
          {reviewSets[currentSet].map((review, index) => (
            <ReviewCard key={`set-${currentSet}-review-${index}`} review={review} />
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4">
        {reviewSets.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full mx-1 cursor-pointer ${
              index === currentSet ? 'bg-[#287DA5]' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentSet(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default ReviewsComponent;