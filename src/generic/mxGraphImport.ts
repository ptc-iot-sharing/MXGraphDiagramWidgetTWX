window["mxImageBasePath"] =  "../Common/extensions/mxdiagram_ExtensionPackage/ui/mxdiagram/mxgraph/images";
window["mxBasePath"] = "../Common/extensions/mxdiagram_ExtensionPackage/ui/mxdiagram/mxgraph"

export let mxgraph = require('jjgraph');

/**
 * The mxgraph library expect to have all of the necessary function directly on window.
 * Instead, we do not want to pollute the window object so we use the mxgraph namespace
 * This replaces the decode function of mxCoded to one that uses mxgraph instead of window
 */

mxgraph.mxCodec.prototype.decode = function (node, into) {
    var obj = null;
    if (node != null && node.nodeType == mxgraph.mxConstants.NODETYPE_ELEMENT) {
        var ctor = null;
        try {
            ctor = mxgraph[node.nodeName];
        }
        catch (err) {
            // ignore
        }
        var dec = mxgraph.mxCodecRegistry.getCodec(ctor);
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
