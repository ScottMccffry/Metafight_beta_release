const fs = require('fs');
const path = require('path');

// Update these paths according to your project structure
const ABI_SOURCE_PATH = path.join(__dirname, '../../blockchain/artifacts/contracts/MetaFight.sol/MetaFight.json');
const ABI_DESTINATION_PATH = path.join(__dirname, '../src/contracts/MetaFight.json');
fs.copyFile(ABI_SOURCE_PATH, ABI_DESTINATION_PATH, (err) => {
    if (err) throw err;
    console.log('MetaFight ABI was copied successfully');
});
