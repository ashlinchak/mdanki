const ankiExport = jest.genMockFromModule('anki-apkg-export');

let saveReturnValue = null;

function __setSaveReturnValue(value) {
  saveReturnValue = value;
}
ankiExport.default.mockImplementation(() => ({
  addCard : jest.fn(),
  addMedia: jest.fn(),
  save    : jest.fn(() => saveReturnValue),
}));

ankiExport.__setSaveReturnValue = __setSaveReturnValue;

module.exports = ankiExport;
