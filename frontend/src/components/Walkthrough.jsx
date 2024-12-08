import React, { useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useWalkthrough } from '../contexts/WalkthroughContext';

export function Walkthrough() {
  const { 
    steps, 
    isWalkthroughActive, 
    toggleWalkthrough
  } = useWalkthrough();

  useEffect(() => {
    if (isWalkthroughActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isWalkthroughActive]);

  const handleJoyrideCallback = (data) => {
    const { status, action, index, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      toggleWalkthrough();
      // Scroll to the top of the page after finishing or skipping the walkthrough
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    if (action === 'update' && type === 'step:after') {
      const targetElement = document.querySelector(`[data-tour="${steps[index].target.slice(12, -2)}"]`);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 300);
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={isWalkthroughActive}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      scrollToFirstStep={true}
      scrollOffset={100}
      disableOverlayClose={true}
      spotlightClicks={true}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#007bff',
          arrowColor: '#fff',
          backgroundColor: '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
          beaconSize: 36,
          overlayPadding: 0,
        },
        tooltip: {
          fontSize: '14px',
          padding: '15px',
          borderRadius: '5px',
          maxWidth: '300px',
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        buttonNext: {
          backgroundColor: '#007bff',
          fontSize: '14px',
          padding: '8px 15px',
        },
        buttonBack: {
          marginRight: 10,
          fontSize: '14px',
          padding: '8px 15px',
        },
        buttonSkip: {
          color: '#007bff',
          fontSize: '14px',
        },
      }}
      floaterProps={{
        disableAnimation: true,
        hideArrow: false,
        offset: 16,
        placement: 'auto',
        styles: {
          floater: {
            filter: 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.2))',
          },
        },
      }}
      getHelpers={(helpers) => {
        window.joyrideHelpers = helpers;
      }}
      callback={handleJoyrideCallback}
    />
  );
}

