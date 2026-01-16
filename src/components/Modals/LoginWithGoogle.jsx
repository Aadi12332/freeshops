import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useStripeCheckout } from '../../Context/StripeCheckoutContext';

function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { LoginWithSocial } = useStripeCheckout();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const userInfo = await res.json();

        if (!userInfo.email) {
          throw new Error("Failed to retrieve user info.");
        }

        const userData = {
          fullName: `${userInfo.given_name} ${userInfo.family_name}`,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          email: userInfo.email,
        };

        const response = await LoginWithSocial(userData);

        if (response?.data?.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('user', JSON.stringify(response.data));
          window.location.reload(); // ✅ Reloads same page
        } else {
          console.error('LoginWithSocial failed: No accessToken in response');
        }
      } catch (error) {
        console.error('Login failed or user not found. Please create an account.', error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      console.error('Google login failed');
      setIsLoading(false);
    },
  });

  return (
    <button
      type="button"
      className="login-modal-google flex items-center justify-center gap-2 relative"
      onClick={googleLogin}
      disabled={isLoading} // prevent multiple clicks
    >
      <FcGoogle size={24} />
      {isLoading ? (
        <span className="text-xs text-gray-500">Loading...</span>
      ) : (
        <p>Continue with Google</p>
      )}
    </button>
  );
}

export default GoogleLoginButton;
