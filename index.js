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
            visible: true
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
    elementoPai: 'div-grid'
});