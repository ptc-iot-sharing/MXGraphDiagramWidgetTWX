import { mxgraph } from "./mxGraphImport"

let mxUtils = mxgraph.mxUtils,
mxToolbar = mxgraph.mxToolbar,
mxPrintPreview = mxgraph.mxPrintPreview,
mxWindow = mxgraph.mxWindow,
mxOutline = mxgraph.mxOutline;

export function CreateGraphToolbar(graph) {
    var content = document.createElement('div');
    content.style.padding = '4px';

    var tb = new mxToolbar(content);

    tb.addItem('Zoom In', require('../images/zoom_in32.png'), function (evt) {
        graph.zoomIn();
    });

    tb.addItem('Zoom Out', require('../images/zoom_out32.png'), function (evt) {
        graph.zoomOut();
    });

    tb.addItem('Actual Size', require('../images/view_1_132.png'), function (evt) {
        graph.zoomActual();
    });

    tb.addItem('Print', require('../images/print32.png'), function (evt) {
        var preview = new mxPrintPreview(graph, 1);
        preview.open();
    });
    tb.addItem('Show', require('../images/newtab32.png'), function (evt) {
        mxUtils.show(graph, null, 10, 10);
    });

    tb.addItem('Poster Print', require('../images/press32.png'), function (evt) {
        var pageCount = mxUtils.prompt('Enter maximum page count', '1');

        if (pageCount != null) {
            var scale = mxUtils.getScaleForPageCount(pageCount, graph);
            var preview = new mxPrintPreview(graph, scale);
            preview.open();
        }
    });

    let toolsWindow = new mxWindow('Tools', content, 50, 50, 240, 66, true);
    toolsWindow.setMaximizable(false);
    toolsWindow.setScrollable(false);
    toolsWindow.setResizable(false);
    toolsWindow.setVisible(true);
}

export function CreateGraphOutline(graph) {
    // Creates the outline (navigator, overview) for moving
    // around the graph in an mxWindow
    var content = document.createElement('div');
    content.style.position = 'absolute';
    content.style.width = '100%';
    content.style.height = '100%';
    content.style.border = '1px solid whiteSmoke';
    content.style.overflow = 'hidden';
    var outline = new mxOutline(graph, content);
    // create the window itself
    let outlineWindow = new mxWindow('Outline', content, 250, 50, 200, 300, true);
    outlineWindow.setMaximizable(false);
    outlineWindow.setScrollable(false);
    outlineWindow.setResizable(true);
    outlineWindow.setVisible(true);
    outlineWindow.setClosable(true);
    // zoom actual to view the full chart
    graph.zoomActual();
}