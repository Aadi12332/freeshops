/** @format */

const endPoints = {
  auth: {
    signup: "api/v1/user/registration",
    login: "api/v1/user/login",
    getProfile: "api/v1/user/getProfile",
    forgetPassword: "api/v1/user/forgetPassword",
    forgotVerifyotp: "api/v1/user/forgotVerifyotp",
    changePassword: (id = '') => `api/v1/user/changePassword/${id}`,
    socialLogin:"api/v1/user/socialLogin"
  },
  getCategories: "api/v1/admin/Category/allCategory",
  products: {
    getAllProducts: (query = "") => `api/v1/user/allProduct?${query}`,
    getProductDetailBeforeLogin: (id = "") =>
      `api/v1/user/getProductBeforeLogin/${id}`,
    getProductDetail: (id = "") => `api/v1/user/getProduct/${id}`,
    createProduct: "api/v1/user/addProduct",
    getMyProducts: "api/v1/user/getProductsByToken",
    removeProduct: (id) => `api/v1/user/deleteProduct/${id}`,
    editPost: (id) => `api/v1/user/updateProduct/${id}`,
  },
  cart: {
    getCart: (query = "") => `api/v1/user/getCart`,
    addToCart: (query = "") => `api/v1/user/addToCart/${query}`,
    cartCheckout: () => `api/v1/user/checkout`,
    stripeCheckout: (id = "") => `api/v1/user/stripeCheckoutForApp/${id}`,
  },
  order: {
    successOrder: (id = "") => `api/v1/user/successOrder/${id}`,
    getOrders: () => `api/v1/user/getOrders`,
  },
  account: {
    getDashboard: () => `api/v1/user/dashboard`,
    getProfile: () => `api/v1/user/getProfile`,
    updateProfile: () => `api/v1/user/update`,
  },
  notifications: {
    getAll: () => `api/v1/user/getNotification`,
  },
  subCategories: {
    getSubCategoryByCatalog: (id) =>
      `api/v1/SubCategory/allSubcategoryById/${id}`,
  },
  getAllConditions: "api/v1/admin/Condition/allCondition",
  getAllBrands: "api/v1/admin/Brand/allBrand",
  getAllModels: "api/v1/admin/Model/allModel",
  getLocation: ({ lat, long }) =>
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`,
  blogs: {
    getAll: (query = "") => `api/v1/admin/allBlog?${query}`,
  },
  getHelpCenter: "api/v1/admin/HelpCenter/allCategory",
  getArticle: (query = "") => `api/v1/admin/Article/getArticle?${query}`,
  getJobs: (query = "") => `api/v1/user/allJobs?${query}`,
  getServiceCategory: "api/v1/admin/ServiceCategory/allServiceCategory",
  getJobDetail: (id) => `api/v1/user/getJobs/${id}`,
  applyToJob: (id) => `api/v1/user/applyJobs/${id}`,
  createJob: () => `api/v1/user/addJobs`,
  getMyJobs: () => `api/v1/user/allJobsByToken?limit=1000`,
  getUserSavedList: () => `api/v1/user/getUserSaveList`,
  createList:`api/v1/user/createUserSaveList`,
  career: {
    allcareer: "api/v1/admin/Career/allCareer",
    getOpenings: "api/v1/admin/allCareerOpeningForWebsite",
  },
  trust_safety: "api/v1/admin/TrustAndSafety/allTrustAndSafety",
  how_It_Works: "api/v1/admin/HowItsWork/allHowItsWork",
  allFreeShopNews: "api/v1/admin/FreeShopNews/allFreeShopNews",
  aboutUs: {
    blogs: "api/v1/admin/allFreeShopNewsForWebsite",
  },
  press: {
    contactDetails: "api/v1/admin/Press/allPress",
    pressTopic: "api/v1/admin/allPressTopic",
    news: "api/v1/admin/allPressNewsForWebsite",
    offerupNews: "api/v1/admin/allPressOfferUpNews",
  },
};

export default endPoints;
