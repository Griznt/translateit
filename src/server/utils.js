module.exports = function getSourceLang(text, sourceLang) {
  return new Set(
    text.filter(
      lang => lang && lang !== "" && lang !== sourceLang
    )
  );
};
