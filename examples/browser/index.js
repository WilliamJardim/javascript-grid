const estrutura = Analise.DataStructure([
    ['William', 21],
    ['Rafael',  25]

], {
    /**
    * As colunas
    */
    campos: ['Name', 'Age'],
    flexibilidade: ['Text', 'Number'],
});

const minhaGrid = new WGrid.WGrid(estrutura.raw(), {

    elementoPai: 'div-grid',
    
    /**
    * As colunas
    */
    colunas: ['Name', 'Age'],
    flexibilidade: ['Text', 'Number'],

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