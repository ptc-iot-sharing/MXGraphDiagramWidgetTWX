
import { mxgraph } from "./mxGraphImport"
import "./FlexArrowShape";
import "./mxLeanMap";
import { GraphCellRenderer } from './CellFactory'
import { ValueProcessDiagramRenderer } from './ValueProcessNodeRenderer'
require("../styles/styles.css");

let mxGraph = mxgraph.mxGraph,
  mxShape = mxgraph.mxShape,
  mxRubberband = mxgraph.mxRubberband,
  mxClient = mxgraph.mxClient,
  mxUtils = mxgraph.mxUtils,
  mxCellTracker = mxgraph.mxCellTracker,
  mxStackLayout = mxgraph.mxStackLayout,
  mxLayoutManager = mxgraph.mxLayoutManager,
  mxConstants = mxgraph.mxConstants,
  mxEdgeStyle = mxgraph.mxEdgeStyle,
  mxRectangle = mxgraph.mxRectangle,
  mxEvent = mxgraph.mxEvent,
  mxParallelEdgeLayout = mxgraph.mxParallelEdgeLayout,
  mxCircleLayout = mxgraph.mxCircleLayout,
  mxStencilRegistry = mxgraph.mxStencilRegistry,
  mxStencil = mxgraph.mxStencil,
  mxCellEditor = mxgraph.mxCellEditor,
  mxKeyHandler = mxgraph.mxKeyHandler;

export function createValueProcessDiagram(container, data) {
  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported()) {
    mxUtils.error('Browser is not supported!', 200, false);
  }
  else {
    loadLeanMappingShapes();
    // Creates the graph inside the given container
    var graph = new mxGraph(container);
    // Disables the built-in context menu
    mxEvent.disableContextMenu(container);
    // Allow panning using the right click buttion
    graph.setPanning(true);
    // allow resizing the container when an vertex moves outside of it
    graph.setResizeContainer(true);
    // enable the display of tooltips
    graph.setTooltips(true);
    // disable new connections and cloning cells, as well as drag and drop outside
    graph.setConnectable(false);
    graph.setCellsCloneable(false);
    graph.setCellsDeletable(false);
    graph.setDropEnabled(false);
    graph.setSplitEnabled(false);
    // Enables HTML labels
    graph.setHtmlLabels(true);
    // don't allow cells to be dropped outside of their current parent
    graph.graphHandler.removeCellsFromParent = false;
    // when a cells is collapsed, recalculate its preferred size
    graph.collapseToPreferredSize = true;
    // cells should not be bigger than their parents
    graph.constrainChildren = true;
    graph.extendParentsOnAdd = true;
    graph.extendParents = true;
    // disable the grid so things are more condensed
    graph.gridEnabled = true;
    // allow selection of cells
    graph.cellsSelectable = true;
    graph.gridSize = 5;
    graph.border = 10;

    // create the styles used in the graph
    createStyles(graph);

    // construct the graph renderer that will allow us render each type of cells
    let graphRenderer = new GraphCellRenderer(graph);

    // allow highlighting of cells on mouse over
    new mxCellTracker(graph, '#00d5f4', function (me) {
      let cell = me.getCell();
      let excludedStyles = ["suppliers", "partDetails"];
      if (cell && excludedStyles.indexOf(cell.style) >= 0) {
        return null;
      } else {
        return cell;
      }
    });
    // a handler for basic keystrokes (eg. return, escape during editing).
    new mxKeyHandler(graph);
    /**
     * Retrieves the editing value of a cell
     */
    graph.getEditingValue = function (cell) {
      if (cell.value && cell.value.isEditable) {
        return cell.value.value;
      }
    };

    /**
     * Sets the cell label back after a edit
     */
    let graphCellLabelChanged = graph.cellLabelChanged;
    graph.cellLabelChanged = function (cell, newValue, autoSize) {
      if (cell.value && cell.value.isEditable) {
        cell.value.value = newValue;
        newValue = cell.value;        
      } 
      graphCellLabelChanged.apply(this, [cell, newValue, autoSize]);
    };

    // Installs a custom tooltip for cells
    graph.getTooltipForCell = graphRenderer.getCellTooltip;
    graph.isLabelClipped = graphRenderer.isLabelClipped;

    // Make sure the cells can be folded
    graph.isCellFoldable = graphRenderer.isCellFoldable;

    // Make sure only the parts specified in the model as editable are actually so.
    graph.isCellEditable = graphRenderer.isCellEditable;

    // make sure some of the cells can be selected
    graph.isCellSelectable = graphRenderer.isCellSelectable;

    // Installs auto layout for all levels
    let layoutMgr = new mxLayoutManager(graph);
    layoutMgr.getLayout = graphRenderer.getLayout;

    // for each type of cell, grab the cell label in a different way
    graph.getLabel = graphRenderer.getCellLabel;

    // Extends mxGraphModel.getStyle change the style of suppliers when collapsed
    // TODO: this should not be needed. Collapsing should go back to the correct size of the supplier cell
    // however, the preffered size is not computed correctly
    var modelGetStyle = graph.model.getStyle;
    graph.model.getStyle = function (cell) {
      if (cell != null) {
        var style = modelGetStyle.apply(this, arguments);

        if (cell.style == 'supplier' && this.isCollapsed(cell)) {
          style = 'rectangle';
        }
        return style;
      }

      return null;
    };

    // Extends mxCellRenderer.getControlBounds to move the collapse icon lower for factories and suppliers
    var cellRendererControlBounds = graph.cellRenderer.getControlBounds;
    graph.cellRenderer.getControlBounds = function (state, w, h) {
      var value = cellRendererControlBounds.apply(this, arguments);

      if (state.style.shape == "mxgraph.lean_mapping.outside_sources") {
        return state.shape.getControlBounds(value, w, h);
      }
      return value;
    };

    // Enables rubberband selection
    new mxRubberband(graph);

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    var parent = graph.getDefaultParent();
    // set a prefix for the generated ids so they do not conflict with our set ones
    graph.getModel().prefix = "autoGenerated";
    // Adds cells to the model in a single step
    graph.getModel().beginUpdate();
    try {
      // begin rendering the datamodel
      new ValueProcessDiagramRenderer(parent, data, graph).render();
    }
    finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
    // Adds a button to execute the layout
    var parent = graph.getDefaultParent();
    layoutMgr.executeLayout(parent);
    new mxCircleLayout(graph).execute(graph.getDefaultParent());
    new mxParallelEdgeLayout(graph).execute(graph.getDefaultParent());

    return graph;
  };

  function createStyles(graph) {
    // Enables crisp rendering of rectangles in SVG
    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_ROUNDED] = false;
    style[mxConstants.STYLE_FONTCOLOR] = '#1d1b1b';
    style[mxConstants.STYLE_STROKECOLOR] = '#dadfe2';
    style[mxConstants.STYLE_FILLCOLOR] = '#f3f4f9';

    // create the suppliers cell
    style = mxUtils.clone(style);
    style[mxConstants.STYLE_FILLCOLOR] = 'transparent';
    style[mxConstants.STYLE_STROKECOLOR] = 'transparent';
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_PERIMETER] = mxConstants.PERIMETER_RECTANGLE;
    graph.getStylesheet().putCellStyle('suppliers', style);
    graph.getStylesheet().putCellStyle('inventoryContainer', style);

    // create the supplier cell
    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = 'mxgraph.lean_mapping.outside_sources';
    style[mxConstants.STYLE_FONTSIZE] = 15;
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_STROKECOLOR] = '#aaa';
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
    graph.getStylesheet().putCellStyle('supplier', style);

    style = mxUtils.clone(style);
    graph.getStylesheet().putCellStyle('factory', style);

    // create the process cell
    style = mxUtils.clone(graph.getStylesheet().getDefaultVertexStyle());
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_FONTSIZE] = 13;
    style[mxConstants.STYLE_STARTSIZE] = 20;
    style[mxConstants.STYLE_STROKECOLOR] = '#2f4be9';
    style[mxConstants.STYLE_FILLCOLOR] = '#4762f9';
    style[mxConstants.STYLE_FONTCOLOR] = 'white';
    graph.getStylesheet().putCellStyle('process', style);

    // create the style for the part cell
    style = mxUtils.clone(graph.getStylesheet().getDefaultVertexStyle());
    style[mxConstants.STYLE_STROKECOLOR] = '#2f4be9';
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_FONTCOLOR] = 'white';
    style[mxConstants.STYLE_STARTSIZE] = 25;
    style[mxConstants.STYLE_FONTSIZE] = 13;
    style[mxConstants.STYLE_FILLCOLOR] = '#4762f9';
    graph.getStylesheet().putCellStyle('part', style);

    // create the style for the capability cell
    style = mxUtils.clone(graph.getStylesheet().getDefaultVertexStyle());
    style[mxConstants.STYLE_STROKECOLOR] = '#666666';
    style[mxConstants.STYLE_FILLCOLOR] = '#bbb';
    style[mxConstants.STYLE_STROKEWIDTH] = 1.5;
    graph.getStylesheet().putCellStyle('capability', style);

    // Creates the default style for edges
    style = {};
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_ORTHOGONAL;
    style[mxConstants.STYLE_SHAPE] = 'flexArrow';
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
    style['width'] = 3;
    style['endSize'] = 4.5;
    style['endWidth'] = 11;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_STROKECOLOR] = "#43b9a4";
    style[mxConstants.STYLE_FILLCOLOR] = "#42dcc0";
    style[mxConstants.STYLE_FONTCOLOR] = "#446299";
    graph.getStylesheet().putDefaultEdgeStyle(style);
  }

  function loadLeanMappingShapes() {
    var req = mxUtils.load(require('../images/lean_mapping.xml'));
    var root = req.getDocumentElement();
    var prefix = root.getAttribute("name");
    var shape = root.firstChild;

    while (shape != null) {
      if (shape.nodeType == mxConstants.NODETYPE_ELEMENT) {
        var name = prefix + '.' + shape.getAttribute('name').replace(/ /g, '_');
        mxStencilRegistry.addStencil(name.toLowerCase(), new mxStencil(shape));
      }
      shape = shape.nextSibling;
    }
  }
}
