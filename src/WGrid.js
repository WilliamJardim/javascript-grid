class WGrid{

    constructor( gridConfig ){
        this.gridConfig    = gridConfig;
        this.dados         = this.gridConfig.dados;
        this.idElementoPai = this.gridConfig.elementoPai; 
        this.elementoPai   = document.getElementById( this.idElementoPai ); 

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

            htmlColunas += `
                <div class='elemento-linha-grid'>
                    ${ valorColunaAtual }
                </div>
            `;
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

    /** Desenha a grid no elemento pai */
    render() {
        /**
        * Reseta o que ja foi desenhado anteriormente
        */
        this.elementoPai.innerHTML = '';

        /**
        * Cria o cabeçalho 
        */
        const dadosCabecalho = this.dados.at(0);
        this.CriarLinha(dadosCabecalho);

        /**
        * Cria as outras linhas 
        */
        const amostras = this.dados.slice(1, this.dados.length);
        const qtdeAmostras = amostras.length;

        for( let i = 0 ; i < qtdeAmostras; i++ )
        {   
            const indice  = i;
            const amostra = amostras[indice];
        
            this.CriarLinha(amostra, 'linha-amostra-grid');
        }
    }
}