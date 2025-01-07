/**
 * Junta todos os arquivos JS compilados em um único arquivo dist/bundle.js,
 * varrendo recursivamente todos os subdiretórios dentro de dist/src/.
 */
const fs   = require('fs');
const path = require('path');

// Diretório onde estão os arquivos .js que serão concatenados
const srcDir = [path.join(__dirname, '../libs/'), 
                path.join(__dirname, '../src/')];
                
const distDir = path.join(__dirname, '../build/');

// Arquivo de saída final
const outputFile = path.join(distDir, 'bundle.js');

// Função recursiva para varrer diretórios e subdiretórios
function getAllJSFiles(dir) {
  let jsFiles = [];
  
  // Lê o conteúdo do diretório atual
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);
    
    // Se for um diretório, chama a função recursivamente
    if (fileStat.isDirectory()) {
      jsFiles = jsFiles.concat(getAllJSFiles(filePath));
    } else if (path.extname(file) === '.js') {
      // Se for um arquivo .js, adiciona à lista
      jsFiles.push(filePath);
    }
  });
  
  return jsFiles;
}

// Função que une todos os arquivos .js em um só
function bundleJSFiles() {
  // Verifica se o diretório build existe
  if (!fs.existsSync(srcDir[0]) || !fs.existsSync(srcDir[1])) {
    console.error('Diretório src não encontrado!');
    return;
  }

  // Se o arquivo bundle.js já existe, remove-o para evitar duplicidade de conteúdo
  if (fs.existsSync(outputFile)) {
    console.log(`Removendo o arquivo existente: ${outputFile}`);
    fs.unlinkSync(outputFile);
  }

  // Obtém todos os arquivos .js de src e subdiretórios
  const jsFiles = srcDir.map(( diretorioAtual )=>{ return getAllJSFiles(diretorioAtual); })
                        .flat();

  console.log(jsFiles)

  if (jsFiles.length === 0) {
    console.error('Nenhum arquivo .js encontrado no diretório src.');
    return;
  }

  // Variável para armazenar o conteúdo combinado
  let combinedContent = '';

  // Itera sobre cada arquivo .js, lê o conteúdo e concatena
  jsFiles.forEach(file => {
    const fileContent = fs.readFileSync(file, 'utf8');
    combinedContent += `\n// Conteúdo do arquivo: ${file}\n${fileContent}\n`;
  });

  // Escreve o conteúdo concatenado no bundle.js
  fs.writeFileSync(outputFile, combinedContent, 'utf8');
  console.log(`Arquivos combinados em ${outputFile}`);
}

// Chama a função para combinar os arquivos
bundleJSFiles();
