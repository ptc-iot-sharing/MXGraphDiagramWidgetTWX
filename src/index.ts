import { mxgraph } from "./mxGraphImport"
import "./FlexArrowShape";
import "./mxLeanMap";
import { GraphCellRenderer } from './CellFactory'

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
  mxOutline = mxgraph.mxOutline,
  mxEvent = mxgraph.mxEvent,
  mxToolbar = mxgraph.mxToolbar,
  mxPrintPreview = mxgraph.mxPrintPreview,
  mxWindow = mxgraph.mxWindow,
  mxParallelEdgeLayout = mxgraph.mxParallelEdgeLayout,
  mxCircleLayout = mxgraph.mxCircleLayout;

window.onload = function () {
  // Program starts here. Creates a sample graph in the
  // DOM node with the specified ID. This function is invoked
  // from the onLoad event handler of the document (see below).
  // Program starts here. Creates a sample graph in the
  // DOM node with the specified ID. This function is invoked
  // from the onLoad event handler of the document (see below).
  function main(container) {
    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error('Browser is not supported!', 200, false);
    }
    else {
      // Creates the graph inside the given container
      var graph = new mxGraph(container);
      container.style.background = 'url("node_modules/mxgraph/javascript/examples/editors/images/grid.gif")';
      // Enables tooltips, panning and resizing of the container
      graph.setPanning(true);
      graph.setResizeContainer(true);
      graph.setTooltips(true);
      // disable new connections and cloning cells, as well as drag and drop outside
      graph.setConnectable(false);
      graph.setCellsCloneable(false);
      graph.setCellsDeletable(false);
      graph.setCellsEditable(false);
      graph.setDropEnabled(false);
      graph.setSplitEnabled(false);
      graph.graphHandler.removeCellsFromParent = false;
      graph.collapseToPreferredSize = true;
      graph.constrainChildren = true;
      graph.cellsSelectable = true;
      graph.extendParentsOnAdd = true;
      graph.extendParents = true;
      graph.border = 10;
      graph.setAutoSizeCells(true);

      let graphRenderer = new GraphCellRenderer(graph);

      new mxCellTracker(graph);
      // Enables crisp rendering of rectangles in SVG
      var style = graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = false;

      // create the suppliers cell
      style = mxUtils.clone(style);
      style[mxConstants.STYLE_FILLCOLOR] = 'transparent';
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
      style[mxConstants.STYLE_PERIMETER] = mxConstants.PERIMETER_RECTANGLE;
      graph.getStylesheet().putCellStyle('suppliers', style);

      // create the supplier cell
      style = mxUtils.clone(style);
      style[mxConstants.STYLE_SHAPE] = 'mxgraph.lean_mapping.outside_sources';
      style[mxConstants.STYLE_FONTSIZE] = 13;
      //style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
      // style[mxConstants.STYLE_STARTSIZE] = 22;
      style[mxConstants.STYLE_FONTCOLOR] = 'black';
      style[mxConstants.STYLE_STROKECOLOR] = 'black';
      graph.getStylesheet().putCellStyle('supplier', style);

      // create the style for the part cell
      style = mxUtils.clone(graph.getStylesheet().getDefaultEdgeStyle());
      style[mxConstants.STYLE_STROKECOLOR] = 'black';
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
      style[mxConstants.STYLE_PERIMETER] = mxConstants.PERIMETER_RECTANGLE;
      graph.getStylesheet().putCellStyle('part', style);
      // Creates the default style for edges
      style = {};
      style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
      style[mxConstants.STYLE_SHAPE] = 'flexArrow';
      style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
      style['width'] = 3;
      style['endSize'] = 4.5;
      style['endWidth'] = 11;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
      style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
      style[mxConstants.STYLE_STROKECOLOR] = "#6482B9";
      style[mxConstants.STYLE_FILLCOLOR] = "#B3FF66";
      style[mxConstants.STYLE_FONTCOLOR] = "#446299";
      graph.getStylesheet().putDefaultEdgeStyle(style);
      // Installs a custom tooltip for cells
      graph.getTooltipForCell = graphRenderer.getCellTooltip;
      graph.isLabelClipped = graphRenderer.isLabelClipped;

      // Make sure the cells can be folded
      graph.isCellFoldable = graphRenderer.isCellFodable;

      // make sure some of the cells can be selected
      graph.isCellSelectable = graphRenderer.isCellSelectable;

      // Installs auto layout for all levels
      let layoutMgr = new mxLayoutManager(graph);
      layoutMgr.getLayout = graphRenderer.getLayout;

      // Returns a html representation of the cell
      graph.getLabel = graphRenderer.getCellLabel;
      // Extends mxGraphModel.getStyle to show an image when collapsed
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

      // Adds a button to execute the layout
      document.body.appendChild(mxUtils.button('Arrange', function (evt) {
        var parent = graph.getDefaultParent();
        layoutMgr.executeLayout(parent);
        new mxCircleLayout(graph).execute(graph.getDefaultParent());
        // new mxParallelEdgeLayout(graph).execute(graph.getDefaultParent());

      }));
      // Gets the default parent for inserting new cells. This
      // is normally the first child of the root (ie. layer 0).
      var parent = graph.getDefaultParent();

      // Adds cells to the model in a single step
      graph.getModel().beginUpdate();
      try {
        var data = {
          'PlantName': 'Industrialesud GmbH',
          'Lft-Nr+ZA': '151573-12',
          'Ort / Land': 'Landau / DE',
          'Produktion': undefined,
          'Sequenzprod.': 'ja',
          'Teilefamilie': undefined,
          'Name': 'Himmel',
          'Variantenzahl': 'G30/F90: 18; F34/F36: 132',
          'BehälterTyp': '3104026',
          'Füllgrad': '6'
        };
        var parent = graph.insertVertex(parent, null, null, 0, 0, 400, 500, 'suppliers');
        var parent2 = graph.insertVertex(graph.getDefaultParent(), null, null, 0, 0, 400, 500, 'suppliers');
        var supplier1 = graph.insertVertex(parent, null, 'Industrialesud GmbH / Landau / DE', 0, 0, 400, 300, 'supplier');
        var v1 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G30//F34/F36 H50' }, 0, 0, 200, 220, "part");
        var v2 = graph.insertVertex(v1, null, 'Himmel G30//F34/F36 H50', 0, 0, 200, 20, "partDetails");

        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            var v2 = graph.insertVertex(v1, null, key + ":" + data[key], 0, 0, 200, 20, "partDetails");
          }
        }
        supplier1.geometry.alternateBounds = new mxRectangle(0, 0, 300, 30);

        //var supplier1 = graph.insertVertex(parent2, null, 'Industrialesud GmbH / Landau / DE', 0, 0, 400, 300, 'shape=swimlane');
        //var supplier11 = supplier1;
        var v1 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G30//F34/F36 H50' }, 0, 0, 200, 220, "part");
        var v2 = graph.insertVertex(v1, null, 'Himmel G30//F34/F36 H50', 0, 0, 200, 20, "partDetails");

        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            var v2 = graph.insertVertex(v1, null, key + ":" + data[key], 0, 0, 200, 20, "partDetails");
          }
        }
        supplier1.geometry.alternateBounds = new mxRectangle(0, 0, 300, 30);
        graph.autoSizeCell(parent, true);
        graph.autoSizeCell(supplier1, true);
      }
      finally {
        // Updates the display
        graph.getModel().endUpdate();
      }
      graph.autoSizeCell(parent, true);
      createToolbar(graph);
      createOutlineView(graph);
    };

    function createOutlineView(graph) {
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
      let outlineWindow = new mxWindow('Outline', content, 200, 0, 200, 300, true);
      outlineWindow.setMaximizable(false);
      outlineWindow.setScrollable(false);
      outlineWindow.setResizable(true);
      outlineWindow.setVisible(true);
      outlineWindow.setClosable(true);
      // zoom actual to view the full chart
      graph.zoomActual();
    }

    function createToolbar(graph) {
      var content = document.createElement('div');
      content.style.padding = '4px';

      var tb = new mxToolbar(content);

      tb.addItem('Zoom In', 'images/zoom_in32.png', function (evt) {
        graph.zoomIn();
      });

      tb.addItem('Zoom Out', 'images/zoom_out32.png', function (evt) {
        graph.zoomOut();
      });

      tb.addItem('Actual Size', 'images/view_1_132.png', function (evt) {
        graph.zoomActual();
      });

      tb.addItem('Print', 'images/print32.png', function (evt) {
        var preview = new mxPrintPreview(graph, 1);
        preview.open();
      });
      tb.addItem('Show', 'images/print32.png', function (evt) {
        mxUtils.show(graph, null, 10, 10);
      });

      tb.addItem('Poster Print', 'images/press32.png', function (evt) {
        var pageCount = mxUtils.prompt('Enter maximum page count', '1');

        if (pageCount != null) {
          var scale = mxUtils.getScaleForPageCount(pageCount, graph);
          var preview = new mxPrintPreview(graph, scale);
          preview.open();
        }
      });

      let toolsWindow = new mxWindow('Tools', content, 0, 0, 200, 66, true);
      toolsWindow.setMaximizable(false);
      toolsWindow.setScrollable(false);
      toolsWindow.setResizable(false);
      toolsWindow.setVisible(true);
    }
  }


  main(document.getElementById('graphContainer'));
};
