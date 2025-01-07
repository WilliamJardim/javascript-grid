const path = require('path');
const fs = require('fs');

// Caminho do arquivo bundle.js
const bundlePath = path.join(__dirname, '../build/bundle.js');

// Função que tenta executar o bundle.js
function checkBundleExecution() {
  // Verifica se o arquivo bundle.js existe
  if (!fs.existsSync(bundlePath)) {
    console.error('O arquivo bundle.js não foi encontrado na pasta build.');
    return;
  }

  try {
    // Tenta executar o arquivo bundle.js
    require(bundlePath);
    console.log('Execução do bundle.js: OK');
  } catch (error) {
    // Se der erro, exibe a mensagem de erro
    console.error('Erro na execução do bundle.js:', error.message);
  }
}

// Chama a função
checkBundleExecution();
