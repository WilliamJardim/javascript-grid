class WGrid{

    constructor( gridConfig ){
        this.gridConfig    = gridConfig;
        this.dados         = this.gridConfig.dados;
        this.idElementoPai = this.gridConfig.elementoPai; 
        this.elementoPai   = document.getElementById( this.idElementoPai ); 
        this.tituloGrid    = this.gridConfig.titulo;
        this.nomesColunas  = this.gridConfig.colunas;
        this.statusColunas = this.gridConfig.status;

        //Adiciona uma classe para aplicar estilo padrão
        document.getElementById( this.idElementoPai ).setAttribute('class', document.getElementById( this.idElementoPai ).getAttribute('class')||'' + ' wgrid');

        if(!this.elementoPai){
            throw 'Voce precisa definir onde a grid vai ficar!. Defina "elementoPai" ';
        }

        this.render();
    }

    /**
    * Cria uma linha 
    */
    CriarLinha( dados, classeLinha='linha-grid' ) {
        const elementoPai = this.elementoPai;
    
        let htmlColunas = ``;

        /**
        * Cria as DIVs de todas os valores dentro de 'dados'(isso é, os dados da linha atual)
        */
        for( let i = 0 ; i < dados.length ; i++ )
        {
            const valorColunaAtual = dados[i];
            const nomeColunaAtual  = this.getNomeColuna( i );

            //Se a coluna está visivel ou se, não existe nenhuma configuração para a coluna
            if( classeLinha == 'linha-detalhes' || (!this.getStatusColuna( nomeColunaAtual ) || this.getStatusColuna( nomeColunaAtual ).visible == true) )
            {
                htmlColunas += `
                    <div class='elemento-linha-grid'>
                        ${ valorColunaAtual }
                    </div>
                `;
            }
        }

        /**
        * Cria a linha
        */
        elementoPai.innerHTML += `
            <div class='${classeLinha} linha-grid '>
                ${ htmlColunas }
            </div>
        `;
    }

    /**
    * Obtem o nome da coluna 
    */
    getNomeColuna( index ){
        return this.nomesColunas[index];
    }

    /**
    * Obtem as configurações da coluna 
    */
    getStatusColuna( nomeColuna ){
        return (this.statusColunas || {})[ nomeColuna ] || null;
    }

    /**
    * Permite renomear todas as colunas
    * @param {String} nomeColunas 
    */
    renomearColunas(nomeColunas){
        this.nomesColunas = nomeColunas;
        this.render();
    }

    /**
    * Permite renomear uma coluna
    * @param {String} colunaAntiga 
    * @param {String} novoNome 
    */
    renomearColuna( colunaAntiga, novoNome ){
        this.nomesColunas = this.nomesColunas.map(( nomeColunaAtual )=>{ return nomeColunaAtual == colunaAntiga ? novoNome : nomeColunaAtual });
        this.render();
    }

    /**
    * Adiciona uma nova amostra
    * @param {String} colunaAntiga 
    * @param {String} novoNome 
    */
    adicionarAmostra( dadosAmostra ){
        this.dados.push(dadosAmostra);
        this.render();
    }

    /** Desenha a grid no elemento pai */
    render() {
        /**
        * Reseta o que ja foi desenhado anteriormente
        */
        this.elementoPai.innerHTML = ``;

        //Adiciona um titulo
        this.CriarLinha([this.tituloGrid], 'linha-detalhes');

        /**
        * Cria o cabeçalho 
        */
        const dadosCabecalho = this.nomesColunas || this.dados.at(0);
        this.CriarLinha(dadosCabecalho);

        /**
        * Cria as outras linhas 
        * 
        * NOTA: Aqui usei 'this.nomesColunas == undefined ? 1 : 0', por que, se voce passar o nome das colunas via propriedade, então ele precisa começar a pegar as amostras a partir do indice zero 
        */
        const amostras = this.dados.slice( this.nomesColunas == undefined ? 1 : 0, this.dados.length);
        const qtdeAmostras = amostras.length;

        for( let i = 0 ; i < qtdeAmostras; i++ )
        {   
            const indice  = i;
            const amostra = amostras[indice];
        
            this.CriarLinha(amostra, 'linha-amostra-grid');
        }
    }
}