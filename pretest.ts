const fs = require('fs');
const path = require('path');

const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

if (tsconfig.compilerOptions) {
  tsconfig.compilerOptions.jsx = 'react-jsx';
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log('✔ tsconfig atualizado para "jsx": "react-jsx"');
} else {
  console.error('❌ Não encontrado "compilerOptions" no tsconfig.json');
  process.exit(1);
}