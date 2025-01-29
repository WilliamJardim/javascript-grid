const estrutura = Analise.DataStructure([
    ['William', 21, 'Sim'],
    ['Rafael',  25, 'Sim']

], {
    /**
    * As colunas
    */
    campos: ['Name', 'Age', 'Active'],
    flexibilidade: ['Text', 'Number', 'Text'],
});

const minhaGrid = new WGrid.WGrid(estrutura.raw(), {

    elementoPai: 'div-grid',
    
    /**
    * As colunas
    */
    colunas: ['Name', 'Age', 'Active'],
    flexibilidade: ['Text', 'Number', 'Text'],

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
            select: false,
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