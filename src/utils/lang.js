const fs = require('fs');
const path = require('path');
const trim = require('lodash.trim');
const Excel = require('exceljs');

const FILE_PATH = "./src/utils/langs.xlsx";

const translate = () => {
  const langFile = new Excel.Workbook();
  langFile.xlsx.readFile(FILE_PATH).then(() => {
    const sheet = langFile.worksheets[0];

    // get key
    let keys = sheet
      .getColumn("A")
      .values.filter((v, i) => i > 1)
      .map((key) => trim(key));

    // export langType.ts
    let langTypeData = [];
    keys.forEach((key, index) => {
      langTypeData.push(`${key} = '${key}',`);
    })
    let langType =  `${langTypeData.join('\n')}`;
    console.log(`Exported to lang.ts`);
    fs.writeFileSync(path.join(__dirname, "./langType.ts"), langType);

    // export languages
    let languages = [
      {
        lang: "en",
        translation: {},
      },
      {
        lang: "ja",
        translation: {},
      },
    ];
    for(let r = 2; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r);
      languages[0].translation[row.getCell(1).value] = row.getCell(2).value;
      languages[1].translation[row.getCell(1).value] = row.getCell(3).value;
    }
    languages.forEach((language, index) => {
      fs.writeFileSync(
        path.join(__dirname, `locales/${language.lang}/${language.lang}.json`),
        JSON.stringify(language.translation)
      );
    });
  })
}

translate()