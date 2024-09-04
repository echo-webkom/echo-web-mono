"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

const languages = [
  { label: "Norsk", value: "no", src: "https://flagcdn.com/h60/no.png" },
  { label: "English", value: "en", src: "https://flagcdn.com/h60/us.png" },
];

const includedLanguages = languages.map((lang) => lang.value).join(",");

function googleTranslateElementInit() {
  new (window as any).google.translate.TranslateElement(
    {
      pageLanguage: "no",
      includedLanguages,
    },
    "google_translate_element",
  );
}

export function GoogleTranslate() {
  const [isEnglish, setIsEnglish] = useState(false);

  useEffect(() => {
    (window as any).googleTranslateElementInit = googleTranslateElementInit;

    // Inject custom styles to hide the default Google Translate widget
    const style = document.createElement("style");
    style.innerHTML = `
      body { position: static !important; top: 0px !important; }
      iframe.skiptranslate { display: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleLanguage = () => {
    setIsEnglish((prev) => !prev);
    const element = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (element) {
      element.value = isEnglish ? "no" : "en";
      element.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div className="relative inline-block">
      <div id="google_translate_element" className="invisible absolute h-0 w-0"></div>
      <button onClick={toggleLanguage} className="rounded border p-2">
        {isEnglish ? "Switch to Norwegian" : "Translate to English"}
      </button>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
}
