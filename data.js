const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.json');

function readData() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ users: [], teams: [], accomplishments: [] }, null, 2));
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Invalid or empty file: reinitialize
    const initial = { users: [], teams: [], accomplishments: [] };
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2));
    return initial;
  }
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData
};
