import { useState, useEffect } from 'react';
import { XCircle, RefreshCw } from 'lucide-react';
import { useStripeCheckout } from '../../Context/StripeCheckoutContext';
import { useParams } from 'react-router-dom';

const PaymentFailedUI = () => {
  const [isShaking, setIsShaking] = useState(false);
 const {OrderCancel}=useStripeCheckout()
const {id}=useParams()


 useEffect(()=>{
  OrderCancel(id)
 },[id])
  useEffect(() => {
    setIsShaking(true);
    const timer = setTimeout(() => {
      setIsShaking(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTryAgain = () => {
    alert("Redirecting to payment page...");
  };

  return (
    <div style={styles.container}>
      <div style={{ 
        ...styles.card, 
        animation: `${isShaking ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97)' : 'fade-in 0.8s ease-in-out'}`
      }}>
        <div style={styles.iconWrapper}>
          <XCircle size={80} color="#EF4444" />
        </div>
        <h1 style={styles.heading}>Payment Failed</h1>
        <p style={styles.subText}>
          We were unable to process your payment. Please check your payment details and try again.
        </p>
       
        <div style={styles.reasonSection}>
          <p style={styles.reasonTitle}>Common reasons for payment failure:</p>
          <ul style={styles.reasonList}>
            <li style={styles.reasonItem}>Insufficient funds</li>
            <li style={styles.reasonItem}>Incorrect card details</li>
            <li style={styles.reasonItem}>Transaction declined by bank</li>
            <li style={styles.reasonItem}>Network connectivity issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: 32,
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
  },
  iconWrapper: {
    marginBottom: 24,
  },
  heading: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  subText: {
    color: '#4B5563',
    marginBottom: 32,
  },
  tryAgainButton: {
    backgroundColor: '#EF4444',
    color: 'white',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: 8,
    width: '100%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  reasonSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTop: '1px solid #F3F4F6',
    textAlign: 'left',
  },
  reasonTitle: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  reasonList: {
    paddingLeft: 20,
    color: '#4B5563',
    fontSize: 14,
  },
  reasonItem: {
    listStyleType: 'disc',
    marginLeft: 16,
  },
};

// Add keyframe animations
const AnimationStyles = () => (
  <style>{`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `}</style>
);

const PaymentFailedPage = () => {
  return (
    <>
      <AnimationStyles />
      <PaymentFailedUI />
    </>
  );
};

export default PaymentFailedPage;
