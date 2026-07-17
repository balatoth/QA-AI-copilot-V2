const fs = require('fs');

const output = {
  status: 'READY',
  message: 'Application discovery script loaded successfully.',
  generatedAt: new Date().toISOString()
};

fs.writeFileSync(
  'application-discovery-script-test.json',
  JSON.stringify(output, null, 2)
);

console.log(JSON.stringify(output, null, 2));
