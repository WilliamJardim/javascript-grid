/**
* Uma rotina automatizada para compilar, empacotar, e testar o empacotamento 
*/
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Caminho para o arquivo compile.bat
const batFilePath = path.join(__dirname, './repository-scripts', 'compile.bat');

// Função para rodar o arquivo compile.bat
function runBatchFile() {
  exec(`"${batFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar compile.bat: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Erro no script compile.bat: ${stderr}`);
      return;
    }

    console.log(`Saída do compile.bat:\n${stdout}`);
    console.log('compile.bat executado com sucesso!');

    // Gerar o pack
    require('./pack.js');

    // REMOVE OS IMPORT E EXPORTS DO BUNDLE UNIFICADO

    // Função para limpar os 'export' e 'import' do código
    function removeExportsImports(content) {
      // Remove "export default" e "export" do início das linhas
      content = String(content).replace(/^export\s+default\s+/gm, '');
      content = String(content).replace(/^export\s+/gm, '');
      
      // Remove as linhas que contém "import"
      content = String(content).replace(/^import\s+.*;/gm, '');

      return content;
    }

    // Função para sobrescrever o arquivo bundle.js com o conteúdo processado
    function overwriteBundle(content, filePath = 'bundle.js') {
      const cleanedContent = removeExportsImports(content);
      fs.writeFileSync(filePath, cleanedContent);
      console.log(`Arquivo ${filePath} sobrescrito com sucesso!`);
    }

    // Chama a função para sobrescrever o arquivo bundle.js
    const bundlePath = path.join('../', 'build', 'bundle.js');
    overwriteBundle( fs.readFileSync(bundlePath), path.join('../', 'build', 'WGrid.js') );

    // Checar o pack
    require('./checkpack.js');

    console.log('Processamento do build/bundle.js finalizado e arquivo pronto para uso em app web');
  });

  }

// Chama a função
runBatchFile();
