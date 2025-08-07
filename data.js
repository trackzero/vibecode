const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.json');

function readData() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ users: [], teams: [], accomplishments: [] }, null, 2));
  }
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData
};
