import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useStripeCheckout } from '../../Context/StripeCheckoutContext';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentSuccessUI = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { OrderSucesss } = useStripeCheckout();
  const { id } = useParams();
const navigate=useNavigate()
  useEffect(() => {
    OrderSucesss(id);
  }, [id]);

  useEffect(() => {
    // Trigger confetti animation when component mounts
    setShowConfetti(true);
   
    // Clean up confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
   
    return () => clearTimeout(timer);
  }, []);
 
  const handleContinueShopping = () => {
    alert("Redirecting to homepage...");
    navigate('/')
  };
 
  return (
    <div className="success-container">
      {/* Confetti effect */}
      {showConfetti && <Confetti />}
     
      <div className="success-card">
        <div className="icon-container">
          <CheckCircle size={80} className="success-icon" />
        </div>
       
        <h1 className="success-title">
          Payment Successful!
        </h1>
       
        <p className="success-message">
          Your payment has been processed successfully. Thank you for your purchase!
        </p>
       
        <button
          onClick={handleContinueShopping}
          className="continue-button"
        >
          Continue Shopping
        </button>
       
       
      </div>
    </div>
  );
};

// Confetti component
const Confetti = () => {
  const colors = ['#10B981', '#3B82F6', '#FBBF24', '#EC4899', '#8B5CF6'];
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = `${Math.random() * 100}%`;
    const animationDuration = `${Math.random() * 3 + 2}s`;
    const animationDelay = `${Math.random() * 2}s`;
    const rotation = `${Math.random() * 360}deg`;
   
    return (
      <div
        key={i}
        className="confetti-piece"
        style={{
          left,
          backgroundColor: color,
          animationDuration,
          animationDelay,
          transform: `rotate(${rotation})`
        }}
      />
    );
  });
 
  return <>{confettiPieces}</>;
};

const PaymentSuccessPage = () => {
  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
       
          
          .success-container {
           
            min-height: 50vh;
            width: 100;
            margin-bottom:70px
          
          }
          
          .success-card {
            background-color: white;
            border-radius: 0;
            box-shadow: none;
            padding: 32px 16px;
            width: 100vw;
            margin: 0;
            text-align: center;
            animation: fadeIn 0.8s ease-in-out;
          }
          
          .icon-container {
            margin: 0 auto 24px;
          }
          
          .success-icon {
            color: #10B981;
            margin: 0 auto;
            animation: pulse 2s infinite;
          }
          
          .success-title {
            font-size: 24px;
            font-weight: 700;
            color: #1F2937;
            margin-bottom: 12px;
          }
          
          @media (min-width: 768px) {
            .success-title {
              font-size: 30px;
            }
          }
          
          .success-message {
            color: #6B7280;
            margin-bottom: 32px;
          }
          
          .continue-button {
            background-color: #10B981;
            color: white;
            font-weight: 600;
            padding: 12px 32px;
            border-radius: 8px;
            width: 100%;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .continue-button:hover {
            background-color: #059669;
            transform: translateY(-4px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .support-link {
            display: block;
            margin-top: 24px;
            color: #10B981;
            font-size: 14px;
            text-decoration: none;
          }
          
          .support-link:hover {
            text-decoration: underline;
          }
          
          .confetti-piece {
            position: absolute;
            width: 8px;
            height: 8px;
            opacity: 0.7;
            top: -20px;
            animation: fall linear forwards;
          }
          
          @keyframes fall {
            0% {
              transform: translateY(-10px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          
          @keyframes fadeIn {
            from { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      <PaymentSuccessUI />
    </>
  );
};

export default PaymentSuccessPage;