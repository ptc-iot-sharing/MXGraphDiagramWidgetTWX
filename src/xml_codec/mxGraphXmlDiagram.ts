import { mxgraph } from "../generic/mxGraphImport"

let mxGraph = mxgraph.mxGraph,
    mxCodec = mxgraph.mxCodec,
    mxConstants = mxgraph.mxConstants,
    mxEdgeStyle = mxgraph.mxEdgeStyle,
    mxUtils = mxgraph.mxUtils,
    mxCodecRegistry = mxgraph.mxCodecRegistry;

/**
 * The mxgraph library expect to have all of the necessary function directly on window.
 * Instead, we do not want to pollute the window object so we use the mxgraph namespace
 * This replaces the decode function of mxCoded to one that uses mxgraph instead of window
 */
mxCodec.prototype.decode = function (node, into) {
    var obj = null;
    if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {
        var ctor = null;
        try {
            ctor = mxgraph[node.nodeName];
        }
        catch (err) {
            // ignore
        }
        var dec = mxCodecRegistry.getCodec(ctor);
        if (dec != null) {
            obj = dec.decode(this, node, into);
        }
        else {
            obj = node.cloneNode(true);
            obj.removeAttribute('as');
        }
    }

    return obj;
};

export function createGraphFromXML(container, data) {
    let xmlData = mxUtils.parseXml(data);
    let decoder = new mxCodec(xmlData);
    let node = xmlData.documentElement;

    let graph = new mxGraph(container);
    graph.centerZoom = false;
    graph.setTooltips(false);
    graph.setEnabled(true);

    // Changes the default style for edges "in-place"
    let style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;

    // Enables panning with left mouse button
    graph.panningHandler.useLeftButtonForPanning = true;
    graph.panningHandler.ignoreCell = true;
    graph.container.style.cursor = 'move';
    graph.setPanning(true);


    decoder.decode(node, graph.getModel());
    graph.resizeContainer = false;

    return graph;
}