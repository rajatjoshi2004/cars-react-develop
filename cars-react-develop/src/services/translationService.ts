import { BgColorsOutlined } from '@ant-design/icons';
import axios from 'axios';

// Translation service to handle API calls
export interface Translation {
  [key: string]: string;
}

// Base URL for the translation API
// In a real app, this would be your actual API endpoint
const API_BASE_URL = 'https://api.example.com/translations';

// Mock API for demo purposes
const MOCK_TRANSLATIONS: Record<string, Translation> = {
  en: {
    viewInventory: "View Inventory"
    
  },
  bg:{
    viewInventory: "Преглед на инвент"
  }

};

// Function to fetch translations from the API
export const fetchTranslations = async (language: string): Promise<Translation> => {
  try {
    // In a real app, this would be an actual API call
    // const response = await axios.get(`${API_BASE_URL}/${language}`);
    // return response.data;
    
    // For demo purposes, we'll use mock data
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock translations or fallback to English
    return MOCK_TRANSLATIONS[language] || MOCK_TRANSLATIONS.en;
  } catch (error) {
    console.error('Error fetching translations:', error);
    // Return English translations as fallback
    return MOCK_TRANSLATIONS.en;
  }
};