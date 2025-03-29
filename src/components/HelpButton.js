import React, { useState } from 'react';
import HelpModal from './HelpModal';

const HelpButton = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="help-section">
        <button 
          className="help-button"
          onClick={() => setShowHelp(true)}
          title="Click for help and instructions"
        >
          <i className="fas fa-question-circle"></i>
        </button>
      </div>

      <HelpModal 
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </>
  );
};

export default HelpButton;
