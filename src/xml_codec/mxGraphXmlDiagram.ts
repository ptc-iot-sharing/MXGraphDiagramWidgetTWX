import { mxgraph } from "../generic/mxGraphImport"
import { loadStencilFiles } from "../generic/mxGraphUtils";

let mxGraph = mxgraph.mxGraph,
    mxCodec = mxgraph.mxCodec,
    mxConstants = mxgraph.mxConstants,
    mxEdgeStyle = mxgraph.mxEdgeStyle,
    mxUtils = mxgraph.mxUtils,
    mxEvent = mxgraph.mxEvent;
/**
 * The list of stencils we import
 */
const stencilList = [require('../resources/stencils/agitators.xml'), require('../resources/stencils/apparatus_elements.xml'), require('../resources/stencils/agitators.xml'), require('../resources/stencils/centrifuges.xml'), require('../resources/stencils/compressors.xml'), require('../resources/stencils/compressors_iso.xml'), require('../resources/stencils/crushers_grinding.xml'), require('../resources/stencils/driers.xml'), require('../resources/stencils/engines.xml'), require('../resources/stencils/feeders.xml'), require('../resources/stencils/filters.xml'), require('../resources/stencils/fittings.xml'), require('../resources/stencils/flow_sensors.xml'), require('../resources/stencils/heat_exchangers.xml'), require('../resources/stencils/instruments.xml'), require('../resources/stencils/misc.xml'), require('../resources/stencils/mixers.xml'), require('../resources/stencils/piping.xml'), require('../resources/stencils/feeders.xml'), require('../resources/stencils/feeders.xml'), require('../resources/stencils/pumps.xml'), require('../resources/stencils/pumps_din.xml'), require('../resources/stencils/pumps_iso.xml'), require('../resources/stencils/separators.xml'), require('../resources/stencils/shaping_machines.xml'), require('../resources/stencils/valves.xml'), require('../resources/stencils/vessels.xml')];

export function createGraphFromXML(container, data) {
    loadStencilFiles(stencilList);
    
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
    // Forces panning for middle and right mouse buttons
    var panningHandlerIsForcePanningEvent = graph.panningHandler.isForcePanningEvent;
    graph.panningHandler.isForcePanningEvent = function (me) {
      // Ctrl+left button is reported as right button in FF on Mac
      return panningHandlerIsForcePanningEvent.apply(this, arguments) || (mxEvent.isMouseEvent(me.getEvent()) &&
        (this.usePopupTrigger || !mxEvent.isPopupTrigger(me.getEvent())) &&
        ((!mxEvent.isControlDown(me.getEvent()) &&
          mxEvent.isRightMouseButton(me.getEvent())) ||
          mxEvent.isMiddleMouseButton(me.getEvent())));
    };

    decoder.decode(node, graph.getModel());
    graph.resizeContainer = false;

    return graph;
}