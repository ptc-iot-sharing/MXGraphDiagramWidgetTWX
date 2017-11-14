declare const TW: any;
TW.IDE.Widgets.mxdiagram = function() {

    this.widgetIconUrl = function() {
        return "../Common/extensions/mxdiagram_ExtensionPackage/ui/mxdiagram/mxdiagram.png";
    };
    this.widgetProperties = function() {
        return {
            'name': 'mxDiagram Value Process',
            'description': 'mxDiagram Value process diagram',
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
                    'description': 'A JSON representing a value diagram',
                    'baseType': 'JSON',
                    'isVisible': true,
                    'defaultValue': {},
                    'isBindingTarget': true
                },
                'GraphExport': {
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
                    'defaultValue': {},
                    'isBindingTarget': true
                },
                'ShowOutline': {
                    'description': 'Show the outline window',
                    'baseType': 'BOOLEAN',
                    'isVisible': true,
                    'defaultValue': {},
                    'isBindingTarget': true
                },
                // add any additional properties here
            }
        };
    };

    this.renderHtml = function() {
        return '<div class="widget-content widget-mxdiagram-viewer"></div>';
    };

}