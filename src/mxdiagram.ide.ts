declare const TW: any;
require("./styles/ide.css");

TW.IDE.Widgets.mxdiagram = function () {

    this.widgetIconUrl = function () {
        return require('./images/diagramicon.png');
    };
    this.widgetProperties = function () {
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
                    'baseType': 'TEXT',
                    'isVisible': true,
                    'defaultValue': "{}",
                    'isBindingTarget': true,
                    'isBindingSource': true
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
                'CustomShapesXMLPath': {
                    'description': 'URL that points to a xml shapes file',
                    'baseType': 'STRING',
                    'isVisible': true
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
                },
                'JSONArrayGraphCells': {
                    'description': 'Json object containing id, value, fillColors and strokeColor',
                    'baseType': 'STRING',
                    'isVisible': true,
                    'defaultValue': "{}",
                    'isBindingTarget': true
                },
                'SelectedCellId': {
                    'description': 'Selected cell id',
                    'baseType': 'STRING',
                    'isVisible': true,
                    'isBindingSource': true
                },
                'AutoLayout': {
                    'description': 'The layout to be applied to loaded XML.',
                    'baseType': 'STRING',
                    'defaultValue': 'None',
                    'selectOptions': [{
                        value: 'None',
                        text: 'None'
                    }, {
                        value: 'Horizontal Flow',
                        text: 'Horizontal Flow'
                    },
                    {
                        value: 'Vertical Flow',
                        text: 'Vertical Flow'
                    },
                    {
                        value: 'Horizontal Tree',
                        text: 'Horizontal Tree'
                    },
                    {
                        value: 'Vertical Tree',
                        text: 'Vertical Tree'
                    },
                    {
                        value: 'Radial Tree',
                        text: 'Radial Tree'
                    },
                    {
                        value: 'Organic',
                        text: 'Organic'
                    },
                    {
                        value: 'Circle',
                        text: 'Circle'
                    },
                    ]
                },
                'EdgeStyle': {
                    'description': 'The edge style to be applied to loaded XML.',
                    'baseType': 'STRING',
                    'defaultValue': 'None',
                    'selectOptions': [{
                        value: 'None',
                        text: 'None'
                    }, {
                        value: 'ElbowConnector',
                        text: 'Elbow Connector'
                    },
                    {
                        value: 'EntityRelation',
                        text: 'Entity Relation'
                    },
                    {
                        value: 'Loop',
                        text: 'Loop'
                    },
                    {
                        value: 'SideToSide',
                        text: 'Side To Side'
                    },
                    {
                        value: 'TopToBottom',
                        text: 'Top To Bottom'
                    },
                    {
                        value: 'SegmentConnector',
                        text: 'Segment Connector'
                    },
                    {
                        value: 'OrthConnector',
                        text: 'Orth Connector'
                    },
                    ]
                }
            }
        };
    };

    this.widgetEvents = function () {
        return {
            'CellLabelChanged': {
                'warnIfNotBound': false
            },
            'SelectedCellChanged': {
                'warnIfNotBound': false
            },
            'CellDoubleClicked': {
                'warnIfNotBound': false
            }
        };
    };

    this.widgetServices = function () {
        return {
            'GenerateXML': { 'warnIfNotBound': false, 'description': 'Updates the XML property with the changes done to the graph' }
        };
    };

    this.renderHtml = function () {
        return '<div class="widget-content widget-mxdiagram-viewer"></div>';
    };

}