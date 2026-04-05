'use client'

import { useEffect, useState } from 'react'
import { Languages, ChevronDown } from 'lucide-react'

export function LanguageTranslator() {
  const [currentLang, setCurrentLang] = useState('en')

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 1. Inject the Google Translate Script if not present
    const scriptId = 'google-translate-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
      
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,hi,pa', autoDisplay: false },
          'google_translate_element'
        )
      }
    }
    
    // 2. Read existing google translate cookie to set initial active language
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match && match[2]) {
       const lang = match[2].split('/').pop();
       if (lang) setCurrentLang(lang);
    }
  }, [])

  const switchLanguage = (lang: string) => {
    setCurrentLang(lang)
    setIsOpen(false)
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (select) {
      select.value = lang
      select.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  // Prevent generic google translate from rendering
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      body { top: 0 !important; }
      .goog-te-banner-frame { display: none !important; }
      .skiptranslate.goog-te-gadget { display: none !important; }
      #goog-gt-tt { display: none !important; }
      .goog-tooltip { display: none !important; }
      .goog-tooltip:hover { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
    `
    document.head.appendChild(style)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[99999]">
      {/* Hidden standard widget */}
      <div id="google_translate_element" className="hidden"></div>
      
      {/* Backdrop for click-away on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1] bg-transparent" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Custom native styling UI */}
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-indigo-100 px-3 py-2 flex items-center gap-2 hover:shadow-xl hover:bg-white transition-all cursor-pointer select-none active:scale-95"
        >
          <Languages className="w-4 h-4 text-indigo-600" />
          <span className="text-[11px] font-black uppercase text-indigo-600 tracking-wider">
            {currentLang === 'en' ? 'English' : currentLang === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
          </span>
          <ChevronDown className={`w-3 h-3 text-indigo-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
        </button>
        
        {/* Dropdown Menu */}
        <div className={`
          absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 
          transition-all origin-top-right transform overflow-hidden flex flex-col
          ${isOpen ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 -translate-y-2 pointer-events-none'}
        `}>
          <button 
            onClick={() => switchLanguage('en')} 
            className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${currentLang === 'en' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            English
          </button>
          <button 
            onClick={() => switchLanguage('hi')} 
            className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${currentLang === 'hi' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Hindi <span className="text-[10px] text-gray-400 ml-1">(हिंदी)</span>
          </button>
          <button 
            onClick={() => switchLanguage('pa')} 
            className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${currentLang === 'pa' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Punjabi <span className="text-[10px] text-gray-400 ml-1">(ਪੰਜਾਬੀ)</span>
          </button>
        </div>
      </div>
    </div>

  )
}

declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}
