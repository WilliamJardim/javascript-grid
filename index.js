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
            
            onClick: function(linha, coluna, nomeColuna, elementoLinha, contexto){
                
            }
        },
        'Age': {
            visible: true
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
    elementoPai: 'div-grid',

    /**
    * Eventos 
    */
    callbacks: {
        onClickLinha: function( linha, elementoLinha, contexto ){
            
        },

        onClickColuna: function( linha, coluna, nomeColuna, elementoLinha, contexto ){
            
        },

        beforeRender: function( contexto ){
            
        },

        afterRender: function( contexto ){
            
        }
    }
});