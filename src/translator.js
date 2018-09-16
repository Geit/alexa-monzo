const fs = require('fs');
const path = require('path');

const format = require('string-template');

const defaultLang = 'en-gb';
const translations = {
  'en-gb': require('./translations/en-gb.js')
};

function getPhrase(lang = 'en-gb', key) {
  if (!translations[lang]) translations[lang] = translations[defaultLang];

  if (!translations[lang][key]) {
    if (!translations[defaultLang][key]) throw new Error(`Translation Key doesn't exist! (${key})`);
    translations[lang][key] = translations[defaultLang][key];
  }

  return translations[lang][key];
}

export default function random() {
  return Math.random();
}

export function translate(lang, key, args) {
  const phrase = getPhrase(lang, key);
  if (phrase.constructor === Array) return format(phrase[Math.floor(random() * phrase.length)], args);
  else return format(phrase, args);
}
