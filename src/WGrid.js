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
    CriarLinha( dados, classeLinha='linha-grid', idLinha='' ) {
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
                    <div class='elemento-linha-grid' name='coluna-${i}-linha${idLinha}-grid-${this.idElementoPai}'>
                        ${ valorColunaAtual }
                    </div>
                `;
            }
        }

        /**
        * Cria a linha
        */
        elementoPai.innerHTML += `
            <div class='${classeLinha} linha-grid' name='linha-${idLinha}-grid-${this.idElementoPai}'>
                ${ htmlColunas }
            </div>
        `;
    }

    /**
    * Obtém o elemento HTML de uma linha 
    */
    getElementoLinha( numeroLinha ){
        return document.getElementsByName(`linha-${numeroLinha}-grid-${this.idElementoPai}`)[0];
    }

    /**
    * Obtém o elemento HTML de uma coluna de uma linha
    */
    getElementoColuna( numeroLinha, numeroColuna ){
        return document.getElementsByName(`coluna-${numeroColuna}-linha${numeroLinha}-grid-${this.idElementoPai}`)[0];
    }

    /**
    * Obtém o valor e o elemento HTML de uma coluna de uma linha
    */
    getPosicao( numeroLinha, numeroColuna ){
        if(!this.dados[numeroLinha]){
            throw Error(`A linha ${numeroLinha} não existe!`);
        }
        if(!this.dados[numeroLinha][numeroColuna]){
            throw Error(`A coluna ${numeroColuna} não existe!`);
        }

        return {
            valor: this.dados[numeroLinha][numeroColuna],
            linha: numeroLinha,
            coluna: numeroColuna,
            grid: this,
            elemento: this.getElementoColuna( numeroLinha, numeroColuna )
        };
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
        if(this.statusColunas && !this.statusColunas[nomeColuna]){
            throw Error(`A coluna '${nomeColuna}' não existe!`);
        }

        return (this.statusColunas || {})[ nomeColuna ] || null;
    }

    /**
    * Esconder uma coluna 
    */
    ocultarColuna( nomeColuna ){
        this.getStatusColuna( nomeColuna ).visible = false;
        this.render();
    }

    /**
    * Esconder uma coluna 
    */
    esconderColuna = this.ocultarColuna;

    /**
    * Esconde varias colunas
    */
    ocultarColunas( nomeColunas ){
        nomeColunas.forEach((nome)=>{ this.ocultarColuna(nome) });
    }

    /**
    * Esconde varias colunas
    */
    esconderColunas = this.ocultarColunas;

    /**
    * Mostrar uma coluna 
    */
    exibirColuna( nomeColuna ){
        if(!nomeColuna){
            throw Error('Voce precisa passar a coluna!');
        }

        this.getStatusColuna( nomeColuna ).visible = true;
        this.render();
    }

    /**
    * Mostrar uma coluna 
    */
    mostrarColuna = this.exibirColuna;

    /**
    * Mostrar uma coluna 
    */
    exibirColunas( nomeColunas ){
        nomeColunas.forEach((nome)=>{ this.mostrarColuna(nome) });
    }

    /**
    * Mostrar uma coluna 
    */
    mostrarColunas = this.exibirColunas;

    /**
    * Permite renomear todas as colunas
    * @param {String} nomeColunas 
    */
    renomearColunas(nomeColunas){
        const nomesAtuais = this.nomesColunas;
        this.nomesColunas = nomeColunas;

        if( this.statusColunas != undefined ){
            this.nomesColunas.forEach((novoNome, indice)=>{
                const colunaAntiga = nomesAtuais[ indice ];

                this.statusColunas[novoNome] = {...this.statusColunas[colunaAntiga]};
                delete this.statusColunas[colunaAntiga]
            })
        }

        this.render();
    }

    /**
    * Permite renomear uma coluna
    * @param {String} colunaAntiga 
    * @param {String} novoNome 
    */
    renomearColuna( colunaAntiga, novoNome ){
        this.nomesColunas = this.nomesColunas.map(( nomeColunaAtual )=>{ return nomeColunaAtual == colunaAntiga ? novoNome : nomeColunaAtual });

        if( this.statusColunas != undefined ){
            this.statusColunas[novoNome] = {...this.statusColunas[colunaAntiga]};
            delete this.statusColunas[colunaAntiga]
        }

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
        this.CriarLinha(dadosCabecalho, '', '_inicio');

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
        
            this.CriarLinha(amostra, 'linha-amostra-grid', indice);
        }
    }
}