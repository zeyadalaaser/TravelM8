import React from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useWalkthrough } from '../contexts/WalkthroughContext';

export function Walkthrough() {
  const { 
    steps, 
    isWalkthroughActive, 
    toggleWalkthrough
  } = useWalkthrough();

  const handleJoyrideCallback = (data) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      toggleWalkthrough();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={isWalkthroughActive}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      styles={{
        options: {
          primaryColor: '#007bff',
          zIndex: 10000,
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        buttonNext: {
          backgroundColor: '#007bff'
        },
        buttonBack: {
          marginRight: 10
        }
      }}
      callback={handleJoyrideCallback}
      spotlightClicks={true}
      disableOverlayClose={true}
    />
  );
}

