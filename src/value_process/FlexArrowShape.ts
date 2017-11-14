import {mxgraph} from "./mxGraphImport"

let mxCellRenderer = mxgraph.mxCellRenderer,
    mxArrowConnector = mxgraph.mxArrowConnector,
    mxUtils = mxgraph.mxUtils;

// Generic arrow
function FlexArrowShape() {
    mxArrowConnector.call(this);
    this.spacing = 0;
};
mxUtils.extend(FlexArrowShape, mxArrowConnector);
FlexArrowShape.prototype.defaultWidth = 10;
FlexArrowShape.prototype.defaultArrowWidth = 20;

FlexArrowShape.prototype.getStartArrowWidth = function () {
    return this.getEdgeWidth() + mxUtils.getNumber(this.style, 'startWidth', this.defaultArrowWidth);
};

FlexArrowShape.prototype.getEndArrowWidth = function () {
    return this.getEdgeWidth() + mxUtils.getNumber(this.style, 'endWidth', this.defaultArrowWidth);;
};

FlexArrowShape.prototype.getEdgeWidth = function () {
    return mxUtils.getNumber(this.style, 'width', this.defaultWidth) + Math.max(0, this.strokewidth - 1);
};
// Registers the link shape
mxCellRenderer.prototype.defaultShapes['flexArrow'] = FlexArrowShape;