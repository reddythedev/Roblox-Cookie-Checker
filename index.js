const fs = require('fs');
const request = require('request');

const cookies = fs.readFileSync('cookies.txt', 'utf8').split('\n');
let currentCookieIndex = 0;
let invalid = 0;

function removeLinesWithKeyword(filename, keyword) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split('\n');
    const filteredLines = lines.filter(line => !line.includes(keyword));
    const updatedFileData = filteredLines.join('\n');
    fs.writeFileSync(filename, updatedFileData);
}

const checkIfValid = async () => {
    for (const cookie of cookies) {
        currentCookieIndex = (currentCookieIndex + 1) % cookies.length;
        const url = `https://accountsettings.roblox.com/v1/email`;
        const options = {
          url: url,
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            'cookie': `.ROBLOSECURITY=${cookie.trim()}`
          }
        };

        request(options, (error, response) => {
            if (response.statusCode == 403 || response.statusCode == 401) {
                invalid++;
                console.log(`Invalid account has been found and removed from the cookie list! Total invalid accounts: ${invalid}`);
                removeLinesWithKeyword('cookies.txt', cookie);
            } else if (error) {
                console.log(`There has been an error: ${error}`);
            } else {
                console.log(`Account is valid!`);
            }
        });
    }
};

checkIfValid();