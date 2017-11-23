import { mxgraph } from "../generic/mxGraphImport"

let mxGraph = mxgraph.mxGraph,
    mxCodec = mxgraph.mxCodec,
    mxConstants = mxgraph.mxConstants,
    mxEdgeStyle = mxgraph.mxEdgeStyle,
    mxUtils = mxgraph.mxUtils;

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