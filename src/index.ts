let mxgraph = require("mxgraph")({
  mxImageBasePath: "./node_modules/mxgraph/javascript/src/images",
  mxBasePath: "./node_modules/mxgraph/javascript/src"
});
let mxGraph = mxgraph.mxGraph,
  mxShape = mxgraph.mxShape,
  mxConnectionConstraint = mxgraph.mxConnectionConstraint,
  mxPoint = mxgraph.mxPoint,
  mxPolyline = mxgraph.mxPolyline,
  mxEvent = mxgraph.mxEvent,
  mxRubberband = mxgraph.mxRubberband,
  myCellState = mxgraph.mxCellState,
  mxClient = mxgraph.mxClient,
  mxUtils = mxgraph.mxUtils,
  mxCellTracker = mxgraph.mxCellTracker,
  mxFastOrganicLayout = mxgraph.mxFastOrganicLayout,
  mxStackLayout = mxgraph.mxStackLayout,
  mxLayoutManager = mxgraph.mxLayoutManager,
  mxConstants = mxgraph.mxConstants,
  mxEdgeStyle = mxgraph.mxEdgeStyle;

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
      new mxCellTracker(graph);
      // Enables crisp rendering of rectangles in SVG
      mxConstants.ENTITY_SEGMENT = 20;
      var style = graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
      style[mxConstants.STYLE_ROUNDED] = true;

      style = graph.getStylesheet().getDefaultVertexStyle();
      style[mxConstants.STYLE_FILLCOLOR] = '#ffffff';
      style[mxConstants.STYLE_SHAPE] = 'swimlane';
      style[mxConstants.STYLE_STARTSIZE] = 30;

      style = [];
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
      style[mxConstants.STYLE_STROKECOLOR] = 'none';
      style[mxConstants.STYLE_FILLCOLOR] = 'none';
      style[mxConstants.STYLE_FOLDABLE] = false;
      graph.getStylesheet().putCellStyle('column', style);
      // Installs a custom tooltip for cells
      graph.getTooltipForCell = function (cell) {
        return 'Doubleclick and right- or shiftclick';
      }
      graph.collapseToPreferredSize = false;
      graph.constrainChildren = false;
      graph.cellsSelectable = false;
      graph.extendParentsOnAdd = false;
      graph.extendParents = false;
      graph.border = 10;
      // Returns a HTML representation of the cell where the
      // upper half is the first value, lower half is second
      // value
      // Installs auto layout for all levels
      var layout = new mxStackLayout(graph, true);
      layout.border = graph.border;
      var layoutMgr = new mxLayoutManager(graph);
      layoutMgr.getLayout = function (cell) {
        if (!cell.collapsed) {
          if (cell.parent != graph.model.root) {
            layout.resizeParent = true;
            layout.horizontal = false;
            layout.spacing = 10;
          }
          else {
            layout.resizeParent = true;
            layout.horizontal = true;
            layout.spacing = 40;
          }

          return layout;
        }

        return null;
      };

      graph.getLabel = function (cell) {
        if (cell.isVertex()) {
          var table = document.createElement('table');
          table.style.height = '100%';
          table.style.width = '100%';

          var body = document.createElement('tbody');
          var tr1 = document.createElement('tr');
          var td1 = document.createElement('td');
          td1.style.textAlign = 'center';
          td1.style.fontSize = '12px';
          td1.style.color = '#774400';
          mxUtils.write(td1, cell.value.first || cell.value);

          var tr2 = document.createElement('tr');
          var td2 = document.createElement('td');
          td2.style.textAlign = 'center';
          td2.style.fontSize = '12px';
          td2.style.color = '#774400';
          mxUtils.write(td2, cell.value.second || cell.value);

          tr1.appendChild(td1);
          tr2.appendChild(td2);
          body.appendChild(tr1);
          body.appendChild(tr2);
          table.appendChild(body);

          return table;
        }
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
        var col1 = graph.insertVertex(parent, null, '', 0, 0, 120, 0, 'column');

        var v1 = graph.insertVertex(col1, null, '1', 0, 0, 100, 30);
        // v1.collapsed = true;

        var v11 = graph.insertVertex(v1, null, '1.1', 0, 0, 80, 30);
        v11.collapsed = true;

        var v111 = graph.insertVertex(v11, null, '1.1.1', 0, 0, 60, 30);
        var v112 = graph.insertVertex(v11, null, '1.1.2', 0, 0, 60, 30);

        var v12 = graph.insertVertex(v1, null, '1.2', 0, 0, 80, 30);

        var col2 = graph.insertVertex(parent, null, '', 0, 0, 120, 0, 'column');

        var v2 = graph.insertVertex(col2, null, '2', 0, 0, 100, 30);
        v2.collapsed = true;

        var v21 = graph.insertVertex(v2, null, '2.1', 0, 0, 80, 30);
        v21.collapsed = true;

        var v211 = graph.insertVertex(v21, null, '2.1.1', 0, 0, 60, 30);
        var v212 = graph.insertVertex(v21, null, '2.1.2', 0, 0, 60, 30);

        var v22 = graph.insertVertex(v2, null, '2.2', 0, 0, 80, 30);

        var v3 = graph.insertVertex(col2, null, '3', 0, 0, 100, 30);
        // v3.collapsed = true;

        var v31 = graph.insertVertex(v3, null, '3.1', 0, 0, 80, 30);
        v31.collapsed = true;

        var v311 = graph.insertVertex(v31, null, '3.1.1', 0, 0, 60, 30);
        var v312 = graph.insertVertex(v31, null, '3.1.2', 0, 0, 60, 30);

        var v32 = graph.insertVertex(v3, null, '3.2', 0, 0, 80, 30);

        graph.insertEdge(parent, null, '', v111, v211);
        graph.insertEdge(parent, null, '', v112, v212);
        graph.insertEdge(parent, null, '', v112, v22);

        graph.insertEdge(parent, null, '', v12, v311);
        graph.insertEdge(parent, null, '', v12, v312);
        graph.insertEdge(parent, null, '', v12, v32);
      }
      finally {
        // Updates the display
        graph.getModel().endUpdate();
      }
    }
  };


  main(document.getElementById('graphContainer'));
};
