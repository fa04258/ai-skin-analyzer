import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md" role="alert">
      <p className="font-bold">Important Disclaimer</p>
      <p>This AI-powered analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified dermatologist or other healthcare provider with any questions you may have regarding a medical condition.</p>
    </div>
  );
};

export default Disclaimer;