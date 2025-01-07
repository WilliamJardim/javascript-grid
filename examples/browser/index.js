const minhaGrid = new WGrid.WGrid([
    ['William', 21],
    ['Rafael',  25]

//Configurações da Grid
], {
    elementoPai: 'div-grid',
    
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
    }
});