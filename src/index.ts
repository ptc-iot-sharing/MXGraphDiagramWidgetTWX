import { mxgraph } from "./mxGraphImport"
import "./FlexArrowShape";
import { GraphCellRenderer } from './CellRenderer'

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
  mxWindow = mxgraph.mxWindow;

let mxCellRenderer = mxgraph.mxCellRenderer;

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
      graph.collapseToPreferredSize = false;
      graph.constrainChildren = false;
      graph.cellsSelectable = true;
      graph.extendParentsOnAdd = false;
      graph.extendParents = false;
      graph.border = 10;
      graph.setAutoSizeCells(true);

      let graphRenderer = new GraphCellRenderer();

      new mxCellTracker(graph);
      // Enables crisp rendering of rectangles in SVG
      var style = graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = false;

      // create the supplier cell
      style = mxUtils.clone(style);
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
      style[mxConstants.STYLE_FONTSIZE] = 13;
      style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
      style[mxConstants.STYLE_STARTSIZE] = 22;
      style[mxConstants.STYLE_HORIZONTAL] = false;
      style[mxConstants.STYLE_FONTCOLOR] = 'black';
      style[mxConstants.STYLE_STROKECOLOR] = 'black';
      style['html'] = 1
      graph.getStylesheet().putCellStyle('supplier', style);

      // create the style for the part cell
      style = mxUtils.clone(graph.getStylesheet().getDefaultEdgeStyle());
      style[mxConstants.STYLE_STROKECOLOR] = 'black';
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
      graph.getStylesheet().putCellStyle('part', style);
      // Creates the default style for edges
      style = {
        "endArrow": "block",
        "edgeStyle": mxEdgeStyle.ElbowConnector,
        "strokeColor": 'black',
        "shape": "flexArrow",
        "fillColor": "#B3FF66",
        "width": "4",
        "endSize": "4.42",
        "endWidth": "11",
      };
      graph.getStylesheet().putDefaultEdgeStyle(style);
      // Installs a custom tooltip for cells
      graph.getTooltipForCell = graphRenderer.getCellTooltip;
      graph.isLabelClipped = graphRenderer.isLabelClipped;

      // Installs auto layout for all levels
      var layout = new mxStackLayout(graph, true);
      layout.resizeParent = true;

      layout.border = graph.border;
      var layoutMgr = new mxLayoutManager(graph);
      layoutMgr.getLayout = function (cell) {
        if (!cell.collapsed) {
          if (cell.parent != graph.model.root) {
            layout.resizeParent = true;
            layout.horizontal = true;
            layout.spacing = 40;
          }
          else {
            layout.resizeParent = true;
            layout.horizontal = false;
            layout.spacing = 40;
          }

          return layout;
        }

        return null;
      };
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

      // Enables rubberband selection
      new mxRubberband(graph);

      // Adds a button to execute the layout
      document.body.appendChild(mxUtils.button('Arrange', function (evt) {
        var parent = graph.getDefaultParent();
        layout.execute(parent);
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
        var supplier1 = graph.insertVertex(parent, null, 'Industrialesud GmbH / Landau / DE', 0, 0, 400, 250, 'supplier');

        var v1 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G30//F34/F36 H50' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        supplier1.geometry.alternateBounds = new mxRectangle(0, 0, 300, 30);

        var v2 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel F34/F36/G30/G22/G82 H50' }, 0, 0, 200, 220, 'part');
        v1.collapsed = false;
        var supplier1 = graph.insertVertex(parent, null, 'Grupo Antolin Bohema A.S.  / Liberec / CZ / G31/ G32', 0, 0, 400, 250, 'supplier');
        var t = v1;
        var v22 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G31 / G32' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        graph.insertEdge(parent, null, 'test', v1, v22);
        graph.insertEdge(parent, null, 'test', v2, v22);

        var supplier1 = graph.insertVertex(parent, null, 'Industrialesud GmbH / Landau / DE', 0, 0, 400, 250, 'supplier');

        var v1 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G30//F34/F36 H50' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        var v2 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel F34/F36/G30/G22/G82 H50' }, 0, 0, 200, 220, 'part');
        v1.collapsed = false;
        var supplier1 = graph.insertVertex(parent, null, 'Grupo Antolin Bohema A.S.  / Liberec / CZ / G31/ G32', 0, 0, 400, 250, 'supplier');

        var v22 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G31 / G32' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        graph.insertEdge(parent, null, 'test', v1, v22);
        graph.insertEdge(parent, null, 'test', v2, t);

        var supplier1 = graph.insertVertex(parent, null, 'Industrialesud GmbH / Landau / DE', 0, 0, 400, 250, 'supplier');

        var v1 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G30//F34/F36 H50' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        var v2 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel F34/F36/G30/G22/G82 H50' }, 0, 0, 200, 220, 'part');
        v1.collapsed = false;
        var supplier1 = graph.insertVertex(parent, null, 'Grupo Antolin Bohema A.S.  / Liberec / CZ / G31/ G32', 0, 0, 400, 250, 'supplier');

        var v22 = graph.insertVertex(supplier1, null, { data: data, title: 'Himmel G31 / G32' }, 0, 0, 200, 220, "part");
        v1.collapsed = false;
        graph.insertEdge(parent, null, 'test', v1, v22);
        graph.insertEdge(parent, null, 'test', v2, t);
      }
      finally {
        // Updates the display
        graph.getModel().endUpdate();
      }
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
      graph.zoomActual()
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
