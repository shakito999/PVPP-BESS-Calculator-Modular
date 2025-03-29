import React from 'react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="help-modal">
      <div className="help-modal-content">
        <div className="help-modal-header">
          <h3>How to Use Solar Financial Analysis Tool</h3>
          <button 
            className="close-button"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="help-modal-body">
          <h4>1. System Comparison</h4>
          <p>Compare financial metrics between fixed and tracking solar systems using the view buttons in the header.</p>
          
          <h4>2. Financial Analysis</h4>
          <p>Analyze key financial metrics including:</p>
          <ul>
            <li>Levelized Cost of Energy (LCOE)</li>
            <li>Internal Rate of Return (IRR)</li>
            <li>Net Present Value (NPV)</li>
            <li>Payback Period</li>
          </ul>
          
          <h4>3. View Modes</h4>
          <ul>
            <li><strong>Comparison View:</strong> Side-by-side analysis of both systems</li>
            <li><strong>Fixed System:</strong> Detailed analysis of fixed solar system</li>
            <li><strong>Tracking System:</strong> Detailed analysis of tracking solar system</li>
          </ul>
          
          <h4>4. Additional Features</h4>
          <ul>
            <li>Cost Breakdown Analysis</li>
            <li>Financial Charts and Graphs</li>
            <li>Export to Excel (with charts)</li>
          </ul>
          
          <h4>5. Settings</h4>
          <p>Customize your analysis with:</p>
          <ul>
            <li>Levered vs Unlevered analysis</li>
            <li>Battery storage integration</li>
            <li>Plant capacity adjustments</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
