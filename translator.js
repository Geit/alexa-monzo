const fs = require('fs');
const path = require('path');
const format = require('string-template');

const defaultLang = 'en-gb';
const translations = {};

fs.readdirSync('translations').forEach((file) => {
  const lang = file.replace('.js', '').toLowerCase();
  translations[lang] = require(`./${path.join('translations', file)}`);
});

function getPhrase (lang, key) {
  if (!lang)
    lang = 'en-gb';
  else
    lang = lang.toLowerCase();

  if (!translations[lang])
    translations[lang] = translations[defaultLang];

  if (!translations[lang][key]) {
    if (!translations[defaultLang][key])
      throw new Error(`Translation Key doesn't exist! (${key})`);
    translations[lang][key] = translations[defaultLang][key];
  }

  return translations[lang][key];
}

module.exports.random = function () {
  return Math.random();
};

module.exports.translate = function (lang, key, args) {
  const phrase = getPhrase(lang, key);
  if (phrase.constructor === Array)
    return format(phrase[Math.floor(module.exports.random() * phrase.length)], args);
  else
    return format(phrase, args);
};
