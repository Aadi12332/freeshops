/** @format */

import ProtectedRoutes from "../components/ProtectedRoutes/ProtectedRoutes";
import AboutUs from "../pages/About Us/AboutUs";
import Autodealerships from "../pages/Auto dealerships/Autodealerships";
import Blog from "../pages/Blog/Blog";
import Careers from "../pages/careers/Careers";
import Chat from "../pages/Chat/Chat";
import BrowseList from "../pages/Explore/Explore";
import FindJobs from "../pages/Find Jobs/FindJobs";
import JobDetails from "../pages/Find Jobs/JobDetails";
import Help from "../pages/Help/Help";
import MyListing from "../pages/My Listing/MyListing";
import EditPost from "../pages/Post/EditPost";
import Post from "../pages/Post/Post";
import Press from "../pages/Press/Press";
import ProductDetails from "../pages/ProductDetail/ProductDetails";
import ProductList from "../pages/ProductList/ProductList";
import Thanks from "../pages/Thankyou/Thanks";
import TrustSection from "../pages/Trust & safety/Trustsafety";
import Home from "../pages/Home/Home";
import Cart from "../pages/Cart/Cart";
import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage";
import OrderPage from "../pages/Order/Order";
import MyAccount from "../pages/MyAccount/MyAccount";
import PostJob from "../pages/PostJob/PostJob";
import EditJob from "../pages/EditJob/EditJob";
import PaymentSuccessPage from "../pages/Order/paymentSucess";
import PaymentFailedPage from "../pages/Order/PaymentFailedUI";
import PrivacyPolicyComponent from "../pages/About Us/PrivacyPolicy";
import TermsOfServiceComponent from "../pages/About Us/TermsOfServiceComponent";
import MainPost from "../pages/Post/MainPost";
import AboutUsComponent from "../pages/About Us/AboutUsComponent";
import Inbox from "../pages/Chat/Inbox";
import NotificationSettings from "../pages/MyAccount/NotificationSettings";
import GettingStarted from "../pages/HelpCenter/GettingStarted";
import CreateAccountPage from "../pages/HelpCenter/CreateAccountPage";
import SavedProducts from "../components/Header/SavedProducts";
import ContactUs from "../pages/About Us/ContactUs";
import TutorialComponent from "../pages/About Us/TutorialComponent";
// import Cart from "../pages/Cart/Cart";

const allRoutes = [
  {
    layout: null,
    routes: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product-list",
        element: <ProductList />,
      },

         {
        path: "/getting-started",
        element: <GettingStarted />,
      },
      {
        path: "/products/",
        element: <ProductDetails />,
      },
      {
        path: "/account/",
        element: <MyAccount />,
      },

      // {
      //   path: "/aboutus",
      //   element: <AboutUs />,
      // },
         {
        path: "/aboutus",
        element: <AboutUsComponent />,
      },

      {
        path: "/explore",
        element: <BrowseList />,
      },
      {
        path: "/trust-safety",
        element: <TrustSection />,
      },
      {
        path: "/auto-dealerships",
        element: <Autodealerships />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/press",
        element: <Press />,
      },
      {
        path: "/help",
        element: <Help />,
      },
 {
        path: "/help/create-account",
        element: <CreateAccountPage />,
      },
      {
        path: "/careers",
        element: <Careers />,
      },
      {
        path: "/jobs",
        element: <FindJobs />,
      },
      {
        path: "/post-job",
        element: <PostJob />,
      },
      {
        path: "/edit-job/:id",
        element: <EditJob />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/orders",
        element: <OrderPage />,
      },
      {
        path: "/order-success",
        element: <OrderSuccessPage />,
      },
         {
        path: "/privacy-policy",
        element: <PrivacyPolicyComponent />,
      },
           {
        path: "/terms-of-service",
        element: <TermsOfServiceComponent />,
      },
      {
        path: "/jobs/:id",
        element: <JobDetails />,
      },
      {
        path: "/thanks/:id",
        element: <PaymentSuccessPage />,
      },

      {
        path: "/failed/:id",
        element: <PaymentFailedPage />,
      },
        {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/post",
        element: <MainPost />,
      },

        {
        path: "/contact-us",
        element: <ContactUs />,
      },
        {
        path: "/tutorial-us",
        element: <TutorialComponent />,
      },
    ],
  },
  {
    layout: ProtectedRoutes,
    routes: [
    

      {
        path: "/post/thank-you",
        element: <Thanks />,
      },
      {
        path: "/mylisting",
        element: <MyListing />,
      },
      {
        path: "/edit-post/:id",
        element: <EditPost />,
      },
       {
        path: "/chat/inbox",
        element: <Inbox />,
      },
       {
        path: "/account/notification",
        element: <NotificationSettings />,
      },
        {
        path: "/saved-products",
        element: <SavedProducts />,
      },
    ],
  },
];

export default allRoutes;
