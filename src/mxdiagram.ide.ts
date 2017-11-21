declare const TW: any;
require("./styles/ide.css");

TW.IDE.Widgets.mxdiagram = function() {

    this.widgetIconUrl = function() {
        return require('./images/diagramicon.png');
    };
    this.widgetProperties = function() {
        return {
            'name': 'mxGraph Diagram',
            'description': 'Display diagrams using mxGraph.',
            'category': ['Common'],
            'iconImage': 'mxdiagram.png',
            'isExtension': true,
            'supportsAutoResize': true,
            'isResizable': true,
            'properties': {
                'Width': {
                    'description': 'Total width of the widget',
                    'baseType': 'NUMBER',
                    'isVisible': true,
                    'defaultValue': 640,
                    'isBindingTarget': false
                },
                'Height': {
                    'description': 'Total height of the widget',
                    'baseType': 'NUMBER',
                    'isVisible': true,
                    'defaultValue': 800,
                    'isBindingTarget': false
                },
                'ValueDiagram': {
                    'description': 'A JSON representing a value process diagram',
                    'baseType': 'JSON',
                    'isVisible': true,
                    'defaultValue': {},
                    'isBindingTarget': true
                },
                'XMLDiagram': {
                    'description': 'A XML file with the a mxgraph diagram',
                    'baseType': 'XML',
                    'isVisible': true,
                    'defaultValue': {},
                    'isBindingTarget': true
                },
                'ShowTools': {
                    'description': 'Show the tools window',
                    'baseType': 'BOOLEAN',
                    'isVisible': true,
                    'defaultValue': true,
                    'isBindingTarget': true
                },
                'ShowOutline': {
                    'description': 'Show the outline window',
                    'baseType': 'BOOLEAN',
                    'isVisible': true,
                    'defaultValue': true,
                    'isBindingTarget': true
                },
                'EditedCellId': {
                    'description': 'The id of the cell where the label just changed. Tied to the CellLabelChanged event',
                    'baseType': 'STRING',
                    'isVisible': true,
                    'isBindingSource': true
                },
                'EditedCellNewLabel': {
                    'description': 'The contents of the cell where the label just changed. Tied to the CellLabelChanged event',
                    'baseType': 'STRING',
                    'isVisible': true,
                    'isBindingSource': true
                }
            }
        };
    };

    this.widgetEvents = function () {
        return {
            'CellLabelChanged': {
                'warnIfNotBound': false
            }
        };
    };

    this.renderHtml = function() {
        return '<div class="widget-content widget-mxdiagram-viewer"></div>';
    };

}