import React, { useState } from 'react';
import { DollarSign, Printer, Copy, Info } from 'lucide-react';
import './PriceCalculator.css';

const PriceCalculator: React.FC = () => {
  const [bid, setBid] = useState<string>('100');
  const [location, setLocation] = useState<string>('OH - Cleveland West');
  const [shippingCountry, setShippingCountry] = useState<string>('India');
  const [port, setPort] = useState<string>('Nhava Sheva (Mumbai)');
  const [fromPort, setFromPort] = useState<string>('New Jersey, NJ');
  const [totalLossCoverage, setTotalLossCoverage] = useState<boolean>(true);
  const [fullCoverage, setFullCoverage] = useState<boolean>(false);

  // Calculate fees
  const copartFees = 278;
  const brokerFees = 450;
  const documentationFees = 135;
  const bankWireFee = 25;
  const totalLossCoverageAmount = totalLossCoverage ? 75 : 0;
  const fullCoverageAmount = fullCoverage ? Number(bid) * 0.05 : 0;

  const totalPrice = Number(bid) + copartFees + brokerFees + documentationFees + 
    bankWireFee + totalLossCoverageAmount + fullCoverageAmount;

  const handlePrint = () => {
    window.print();
  };

  
  const handleCopy = () => {
    const text = `Total Price: $${totalPrice.toFixed(2)} USD`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="calculator-container ">
      <div className="calculator-column">
      {/* Left Column - Input Fields */}
      <div className="calculator-card">
        <h1 className="calculator-title">Calculate the Final Price for Any Vehicle</h1>
        
        <div className="input-group">
        <div>
          <label className="form-label">Enter Your Bid</label>
          <div className="input-wrapper">
          <DollarSign className="currency-icon" />
          <input
            type="number"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            className="form-input"
            style={{ fontSize: '16px' }}
          />
          </div>
        </div>
</div>
      </div>
        {/* <div>
          <label className="form-label">Auction Location</label>
          <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="form-select"
          style={{ fontSize: '16px' }}
          >
          <option>OH - Cleveland West</option>
          <option>NY - Long Island</option>
          <option>CA - Los Angeles</option>
          </select>
        </div>

        <div>
          <label className="form-label">Shipping to Country</label>
          <select
          value={shippingCountry}
          onChange={(e) => setShippingCountry(e.target.value)}
          className="form-select"
          style={{ fontSize: '16px' }}
          >
          <option>India</option>
          <option>UAE</option>
          <option>Singapore</option>
          </select>
        </div>

        <div>
          <label className="form-label">Port</label>
          <select
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="form-select"
          style={{ fontSize: '16px' }}
          >
          <option>Nhava Sheva (Mumbai)</option>
          <option>Chennai</option>
          <option>Mundra</option>
          </select>
        </div>

        <div>
          <label className="form-label">From US Port</label>
          <select
          value={fromPort}
          onChange={(e) => setFromPort(e.target.value)}
          className="form-select"
          style={{ fontSize: '16px' }}
          >
          <option>New Jersey, NJ</option>
          <option>Los Angeles, CA</option>
          <option>Miami, FL</option>
          </select>
        </div>
        </div>
      </div> */}

      {/* Right Column - Calculation Results */}
      <div className="calculator-card mt-5">
        <div className="input-group">
        <div className="fee-row">
          <div className="fee-label">
          <span>Final Bid at Auction</span>
          <Info className="info-icon" />
          </div>
          <span className="fee-amount">${bid} USD</span>
        </div>
{/* 
        <div className="fee-row">
          <div className="fee-label">
          <span>Copart Fees</span>
          <Info className="info-icon" />
          </div>
          <span className="fee-amount">${copartFees} USD</span>
        </div> */}

        <div className="fee-row">
          <div className="fee-label">
          <span>Broker Fees</span>
          <Info className="info-icon" />
          </div>
          <span className="fee-amount">${brokerFees} USD</span>
        </div>

        <div className="fee-row">
          <div className="fee-label">
          <span>Documentation Fees</span>
          <Info className="info-icon" />
          </div>
          <span className="fee-amount">${documentationFees} USD</span>
        </div>

        <div className="fee-row">
          <span className="fee-label">International Bank Wire Payment</span>
          <span className="fee-amount">${bankWireFee} USD</span>
        </div>

        <div className="coverage-option">
          <input
          type="checkbox"
          checked={totalLossCoverage}
          onChange={(e) => setTotalLossCoverage(e.target.checked)}
          className="checkbox"
          />
          <div className="fee-label">
          <span>Total Loss Coverage (1.5%)</span>
          <Info className="info-icon" />
          </div>
          <span className="fee-amount">${totalLossCoverageAmount} USD</span>
        </div>

        <div className="coverage-option">
          <input
          type="checkbox"
          checked={fullCoverage}
          onChange={(e) => setFullCoverage(e.target.checked)}
          className="checkbox"
          />
          <div className="fee-label">
          <span>Full Coverage (5%)</span>
          <Info className="info-icon" />
          </div>
          <span className="fee-amount">${fullCoverageAmount.toFixed(2)} USD</span>
        </div>

        <div className="total-price">
          <div className="total-row">
          <span className="total-label">Total Price*</span>
          <span className="total-amount">${totalPrice.toFixed(2)} USD</span>
          </div>
        </div>

        <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={handlePrint} className="action-button">
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button onClick={handleCopy} className="action-button">
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>

      
        </div>
      </div>
      </div>
    </div>
  );
};

export default PriceCalculator;