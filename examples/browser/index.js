const estrutura = Analise.DataStructure([
    ['William', 21, true],
    ['Rafael',  25, true]

], {
    /**
    * As colunas
    */
    campos: ['Name', 'Age', 'Active'],
    flexibilidade: ['Text', 'Number', 'Boolean'],
});

const minhaGrid = new WGrid.WGrid(estrutura.raw(), {

    elementoPai: 'div-grid',
    
    /**
    * As colunas
    */
    colunas: ['Name', 'Age', 'Active'],
    flexibilidade: ['Text', 'Number', 'Boolean'],

    /**
    * Configurações das colunas 
    */
    status: {
        'Name': {
            typeof: 'string',
            visible: true,
            select: true,
            copy: false,
            editable: true
            
        },
        'Age': {
            typeof: 'number',
            visible: true,
            select: true,
            copy: false,
            editable: true
        },
        'Active': {
            typeof: 'boolean',
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