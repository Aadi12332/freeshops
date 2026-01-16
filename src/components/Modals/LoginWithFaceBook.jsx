import { useState } from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa'; // Added missing import
import { useStripeCheckout } from '../../Context/StripeCheckoutContext';

function FacebookLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { LoginWithSocial } = useStripeCheckout();

  const handleFacebookResponse = async (response) => {
    if (!response.accessToken) {
      setError('Facebook login failed. No access token received.');
      return;
    }
    
    if (!window.FB) {
      setError('Facebook SDK not loaded. Please refresh the page.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      window.FB.api('/me', { fields: 'id,name,email' }, async (userInfo) => {
        if (userInfo.error) {
          throw new Error(userInfo.error.message || 'Failed to fetch user information');
        }
        
        const userData = {
          socialId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          accessToken: response.accessToken,
          provider: 'facebook',
        };
        
        const result = await LoginWithSocial(userData);
        
        if (result?.data?.accessToken) {
            localStorage.setItem('token', result.data.accessToken);
            localStorage.setItem('user', JSON.stringify(result.data));
  window.location.reload(); // ✅ Reloads same page        } else {
        } else {
          setError('Login failed. Please try again.');
        }
        
        setIsLoading(false);
      });
    } catch (err) {
      console.error('Facebook login error:', err);
      setError('Failed to complete Facebook login. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleFacebookError = (error) => {
    console.error('Facebook login error:', error);
    setError('Failed to connect to Facebook. Please try again.');
    setIsLoading(false);
  };
  
  return (
    <div className="w-full flex flex-col items-center">
      <FacebookLogin
        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
        onSuccess={handleFacebookResponse}
        onFail={handleFacebookError}
        scope="email,public_profile"
        initParams={{
          version: 'v18.0',
          cookie: true,
          xfbml: true,
        }}
        style={{
          backgroundColor: 'transparent',
          padding: 0,
          border: 'none',
          borderRadius: 0,
          width: '100%',
        }}
        render={({ onClick }) => (
          <div
            className="login-modal-face "
            onClick={onClick} // Fixed: Changed handleFacebookLogin to onClick
            aria-label="Continue with Facebook"
          >
            <FaFacebook className="text-blue-600" />
            <p>Continue with Facebook</p>
            {isLoading && <span className="ml-2 text-xs text-gray-500">Loading...</span>}
          </div>
        )}
      />
      {error && (
        <div className="w-full md:w-[756px] flex items-center text-red-500 text-sm mt-1 mb-3">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default FacebookLoginButton;