import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const token = localStorage.getItem("token");

const StripeCheckoutContext = createContext();
const Baseurl = import.meta.env.VITE_BASE_URL;

export const StripeCheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(false);
   const [orderList,setOrderList]=useState([])
      const [TransactionList,setTransactionList]=useState([])

      const [notificationList,setNotificationList]=useState([])
            const [likeProduct,setLikeProductList]=useState([])


  const fetchCheckoutSession = async (sessionId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${Baseurl}api/v1/user/stripeCheckout/${sessionId}`,
        {}, // no body content
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCheckoutData(response.data);
    } catch (error) {
      console.error('Error fetching checkout session:', error);
      setCheckoutData(null);
    } finally {
      setLoading(false);
    }
  };
  

  
// console.log('token',token)
const OrderSucesss = async (sessionId) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${Baseurl}api/v1/user/successOrder/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    setCheckoutData(null);
  } finally {
    setLoading(false);
  }
};


  
  const OrderCancel = async (sessionId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Baseurl}api/v1/user/cancelOrder/${sessionId}`,
        {}, // no body content
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response
    } catch (error) {
      console.error('Error fetching checkout session:', error);
      setCheckoutData(null);
    } finally {
      setLoading(false);
    }
  };

  const sendMsgNotification = async (data,id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${Baseurl}api/v1/user/sendMessageNotification`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching checkout session:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getOrderList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Baseurl}api/v1/user/getOrders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrderList(response?.data)
      return response;
    } catch (error) {
      console.error('Error fetching checkout session:', error);
    } finally {
      setLoading(false);
    }
  };
  

const getNotificationList = async (params) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${Baseurl}api/v1/user/getNotification`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params, // 👈 yahan params pass karo
      }
    );
    setNotificationList(response?.data?.data);
    return response;
  } catch (error) {
    console.error("Error fetching notification list:", error);
  } finally {
    setLoading(false);
  }
};






const getLikeProductList= async (params) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${Baseurl}api/v1/user/getAllLikeProducts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params, // 👈 yahan params pass karo
      }
    );
    setLikeProductList(response?.data?.data);
    return response;
  } catch (error) {
    setLikeProductList([])
    console.error("Error fetching notification list:", error);
  } finally {
    setLoading(false);
  }
};



const productLikeAndUnlike = async (id) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${Baseurl}api/v1/user/productLikeDislike/${id}`,
      {}, // empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error liking/disliking product:", error);
  } finally {
    setLoading(false);
  }
};

  const updateNotificationSettings = async (data) => {
  try {
    setLoading(true);
    const response = await axios.put(
      `${Baseurl}api/v1/user/updateNotificationSetting1`,
    data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error liking/disliking product:", error);
  } finally {
    setLoading(false);
  }
};


    const getTransactionList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Baseurl}api/v1/user/getTransactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactionList(response?.data)
      return response;
    } catch (error) {
      console.error('Error fetching checkout session:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const LoginWithSocial = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${Baseurl}api/v1/user/socialLogin`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching checkout session:', error);
      setCheckoutData(null);
    } finally {
      setLoading(false);
    }
  };
  

// Updated changePassWordAfterLogin function for StripeCheckoutContext.jsx
// Updated changePassWordAfterLogin function for StripeCheckoutContext.jsx
const changePassWordAfterLogin = async (data) => {
  try {
    setLoading(true);
    const response = await axios.put(
      `${Baseurl}api/v1/admin/changePasswordAfterLogin`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    // Pass the error along to be handled by the component
    throw error;
  } finally {
    setLoading(false);
  }
};


const postProduct = async (data) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${Baseurl}api/v1/user/addProduct`,
      data, // no body content
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCheckoutData(response.data);
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    setCheckoutData(null);
  } finally {
    setLoading(false);
  }
};

const ProductInchat = async (id) => {
  try {
    const response = await axios.put(
      `${Baseurl}api/v1/user/updateProductInChatStatus/${id}`,
      {}, // empty request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    setCheckoutData(null);
  } finally {
    setLoading(false);
  }
};


const ProductInNochat = async (id) => {
  try {
    const response = await axios.put(
      `${Baseurl}api/v1/user/updateProductNotInChatStatus/${id}`,
      {}, // empty request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    setCheckoutData(null);
  } finally {
    setLoading(false);
  }
};


  return (
    <StripeCheckoutContext.Provider value={{ checkoutData,getTransactionList,TransactionList,getLikeProductList,likeProduct,updateNotificationSettings,
    
    
    loading,sendMsgNotification,productLikeAndUnlike, fetchCheckoutSession,OrderSucesss,OrderCancel,LoginWithSocial,changePassWordAfterLogin,postProduct,ProductInchat,ProductInNochat,getOrderList,orderList,getNotificationList,notificationList }}>
      {children}
    </StripeCheckoutContext.Provider>
  );
};

export const useStripeCheckout = () => useContext(StripeCheckoutContext);
