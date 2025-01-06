const minhaGrid = new WGrid({
    /**
    * As colunas
    */
    colunas: ['Name', 'Age'],

    /**
    * Configurações das colunas 
    */
    status: {
        'Name': {
            visible: true,
            select: true,
            copy: false,
            editable: true
            
        },
        'Age': {
            visible: true,
            select: true,
            copy: false,
            editable: true
        }
    },

    /**
    * As amostras 
    */
    dados: [
        ['William', 21],
        ['Rafael',  25]
    ],

    titulo: 'Friends',

    /**
    * Controla a barra de pesquisa
    */
    searchBar: true,

    /**
    * Controla quais botões vão existir 
    */
    buttons: {
        new: true,
        reflesh: true
    },

    elementoPai: 'div-grid',

    /**
    * Eventos 
    */
    callbacks: {
        onClickLinha: function( linha, elementoLinha, contexto ){
            
        },

        onClickColuna: function( linha, coluna, nomeColuna, statusColuna, elementoLinha, contexto ){
            
        },

        beforeRender: function( contexto ){
            
        },

        afterRender: function( contexto ){
            
        }
    }
});