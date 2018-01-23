import { mxgraph } from "../generic/mxGraphImport"
import { loadStencilFiles, loadStyleFiles } from "../generic/mxGraphUtils";
let pako = require('pako');

let mxGraph = mxgraph.mxGraph,
    mxCodec = mxgraph.mxCodec,
    mxConstants = mxgraph.mxConstants,
    mxEdgeStyle = mxgraph.mxEdgeStyle,
    mxUtils = mxgraph.mxUtils,
    mxEvent = mxgraph.mxEvent,
    mxCellRenderer = mxgraph.mxCellRenderer,
    mxShape = mxgraph.mxShape,
    mxStencil = mxgraph.mxStencil;


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
    // add the default styles
    const defaultStyles = require("../resources/defaultStyles.xml");
    loadStyleFiles([defaultStyles], graph);

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
    graph.getLabel = function (cell) {
        if (cell.value && cell.value.getAttribute) {
            return cell.value.getAttribute('label');
        } else {
            return cell.value;
        }
    }
    decoder.decode(node, graph.getModel());
    graph.resizeContainer = false;

    return graph;
}

var mxCellRendererCreateShape = mxCellRenderer.prototype.createShape;
mxCellRenderer.prototype.createShape = function (state) {
    if (state.style != null && typeof (pako) !== 'undefined') {
        var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

        // Extracts and decodes stencil XML if shape has the form shape=stencil(value)
        if (shape != null && shape.substring(0, 8) == 'stencil(') {
            try {
                var stencil = shape.substring(8, shape.length - 1);
                var doc = mxUtils.parseXml(decompress(stencil));

                return new mxShape(new mxStencil(doc.documentElement));
            }
            catch (e) {
                if (window.console != null) {
                    console.log('Error in shape: ' + e);
                }
            }
        }
    }

    return mxCellRendererCreateShape.apply(this, arguments);
}

/**
 * Returns a decompressed version of the base64 encoded string.
 */
function decompress(data) {
    if (data == null || data.length == 0 || typeof (pako) === 'undefined') {
        return data;
    }
    else {
        return zapGremlins(decodeURIComponent(
            bytesToString(pako.inflateRaw(atob(data)))));
    }
}

/**
 * Removes all illegal control characters with ASCII code <32 except TAB, LF
 * and CR.
 */
function zapGremlins(text) {
    var checked = [];

    for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);

        // Removes all control chars except TAB, LF and CR
        if (code >= 32 || code == 9 || code == 10 || code == 13) {
            checked.push(text.charAt(i));
        }
    }

    return checked.join('');
};

/**
 * Turns the given array into a string.
 */
function bytesToString(arr) {
    var result = new Array(arr.length);

    for (var i = 0; i < arr.length; i++) {
        result[i] = String.fromCharCode(arr[i]);
    }

    return result.join('');
};