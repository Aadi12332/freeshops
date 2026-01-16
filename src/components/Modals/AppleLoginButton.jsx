import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaApple } from "react-icons/fa";
import { useStripeCheckout } from '../../Context/StripeCheckoutContext';

function AppleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { LoginWithSocial } = useStripeCheckout();

  const initAppleLogin = async () => {
    setIsLoading(true);

    try {
      // Load Apple Sign-In JS
      await loadAppleSignInJS();

      // Initialize Apple Sign-In
      window.AppleID.auth.init({
        clientId: 'com.freeshop.app', // Replace with your Apple Client ID
        scope: 'email name',
        redirectURI: window.location.origin, // Adjust as needed
        usePopup: true
      });

      // Perform the sign-in
      const response = await window.AppleID.auth.signIn();

      // Process user data
      if (response && response.user) {
        // Extract user information from the response
        const { name, email } = response.user;

        const userData = {
          fullName: name?.firstName && name?.lastName ? `${name.firstName} ${name.lastName}` : "Apple User",
          firstName: name?.firstName || "Apple",
          lastName: name?.lastName || "User",
          email: email || `apple_user_${Date.now()}@example.com`, // Fallback email if not provided
        };

        // Call your API to login with social credentials
        const apiResponse = await LoginWithSocial(userData);

        if (apiResponse?.data?.accessToken) {
          localStorage.setItem('token', apiResponse.data.accessToken);
          localStorage.setItem('user', JSON.stringify(apiResponse.data));
          window.location.reload(); // ✅ Reloads same page        } else {
        } else {
          console.error('LoginWithSocial failed: No accessToken in response');
        }
      }
    } catch (error) {
      console.error('Apple login failed or user not found. Please create an account.', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to load Apple Sign-In JS
  const loadAppleSignInJS = () => {
    return new Promise((resolve, reject) => {
      if (window.AppleID) {
        return resolve();
      }

      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  return (
    <div
      className="login-modal-apple"
      onClick={initAppleLogin}
    >
      <FaApple />
      <p>Continue with Apple</p>
      {isLoading && <span className="ml-2 text-xs text-gray-500">Loading...</span>}
    </div>
  );
}

export default AppleLoginButton;