const estrutura = Analise.DataStructure([
    ['William', 21, false, 'ONLINE'],
    ['Rafael',  25, 'Nao', 'OFFLINE'],
    ['Test',     25, 'Sim', 'OFFLINE'],
    ['Test2',    25, 'Sim', 'OFFLINE']

], {
    /**
    * As colunas
    */
    campos: ['Name', 'Age', 'Active', 'Con'],
    flexibilidade: ['Text', 'Number', 'Text', 'Text'],
});

const minhaGrid = new WGrid.WGrid(estrutura.raw(), {

    elementoPai: 'div-grid',
    
    /**
    * As colunas
    */
    colunas: ['Name', 'Age', 'Active', 'Con'],
    flexibilidade: ['Text', 'Number', 'Text', 'Text'],

    /**
    * Configurações das colunas 
    */
    status: {
        'Name': {
            typeof: 'string',
            begin: '.',
            visible: true,
            select: true,
            copy: false,
            editable: true
            
        },
        'Age': {
            typeof: 'number',
            begin: 0,
            visible: true,
            select: true,
            copy: false,
            editable: true
        },
        'Active': {
            typeof: 'boolean',
            begin: false,
            visible: true,
            select: false,
            copy: false,
            editable: true
        },
        'Con': {
            typeof: 'text-choice',
            choices: 'dataset',

            choicesExpand: [
                'Nenhuma'
            ],

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