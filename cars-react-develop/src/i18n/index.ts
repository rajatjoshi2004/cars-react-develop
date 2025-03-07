import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { Header } from 'antd/es/layout/layout';
import Landing from '../pages/Landing';
import Register from '../pages/Register';
// Initialize i18next with HTTP backend for API-based translations
i18n
  .use(HttpBackend) // Load translations via HTTP (API)
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Initialize react-i18next
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // React already escapes values
    },
    // Add a comma here to fix the syntax error
    backend: {
      // API endpoint for translations
      // In a real app, this would be your translation API endpoint
      loadPath: '/api/locales/{{lng}}.json',
      // For demo purposes, we'll use local JSON files
      // In production, replace with actual API endpoint
      requestOptions: {
        // Custom headers for API requests if needed
        headers: {
          'Content-Type': 'application/json'
        },
      },
    },
    react: {
      useSuspense: true
    }
  });

// Fallback translations in case API fails
const fallbackTranslations = {
  en: {
    header: {
      herotitle: "Smart AI technology helps you find the best auction cars at the right price—shipped from the USA & Canada.",
      subtitle: "Choose from over 300,000+ Used, Wholesale and Repairable Cars, Trucks, and SUVs for Sale at Copart & IAAI Auto Auctions",
      signIn: "SIGN IN",
      dashboard: "Dashboard",
      myAccount: "My Account",
      logout: "Logout",
      profile: "Profile",
      all: "All",
      searchInput: "Search Vehicles by Make, Model, Year, Vin, etc",
      signInAccount: "Sign In to Your Account",
      emailLogin: "Please enter your email!",
      passwordLogin: "Please enter your password!",
      forgot: "Forgot password?",
      agreement: " By clicking SIGN IN you",
      account : " Don't have an account?",
      watchlist: "Watchlist",
      damage :"Damage",
      currentBid: "Current Bid",
      saleDate :"Sale Date",
      color : "Color",
      lotNumber: "Lot Number",
      remove : "Remove",
    },
    landing: {
      viewInventory: "View Inventory"
    },
    register: {
      title: "Quick Registration – Register for FREE in less than 30 seconds",
      subtitle: "Access to over 300,000 Vehicles",
      subtitle2: "No Dealer License Required",
      subtitle3: "Easy Bidding, Buying and Shipping",
      subtitle4: "96% Customer Satisfaction Rate"
    },
    registerForm: {
      title: "Register a New Account for FREE!",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      register: "REGISTER NOW",
      login: "Already have an account? Login",
      success: "Registration Successful!",
      error: "Registration Failed. Please try again.",
      loginSuccess: "Login Successful!",
      loginError: "Login Failed. Please try again.",
      loginButton: "Login",
      registerButton: "Register",
      required: "Indicates required fields",
      emailError: "Please enter a valid email",
      passwordError: "Password must be at least 6 characters",
      confirmPasswordError: "Please confirm your password",
      firstNameError: "First Name is required",
      lastNameError: "Last Name is required",
      phoneError: "Phone number is required",
      phoneNumber: "Phone Number",
      passwordRequired: "Password is required",
      clicking: " By clicking",
      agree: "I agree to AutoBidMaster's ",
      terms: "Terms and Service",
      registerNow: "Register Now",
    },
    serach:{
      sFilter:" Search Filters",
      resetAll : " Reset All",
      select: "Select Vehicles Only",
      buyIt: "Buy It Now",
      copart: "Copart",
      iaai : "IAAI",
      usa : "USA",
      canada : "Canada",
      auction: "Auction",
      make : "Make",
      sMakes: "Search makes...",
      model : "model",
      selectModel : "selectedModel",
      sModel : "Search models...",
      condition : "Condition",
      run : " Run ANd Drive",
      fRepair : "For Repair",
      dismantled : "To Be Dismantled",
      notRun : "Not Run",
      used : "Used",
      unconfirmed : "Unconfirmed",
      engineStart : "Engine Starts",
      enhanced : "Enhanced",
      yrRange : "Year Range",
      odoRange : "Odometer Range",
      engineSize : "Engine Size",
      transmission : "Transmission",
      auto : "Automatic",
      manual : "Manual",
      fuelType : "Fuel Type",
      SfuelType : " Search Fuel Type...",
      cylinders : "Cylinders",
      sCylinders : "Search cylinders...",
      bodyStyle : "Body Style",
      sBodyStyle : "Search Body Style...",
      colors: "Colors",
      sColors : " Search Colors...",
      location : "Location",
      sLocation : "Search Loaction...",
      primary :"Primary Damage",
      sDamages : "Search Damages...",
      seller : "Seller",
      sSeller : "Search sellers...",
      qFilters : "Quick Filters",
      sVehicals : "Select Vehicles Only",
      filters : "Filters",
      buyItNow : "Buy It Now",
      watch : "Watch",
      image : "Image",
      lotInfo: "Lot Info",
      lot : "Lot",
      vehicalInfo: "Vehical Info",
      vehical: "Vehical",
      odometer : "Odometer",
      value : " Est. Retail Value",
      title: "Title",
      damage: "Damage",
      sDamage: "Second Damage",
      status: "Status",
      saleInfo : "Sale Info",
      date : "Date",
      moreInfo: "More Info",


    },

  },
  bg: {
    header: {
      herotitle: "Технологията Smart AI ви помага да намерите най-добрите автомобили на търг на правилната цена—доставени от САЩ и Канада.",
      subtitle: "Изберете от над 300 000+ употребявани, продавани на едро и подлежащи на ремонт автомобили, камиони и SUV за продажба в Copart и IAAI Auto Auctions",
      signIn: "ВХОД",
      dashboard: "Табло",
      myAccount: "Моят акаунт",
      logout: "Изход",
      profile: "Профил",
      all: "Всички",
      searchInput: "Търсене на превозни средства по марка, модел, година, VIN и др.",
      signInAccount: "Влезте в акаунта си",
      emailLogin: "Моля, въведете вашия имейл!",
      passwordLogin: "Моля, въведете вашата парола!",
      forgot: "Забравена парола?",
      agreement: " С натискане на ВХОД вие",
      account : " Нямате акаунт?",
      watchlist: "Наблюдавани",
      damage: "Повреда",
      currentBid: "Текуща оферта",
      saleDate: "Дата на продажба",
      color: "Цвят",
      lotNumber: "Номер на лот",
      remove: "Премахване",
    },
    landing: {
      viewInventory: "Преглед на инвентара"
    },
    register: {
      title: "Бърза регистрация – Регистрирайте се БЕЗПЛАТНО за по-малко от 30 секунди",
      subtitle: "Достъп до над 300 000 превозни средства",
      subtitle2: "Не се изисква лиценз за търговец",
      subtitle3: "Лесно наддаване, купуване и доставка",
      subtitle4: "96% степен на удовлетвореност на клиентите"
    },
    registerForm: {
      title: "Регистрирайте нов акаунт БЕЗПЛАТНО!",
      firstName: "Име",
      lastName: "Фамилия",
      email: "Имейл",
      password: "Парола",
      confirmPassword: "Потвърдете паролата",
      register: "РЕГИСТРИРАЙ СЕ СЕГА",
      login: "Вече имате акаунт? Вход",
      success: "Регистрацията е успешна!",
      error: "Регистрацията не бе успешна. Моля, опитайте отново.",
      loginSuccess: "Влизането е успешно!",
      loginError: "Влизането не бе успешно. Моля, опитайте отново.",
      loginButton: "Вход",
      registerButton: "Регистрация",
      required: "Полетата са задължителни",
      emailError: "Моля, въведете валиден имейл",
      passwordError: "Паролата трябва да бъде поне 6 знака",
      confirmPasswordError: "Моля, потвърдете паролата",
      firstNameError: "Името е задължително",
      lastNameError: "Фамилията е задължителна",
      phoneError: "Телефонният номер е задължителен",
      phoneNumber: "Телефонен номер",
      passwordRequired: "Паролата е задължителна",
      clicking: " С натискане на",
      agree: "Съгласявам се с ",
      terms: "Условията за ползване на AutoBidMaster",
      registerNow: "Регистрирай се сега",
    },
    serach: {
      sFilter: "Филтри за търсене",
      resetAll: "Нулиране на всички",
      select: "Изберете само превозни средства",
      buyIt: "Купи го сега",
      copart: "Copart",
      iaai: "IAAI",
      usa: "САЩ",
      canada: "Канада",
      auction: "Търг",
      make: "Марка",
      sMakes: "Търсене на марки...",
      model: "Модел",
      selectModel: "Избран модел",
      sModel: "Търсене на модели...",
      condition: "Състояние",
      run: "Работи и се движи",
      fRepair: "За ремонт",
      dismantled: "За разглобяване",
      notRun: "Не работи",
      used: "Използван",
      unconfirmed: "Непотвърден",
      engineStart: "Двигателят стартира",
      enhanced: "Подобрен",
      yrRange: "Годишен диапазон",
      odoRange: "Диапазон на километража",
      engineSize: "Размер на двигателя",
      transmission: "Трансмисия",
      auto: "Автоматична",
      manual: "Ръчна",
      fuelType: "Тип гориво",
      SfuelType: "Търсене на тип гориво...",
      cylinders: "Цилиндри",
      sCylinders: "Търсене на цилиндри...",
      bodyStyle: "Тип каросерия",
      sBodyStyle: "Търсене на тип каросерия...",
      colors: "Цветове",
      sColors: "Търсене на цветове...",
      location: "Местоположение",
      sLocation: "Търсене на местоположение...",
      primary: "Основна повреда",
      sDamages: "Търсене на повреди...",
      seller: "Продавач",
      sSeller: "Търсене на продавачи...",
      qFilters: "Бързи филтри",
      sVehicals: "Изберете само превозни средства",
      filters: "Филтри",
      buyItNow: "Купи го сега",
      watch: "Гледай",
      image: "Изображение",
      lotInfo: "Информация за лот",
      lot: "Лот",
    }
  }
};
// Add fallback translations
i18n.addResourceBundle('en', 'translation', fallbackTranslations.en, true, true);
i18n.addResourceBundle('bg', 'translation', fallbackTranslations.bg, true, true);

export default i18n;