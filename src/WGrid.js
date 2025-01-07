class WGrid{

    constructor( gridConfig ){
        // Verifica se a instação contém os estilo CSS
        if( ![...document.querySelectorAll('link[rel="stylesheet"]')].some( (link)=>{ return link.href.includes("WGrid.css") } ) ){
            console.warn(`Estilos CSS principal não carregados!. Verifique os arquivos no HTML`);
        }

        this.gridConfig    = gridConfig;
        this.dados         = this.gridConfig.dados;
        this.idElementoPai = this.gridConfig.elementoPai; 
        this.elementoPai   = document.getElementById( this.idElementoPai ); 
        this.tituloGrid    = this.gridConfig.titulo;
        this.nomesColunas  = this.gridConfig.colunas;
        this.statusColunas = this.gridConfig.status;
        this.callbacks     = this.gridConfig.callbacks || {};
        this.copyOnClick   = this.gridConfig.copyOnClick || false;
        this.selectOnClick = this.gridConfig.selectOnClick || false;
        this.searchBar     = this.gridConfig.searchBar;
        if( this.searchBar == undefined ){
            this.searchBar = true;
        }

        this.buttons       = this.gridConfig.buttons;
        if( this.buttons == undefined ){
            this.buttons = true;
        }

        this.pesquisando   = '';

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
            const statusColuna     = this.getStatusColuna( nomeColunaAtual );

            /**
            * Se a coluna está visivel ou se, não existe nenhuma configuração para a coluna
            */
            if( classeLinha == 'linha-detalhes' || (!statusColuna || statusColuna.visible == true) )
            {
                htmlColunas += `
                    <div class='elemento-linha-grid' name='coluna-${i}-linha${idLinha}-grid-${this.idElementoPai}'>
                        ${ 
                            //idLinha != '_inicio' significa que ele vai ignorar o cabeçalho
                            (statusColuna.editable != undefined && statusColuna.editable != false && classeLinha != 'linha-detalhes' && idLinha != '_inicio') 
                                                          //Se for editavel
                                                          ? `<input id='input-coluna${i}-linha${idLinha}-grid-${this.idElementoPai}' 
                                                                    value=${valorColunaAtual}
                                                                    class='input-coluna-editavel'
                                                                    _linha=${idLinha}
                                                                    _coluna=${i}
                                                                    _grid=${this.idElementoPai}
                                                             />`

                                                          //Se não for editavel
                                                          : valorColunaAtual 
                        }
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
    * Obtem o indice da coluna 
    */
    getIndiceCampo( nome ){
        return this.nomesColunas.indexOf(nome);
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

        //Se existir o callback onEsconderColuna
        if( this.callbacks.onEsconderColuna ){
            this.callbacks.onEsconderColuna.bind(this)(this, nomeColuna);
        }

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

        //Se existir o callback onExibirColuna
        if( this.callbacks.onExibirColuna ){
            this.callbacks.onExibirColuna.bind(this)(this, nomeColuna);
        }

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

        //Antes de renomear as colunas
        if( this.callbacks.beforeRenomearColunas ){
            this.callbacks.beforeRenomearColunas.bind(this)(this, nomesAtuais, nomeColunas);
        }

        if( this.statusColunas != undefined ){
            this.nomesColunas.forEach((novoNome, indice)=>{
                const colunaAntiga = nomesAtuais[ indice ];

                this.statusColunas[novoNome] = {...this.statusColunas[colunaAntiga]};
                delete this.statusColunas[colunaAntiga]
            })
        }

        //Depois de renomear as colunas
        if( this.callbacks.afterRenomearColunas ){
            this.callbacks.afterRenomearColunas.bind(this)(this, nomesAtuais, nomeColunas);
        }

        this.render();
    }

    /**
    * Permite renomear uma coluna
    * @param {String} colunaAntiga 
    * @param {String} novoNome 
    */
    renomearColuna( colunaAntiga, novoNome ){
        //Antes de renomear a coluna
        if( this.callbacks.beforeRenomearColuna ){
            this.callbacks.beforeRenomearColuna.bind(this)( this, colunaAntiga, novoNome );
        }

        this.nomesColunas = this.nomesColunas.map(( nomeColunaAtual )=>{ return nomeColunaAtual == colunaAntiga ? novoNome : nomeColunaAtual });

        if( this.statusColunas != undefined ){
            this.statusColunas[novoNome] = {...this.statusColunas[colunaAntiga]};
            delete this.statusColunas[colunaAntiga]
        }

        //Depois que renomear a coluna
        if( this.callbacks.afterRenomearColuna ){
            this.callbacks.afterRenomearColuna.bind(this)( this, colunaAntiga, novoNome );
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

    /**
    * edita o valor de uma coluna de uma amostra
    */
    setColunaAmostra( numAmostra, numColuna, novoValor ){
        this.dados[ numAmostra ][ (typeof numColuna == 'number' ? numColuna : typeof numColuna == 'string' ? this.getIndiceCampo(numColuna) : null) ] = novoValor;
    }

    /**
    * Verifica se o critério de busca foi atingido para uma amostra
    * @param {String} strBusca 
    * @param {Array} dadosAmostra 
    */
    _criteriosBusca(strBusca, dadosAmostra){
        return dadosAmostra.map(function(caracteristica){
            return String(caracteristica).toLowerCase().indexOf( String(strBusca).toLowerCase() ) != -1 ? true : false

        }).some((resultadoCondicao)=>{ return resultadoCondicao == true }) == true;
    }

    /** Desenha a grid no elemento pai */
    render() {
        //Roda o callback beforeRender
        if( this.callbacks.beforeRender ){
            this.callbacks.beforeRender.bind(this)( this );
        }

        /**
        * Reseta o que ja foi desenhado anteriormente
        */
        this.elementoPai.innerHTML = ``;

        if( this.tituloGrid != undefined )
        {
            //Adiciona um titulo
            this.CriarLinha([this.tituloGrid], 'linha-detalhes');
        }

        if( this.searchBar ){
            //Adiciona um toolbar para pesquisa
            this.CriarLinha([], 'linha-pesquisa');
        }

        if( this.buttons == true || typeof this.buttons == 'object' ){
            //Adiciona um toolbar para botões
            this.CriarLinha([], 'linha-toolbar');
        }

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
        const contexto = this;

        for( let i = 0 ; i < qtdeAmostras; i++ )
        {   
            const indice  = i;
            const amostra = amostras[indice];
        
            //Exibe a amostra SE
            if( 
                //Se não estamos filtrando nada
                !contexto.pesquisando ||

                //Se o usuario estiver pesquisando E o critério for atendido
                (contexto.pesquisando != null && contexto._criteriosBusca(contexto.pesquisando, amostra) == true) 
            ){
                this.CriarLinha(amostra, 'linha-amostra-grid', indice);
            }
        }

        /**
        * Adicionar eventos nas colunas da linhas
        */
        for( let i = 0 ; i < qtdeAmostras ; i++ )
        {
            /**
            * Adicionar eventos na linha 
            */
            const idLinha = i;
            if(document.getElementsByName(`linha-${idLinha}-grid-${contexto.idElementoPai}`)[0])
            {
                document.getElementsByName(`linha-${idLinha}-grid-${contexto.idElementoPai}`)[0].onclick = function(evento){
                    if( contexto.callbacks[ 'onClickLinha' ] ){
                        contexto.callbacks[ 'onClickLinha' ].bind( contexto )( idLinha, evento.target, contexto )
                    }
                }
            
                document.getElementsByName(`linha-${idLinha}-grid-${contexto.idElementoPai}`)[0].addEventListener('mousedown', function(evento){
                    if( contexto.callbacks[ 'onLeftClickLinha' ] ){
                        if( evento.button == 0 ){ contexto.callbacks[ 'onLeftClickLinha' ].bind( contexto )( idLinha, evento.target, contexto ) };
                    }

                    if( contexto.callbacks[ 'onMiddleClickLinha' ] ){
                        if( evento.button == 1 ){ contexto.callbacks[ 'onMiddleClickLinha' ].bind( contexto )( idLinha, evento.target, contexto ) };
                    }

                    if( contexto.callbacks[ 'onRightClickLinha' ] ){
                        if( evento.button == 2 ){ contexto.callbacks[ 'onRightClickLinha' ].bind( contexto )( idLinha, evento.target, contexto ) };
                    }
                });
            }


            for(let e = 0 ; e < this.dados[0].length ; e++)
            {
                const idColuna = e;

                if(document.getElementsByName(`coluna-${idColuna}-linha${i}-grid-${contexto.idElementoPai}`)[0])
                {
                    document.getElementsByName(`coluna-${idColuna}-linha${i}-grid-${contexto.idElementoPai}`)[0].onclick = function(evento){
                        if( contexto.callbacks[ 'onClickColuna' ] ){
                            contexto.callbacks[ 'onClickColuna' ].bind( contexto )( i, e, contexto.getNomeColuna( idColuna ), contexto.getStatusColuna(contexto.getNomeColuna( idColuna )), evento.target, contexto );
                        }

                        //Se a coluna tiver um evento em statusColunas
                        if( contexto.statusColunas[ contexto.getNomeColuna( idColuna ) ]['onClick'] ){
                            contexto.statusColunas[ contexto.getNomeColuna( idColuna ) ]['onClick'].bind( contexto )( i, e, contexto.getNomeColuna( idColuna ), contexto.getStatusColuna(contexto.getNomeColuna( idColuna )), evento.target, contexto );
                        }

                        /**
                        * Outros eventos
                        */

                        //Se pode copiar o texto
                        if( contexto.selectOnClick == true && contexto.getStatusColuna(contexto.getNomeColuna( idColuna )).allowCopy != false ||
                            contexto.getStatusColuna(contexto.getNomeColuna( idColuna )).copy == true    
                        ){
                            const valorColunaClicando = contexto.getPosicao( idLinha, idColuna ).valor;

                            navigator.clipboard.writeText( valorColunaClicando )
                                            .then(() => alert("Copiado!"))
                                            .catch(err => console.error("Falha ao copiar texto: ", err));
                        }

                        //Se pode selecionar o texto
                        if( contexto.copyOnClick == true && contexto.getStatusColuna(contexto.getNomeColuna( idColuna )).allowSelect != false ||
                            contexto.getStatusColuna(contexto.getNomeColuna( idColuna )).select == true    
                        ){
                            if( contexto.getStatusColuna(contexto.getNomeColuna( idColuna )).editable != undefined &&
                                contexto.getStatusColuna(contexto.getNomeColuna( idColuna )).editable != false &&
                                contexto.getStatusColuna(contexto.getNomeColuna( idColuna )).editable != null
                            ){
                                 evento.target.setSelectionRange(0, evento.target.value.length);             
                                 evento.target.focus();

                            }else{
                                // Cria uma seleção de texto
                                const range = document.createRange();
                                range.selectNodeContents(evento.target);
                                const selection = window.getSelection();
                                selection.removeAllRanges(); // Limpa seleções anteriores
                                selection.addRange(range);
                            }
                        }
                    };

                    document.getElementsByName(`coluna-${idColuna}-linha${i}-grid-${contexto.idElementoPai}`)[0].addEventListener('mousedown', function(evento){
                        if( contexto.callbacks[ 'onLeftClickColuna' ] ){
                            if( evento.button == 0 ){ contexto.callbacks[ 'onLeftClickColuna' ].bind( contexto )( i, e, contexto.getNomeColuna( idColuna ), contexto.getStatusColuna(contexto.getNomeColuna( idColuna )), evento.target, contexto ); };
                        }

                        if( contexto.callbacks[ 'onMiddleClickColuna' ] ){
                            if( evento.button == 1 ){ contexto.callbacks[ 'onMiddleClickColuna' ].bind( contexto )( i, e, contexto.getNomeColuna( idColuna ), contexto.getStatusColuna(contexto.getNomeColuna( idColuna )), evento.target, contexto ); };
                        }

                        if( contexto.callbacks[ 'onRightClickColuna' ] ){
                            if( evento.button == 2 ){ contexto.callbacks[ 'onRightClickColuna' ].bind( contexto )( i, e, contexto.getNomeColuna( idColuna ), contexto.getStatusColuna(contexto.getNomeColuna( idColuna )), evento.target, contexto ); };
                        }
                        
                        //Se a coluna tiver um evento em statusColunas
                        if( contexto.statusColunas[ contexto.getNomeColuna( idColuna ) ]['onLeftClick'] ){
                            if( evento.button == 0 ){ contexto.statusColunas[ contexto.getNomeColuna( idColuna ) ]['onLeftClick'].bind( contexto )( i, e, contexto.getNomeColuna( idColuna ), contexto.getStatusColuna(contexto.getNomeColuna( idColuna )), evento.target, contexto ); };
                        }
                        if( contexto.statusColunas[ contexto.getNomeColuna( idColuna ) ]['onMiddleClick'] ){
                            if( evento.button == 1 ){ contexto.statusColunas[ contexto.getNomeColuna( idColuna ) ]['onMiddleClick'].bind( contexto )( i, e, contexto.getNomeColuna( idColuna ), contexto.getStatusColuna(contexto.getNomeColuna( idColuna )), evento.target, contexto ); };
                        }
                        if( contexto.statusColunas[ contexto.getNomeColuna( idColuna ) ]['onRightClick'] ){
                            if( evento.button == 2 ){ contexto.statusColunas[ contexto.getNomeColuna( idColuna ) ]['onRightClick'].bind( contexto )( i, e, contexto.getNomeColuna( idColuna ), contexto.getStatusColuna(contexto.getNomeColuna( idColuna )), evento.target, contexto ); };
                        }
                    })
                }
            }

            /**
            * Cria os eventos de edição das colunas da linha 
            */
            if(document.getElementsByName(`linha-${idLinha}-grid-${contexto.idElementoPai}`)[0])
            {
                (document)
                .getElementsByName(`linha-${idLinha}-grid-${contexto.idElementoPai}`)[0]
                .querySelectorAll('input')
                .forEach(function( objInput, indiceObjInput ){
                    const idInput      = objInput.id;
                    const numLinha     = Number( objInput.getAttribute('_linha') );
                    const numColuna    = Number( objInput.getAttribute('_coluna') );
                    const nomeColuna   = contexto.getNomeColuna( numColuna );
                    const statusColuna = contexto.getStatusColuna( nomeColuna );
                    const valorAtual   = objInput.value;

                    if( statusColuna.editable != undefined )
                    {
                        objInput.onchange = function(evento){

                            const valorEditado = evento.target.value;

                            //Edita o objeto dados interno
                            contexto.setColunaAmostra( numLinha, numColuna, valorEditado );

                            //Se o editable for um JSON, e dentro dele tiver o callback onChange, ele aplica ele com esses parametros
                            if( typeof statusColuna.editable == 'object' &&
                                statusColuna.editable.onChange
                            ){
                                statusColuna.editable.onChange.bind(contexto)( idInput, valorAtual, valorEditado, Number(numLinha), Number(numColuna), nomeColuna, statusColuna, contexto );
                            }
                        }
                    
                    }

                });
            }
        }

        //Roda o callback afterRender
        if( this.callbacks.afterRender ){
            this.callbacks.afterRender.bind(this)( this );
        }

        //Cria alguns botões
        if( this.buttons == true || typeof this.buttons == 'object' )
        {
            document.getElementsByClassName('linha-toolbar')[0].innerHTML += `
                ${ 
                   (
                        //Se eu controlo se vai ter botao de adicionar amostra ou não
                        (
                            typeof this.buttons == 'object' && 
                            this.buttons.new == true
                        )
                        //OU SE EU NÂO ESPECIFICAR NADA, VAI TER POR PADRAO
                        ||
                        (
                            typeof this.buttons == 'boolean'
                        )
                   ) == true
                            ? "<button name='botao-adicionar-amostra' class='elemento-linha-grid'> 🖉 New </button>" 
                            : ""               
                }

                ${
                    (
                        //Se eu controlo se vai ter botao de adicionar amostra ou não
                        (
                            typeof this.buttons == 'object' && 
                            this.buttons.reflesh == true
                        )
                        //OU SE EU NÂO ESPECIFICAR NADA, VAI TER POR PADRAO
                        ||
                        (
                            typeof this.buttons == 'boolean'
                        )
                   ) == true 
                            ? "<button name='botao-recarregar-grid' class='elemento-linha-grid'>🔌Reflesh </button>"
                            : ""
                }
            `;
        }

        if( this.searchBar == true || typeof this.searchBar == 'object' )
        {
            document.getElementsByClassName('linha-pesquisa')[0].innerHTML = `
                <input class='input-pesquisa-grid'
                    placeholder='🔍 Search...' 
                />
            `;
        }

        //Cria os eventos dos botões
        if( this.buttons == true || typeof this.buttons == 'object' )
        {
            (document)
            .getElementById(contexto.idElementoPai)
            .querySelectorAll('button')
            .forEach(function( objBotao, indiceBotao ){

                if( objBotao.name == 'botao-adicionar-amostra' ){
                    objBotao.contexto = contexto;
                    objBotao.onclick = function(evento){
                        contexto.adicionarAmostra( Array(contexto.dados[0].length).fill('.') );
                    }
                }

                if( objBotao.name == 'botao-recarregar-grid' ){
                    objBotao.contexto = contexto;
                    objBotao.onclick = function(evento){
                        contexto.render();
                    }
                }

            });
        }

        if( this.searchBar == true || typeof this.searchBar == 'object' )
        {
            //Cria o evento de pesquisa
            (document)
            .getElementById(contexto.idElementoPai)
            .querySelector('.input-pesquisa-grid')
            .value = contexto.pesquisando;

            (document)
            .getElementById(contexto.idElementoPai)
            .querySelector('.input-pesquisa-grid')
            .onchange = function(evento){
                const valorPesquisa = evento.target ? String(evento.target.value).toLowerCase() : null;

                //Identifica SE e o QUE o usuario está pesquisando na grid
                if( valorPesquisa != '' ){
                    contexto.pesquisando = valorPesquisa;
                }else{
                    contexto.pesquisando = null;
                }

                contexto.render();
            }
        }

    }
}