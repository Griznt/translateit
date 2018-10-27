const { Parser } = require("json2csv");

module.exports = class CSV {
  saveToCSV(arrayofObjects) {
    try {
      const fields = Object.keys(arrayofObjects[0]);
      const parser = new Parser({ fields });
      const csvFile = parser.parse(arrayofObjects);

      return `\uFEFF${csvFile}`;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};
