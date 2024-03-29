import React from 'react';
import './StepTracker.css'; // Make sure to create a corresponding CSS file

function StepTracker({ orderPhase }) {
  // Define the information for each step
  const stepsInfo = [
    'Payment Required',
    'Select Pickup Date',
    'Preparing Order',
    'Ready for Pickup'
  ];

  const phaseToStep = {
    step1: 1,
    step2: 2,
    step3: 3,
    step4: 4,
  };

  const currentStep = phaseToStep[orderPhase];

  return (
    <div className="StepTracker">
      {stepsInfo.map((info, index) => {
        // Calculate step index (1-based)
        const stepNumber = index + 1;
        // Determine if step is active, completed, or upcoming
        const stepClass = stepNumber === currentStep ? 'active' : stepNumber < currentStep ? 'completed' : '';
  
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className='line-between'
                id={`${
                  index + 1 === currentStep ? 'current' : 
                  index < currentStep ? 'completed' : ''
                }`} 
                key={`line-between-${index}`}
              >
                - - - - - - - - - - - - - 
              </div>
            )}
            <div className="stepContainer">
              <div className={`circle ${stepClass}`}>
                {stepNumber}
              </div>
              <h3 className={stepClass}>{info}</h3>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default StepTracker;