import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

// Define the possible languages
export type LanguageType = 'English' | 'Chinese' | 'Korean' | 'Japanese' | 'Vietnamese';

// Define the context interface
interface LanguageContextType {
  selectedLanguage: LanguageType;
  setSelectedLanguage: (language: LanguageType) => void;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  selectedLanguage: 'English',
  setSelectedLanguage: () => {},
});

// Language details for UI display
const languageDetails = {
  English: {
    flag: "🇺🇸", 
    welcomeMessage: "Welcome to BNWSwap!",
    label: "English (US)"
  },
  Chinese: {
    flag: "🇨🇳",
    welcomeMessage: "欢迎来到 BNWSwap!",
    label: "中文"
  },
  Korean: {
    flag: "🇰🇷",
    welcomeMessage: "BNWSwap에 오신 것을 환영합니다!",
    label: "한국어"
  },
  Japanese: {
    flag: "🇯🇵",
    welcomeMessage: "BNWSwapへようこそ!",
    label: "日本語"
  },
  Vietnamese: {
    flag: "🇻🇳",
    welcomeMessage: "Chào mừng đến với BNWSwap!",
    label: "Tiếng Việt"
  }
};

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('English');

  // Handle language selection
  const handleLanguageSelect = (language: LanguageType) => {
    if (language !== selectedLanguage) {
      setSelectedLanguage(language);
      
      // Show a toast notification when language is changed
      toast({
        title: `Language Changed`,
        description: (
          <div className="flex items-start">
            <span className="mr-2 text-lg">{languageDetails[language].flag}</span>
            <div>
              <p className="font-medium">{languageDetails[language].welcomeMessage}</p>
              <p className="text-sm text-gray-400">The interface has been translated to {languageDetails[language].label}</p>
            </div>
          </div>
        ),
        duration: 3000
      });
      
      console.log(`Switched to ${language} language`);
    }
  };

  const value = {
    selectedLanguage,
    setSelectedLanguage: handleLanguageSelect,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);