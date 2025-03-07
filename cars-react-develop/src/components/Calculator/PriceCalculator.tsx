import React, { useState } from 'react';
import { Printer, Copy, Info } from 'lucide-react';
import './PriceCalculator.css';

interface PriceCalculatorProps {
  currentBid: string | null;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ currentBid: initialBid }) => {
  const [currentBid, setBid] = useState<string>(initialBid || '0');
  // const [location, setLocation] = useState<string>('OH - Cleveland West');
  // const [shippingCountry, setShippingCountry] = useState<string>('India');
  // const [port, setPort] = useState<string>('Nhava Sheva (Mumbai)');
  // const [fromPort, setFromPort] = useState<string>('New Jersey, NJ');
  // const [totalLossCoverage, setTotalLossCoverage] = useState<boolean>(true);
  // const [fullCoverage, setFullCoverage] = useState<boolean>(false);

  // Calculate fees
  // const auctionFees = 450;
  const brokerFees = 450;
  const documentationFees = 135;
  const calculateBuyerFee = (bid: number): number => {
    if (bid <= 49.99) return 1.00;
    if (bid <= 99.99) return 1.00;
    if (bid <= 199.99) return 25.00;
    if (bid <= 299.99) return 60.00;
    if (bid <= 349.99) return 85.00;
    if (bid <= 399.99) return 100.00;
    if (bid <= 449.99) return 125.00;
    if (bid <= 499.99) return 135.00;
    if (bid <= 549.99) return 145.00;
    if (bid <= 599.99) return 155.00;
    if (bid <= 699.99) return 170.00;
    if (bid <= 799.99) return 195.00;
    if (bid <= 899.99) return 215.00;
    if (bid <= 999.99) return 230.00;
    if (bid <= 1199.99) return 250.00;
    if (bid <= 1299.99) return 270.00;
    if (bid <= 1399.99) return 285.00;
    if (bid <= 1499.99) return 300.00;
    if (bid <= 1599.99) return 315.00;
    if (bid <= 1699.99) return 330.00;
    if (bid <= 1799.99) return 350.00;
    if (bid <= 1999.99) return 370.00;
    if (bid <= 2399.99) return 390.00;
    if (bid <= 2499.99) return 425.00;
    if (bid <= 2999.99) return 460.00;
    if (bid <= 3499.99) return 505.00;
    if (bid <= 3999.99) return 555.00;
    if (bid <= 4499.99) return 600.00;
    if (bid <= 4999.99) return 625.00;
    if (bid <= 5499.99) return 650.00;
    if (bid <= 5999.99) return 675.00;
    if (bid <= 6499.99) return 700.00;
    if (bid <= 6999.99) return 720.00;
    if (bid <= 7499.99) return 755.00;
    if (bid <= 7999.99) return 775.00;
    if (bid <= 8499.99) return 800.00;
    if (bid <= 8999.99) return 820.00;
    if (bid <= 9999.99) return 820.00;
    if (bid <= 10499.99) return 850.00;
    if (bid <= 10999.99) return 850.00;
    if (bid <= 11499.99) return 850.00;
    if (bid <= 11999.99) return 860.00;
    if (bid <= 12499.99) return 875.00;
    if (bid <= 14999.99) return 890.00;
    return bid * 0.06;
  };

  const buyerFee = calculateBuyerFee(Number(currentBid));
  const gateFee = 95;
  const environmentalFee = 15;
  const internetBidFee = 145;
  const titleFee = 20;
  // const auctionFees = buyerFee + gateFee + environmentalFee + internetBidFee;
  const auctionFees = buyerFee + gateFee + environmentalFee + internetBidFee + titleFee;
  // const bankWireFee = 25;
  // const totalLossCoverageAmount = totalLossCoverage ? 75 : 0;
  // const fullCoverageAmount = fullCoverage ? Number(bid) * 0.05 : 0;

  // const auctionFees = buyerFee + gateFee + environmentalFee + internetBidFee;
  const totalPrice = Number(currentBid) + auctionFees + brokerFees + documentationFees;

  const handlePrint = () => {
    window.print();
  };

  
  const handleCopy = () => {
    const text = `Total Price: $${totalPrice.toFixed(2)} USD`;
    navigator.clipboard.writeText(text);
  };

  const handleIncrement = () => {
    setBid((prevBid) => {
      const currentValue = Number(prevBid);
      const increment = currentValue < 1000 ? 10 : 100;
      return (currentValue + increment).toString();
    });
  };

  const handleDecrement = () => {
    setBid((prevBid) => {
      const currentValue = Number(prevBid);
      const decrement = currentValue <= 1000 ? 10 : 100;
      const newValue = currentValue - decrement;
      return newValue >= 0 ? newValue.toString() : '0';
    });
  };

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setBid(value || '0');
  };

 

  return (
    <div className="calculator-container">
      <div className="calculator-row"></div>
      <div className="calculator-column">
      {/* Left Column - Input Fields */}
      <div className="input-group">
        <div>
          
        <label className="form-label">Enter Your Bid</label>
        <div className="bid-input-wrapper">
          <button className="bid-button" onClick={handleDecrement}>−</button>
            <div className="bid-currency">
            <input
            type="text"
            value={Number(currentBid).toLocaleString()}
            onChange={handleBidChange}
            className="bid-input"
            />
            </div>
          <button className="bid-button" onClick={handleIncrement}>+</button>
        </div>
        </div>
      </div>
      </div>

      {/* Right Column - Calculation Results */}
      <div className="calculator-card mt-5">
      <div className="input-group">
        <div className="fee-row">
        <div className="fee-label">
          <span>Lot Price</span>
        </div>
        <span className="fee-amount">${currentBid} USD</span>
        </div>

        <div className="fee-row">
        <div className="fee-label">
          <span>Auction Fees</span>
          <div className="tooltip-wrapper">
          <Info className="info-icon" />
          <div className="tooltip">
            <div className="tooltip-row">
            <span>Buyer Fee:</span>
            <span>${buyerFee}</span>
            </div>
            <div className="tooltip-row">
            <span>Internet Bid Fee:</span>
            <span>${internetBidFee}</span>
            </div>
            <div className="tooltip-row">
            <span>Service Fee:</span>
            <span>${gateFee}</span>
            </div>
            <div className="tooltip-row">
            <span>Environmental Fee:</span>
            <span>${environmentalFee}</span>
            </div>
            <div className="tooltip-row">
            <span>Title Fee:</span>
            <span>${titleFee}</span>
          </div>
          </div>
          </div>
        </div>
        <span className="fee-amount">${auctionFees.toLocaleString()} USD</span>
        </div>

        <div className="fee-row">
        <div className="fee-label">
          <span>Documentation Fees</span>
        </div>
        <span className="fee-amount">${documentationFees} USD</span>
        </div>

        <div className="fee-row">
        <div className="fee-label">
          <span>Broker Fees</span>
        </div>
        <span className="fee-amount">${brokerFees} USD</span>
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
  );
};

export default PriceCalculator;