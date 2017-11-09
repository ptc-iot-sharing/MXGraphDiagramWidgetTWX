import { mxgraph } from "./mxGraphImport"
import "./FlexArrowShape";
import "./mxLeanMap";
import { GraphCellRenderer } from './CellFactory'

import { dataModel } from './dataExample'

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
  mxCircleLayout = mxgraph.mxCircleLayout,
  mxStencilRegistry = mxgraph.mxStencilRegistry,
  mxStencil = mxgraph.mxStencil;


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
      loadLeanMappingShapes();
      // Creates the graph inside the given container
      var graph = new mxGraph(container);
      container.style.background = 'url("node_modules/mxgraph/javascript/examples/editors/images/grid.gif")';
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
      graph.setCellsEditable(false);
      graph.setDropEnabled(false);
      graph.setSplitEnabled(false);
      // don't allow cells to be dropped outside of their current parent
      graph.graphHandler.removeCellsFromParent = false;
      // when a cells is collapsed, recalculate its preferred size
      graph.collapseToPreferredSize = true;
      // cells should not be bigger than their parents
      graph.constrainChildren = true;
      graph.extendParentsOnAdd = true;
      graph.extendParents = true;
      // disable the grid so things are more condensed
      graph.gridEnabled = false;
      // allow selection of cells
      graph.cellsSelectable = true;
      graph.border = 10;

      // create the styles used in the graph
      createStyles(graph);

      // construct the graph renderer that will allow us render each type of cells
      let graphRenderer = new GraphCellRenderer(graph);

      // allow highlighting of cells on mouse over
      new mxCellTracker(graph, '#00FF00', function (me) {
        let cell = me.getCell();
        let excludedStyles = ["suppliers", "partDetails"];
        if (cell && excludedStyles.indexOf(cell.style) >= 0) {
          return null;
        } else {
          return cell;
        }
      });

      // Installs a custom tooltip for cells
      graph.getTooltipForCell = graphRenderer.getCellTooltip;
      graph.isLabelClipped = graphRenderer.isLabelClipped;

      // Make sure the cells can be folded
      graph.isCellFoldable = graphRenderer.isCellFoldable;

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
      // set a prefix for the generated ids so they do not conflict with our set ones
      graph.getModel().prefix = "autoGenerated";
      // Adds cells to the model in a single step
      graph.getModel().beginUpdate();
      try {
        // begin rendering the datamodel
        // render the suppliers
        let suppliersParent = graph.insertVertex(parent, null, null, 0, 0, 1800, 1800, 'suppliers');
        for (let i = 0; i < dataModel.suppliers.length; i++) {
          let supplier = dataModel.suppliers[i];
          let supplierNode = graph.insertVertex(suppliersParent, supplier.id, supplier, 0, 0, 400, 300, 'supplier');
          // now iterate through the parts and add them 
          for (let j = 0; j < supplier.parts.length; j++) {
            let part = supplier.parts[j];
            // first add the part node
            let partNode = graph.insertVertex(supplierNode, part.id, part, 0, 0, 10, 300, 'part');
            // then add the title of the part
            graph.insertVertex(partNode, null, {key: "name", value: part.title}, 0, 0, 200, 20, "partDetails");
            for (let key in part) {
              // and finally all of the details
              if (part.hasOwnProperty(key) && key != 'id' && key != 'title') {
                graph.insertVertex(partNode, null, {key: key, value: part[key]}, 0, 0, 200, 20, "partDetails");
              }
            }
          }
        }
        graph.cellSizeUpdated(suppliersParent, false);
        // reuse the suppliers style for the logistics centers as well
        let logisticCentersParent = graph.insertVertex(parent, null, null, 0, 0, 100, 300, 'suppliers');
        for (let i = 0; i < dataModel.logisticsCenters.length; i++) {
          let logisticCenter = dataModel.logisticsCenters[i];
          let logisticNode = graph.insertVertex(logisticCentersParent, logisticCenter.id, logisticCenter, 0, 0, 10, 300, 'supplier');
          // now iterate through the parts and add them 
          for (let j = 0; j < logisticCenter.capabilities.length; j++) {
            let capability = logisticCenter.capabilities[j];

            switch (capability.type) {
              case 'forklift':
                graph.insertVertex(logisticNode, null, null, 0, 0, 200, 20, "shape=mxgraph.lean_mapping.move_by_forklift");
                break;
              case 'part':
                // first add the part node
                let partNode = graph.insertVertex(logisticNode, null, capability, 0, 0, 200, 300, 'part');
                // then add the title of the part
                for (let key in capability) {
                  // and finally all of the details
                  if (capability.hasOwnProperty(key) && key != 'id' && key != 'title') {
                    graph.insertVertex(partNode, null, key + ":" + capability[key], 0, 0, 200, 20, "partDetails");
                  }
                }
                break;
              case 'process':
                //TODO: implement process 
                graph.insertVertex(logisticNode, null, null, 0, 0, 200, 20, "shape=mxgraph.lean_mapping.manufacturing_process");
              default:
                break;
            }

          }

        }
        // reuse the suppliers style for the logistics centers as well
        let factoryNode = graph.insertVertex(parent, null, null, 0, 0, 10, 300, 'suppliers');
        for (let i = 0; i < dataModel.factory.halls.length; i++) {
          let factoryHall = dataModel.factory.halls[i];
          let hallNode = graph.insertVertex(factoryNode, factoryHall.id, factoryHall, 0, 0, 10, 300, 'supplier');
          let inventoryNode = graph.insertVertex(hallNode, null, null, 0, 0, 0, 0, 'inventoryContainer');
          // now iterate through the parts and add them 
          for (let j = 0; j < factoryHall.inventories.length; j++) {
            let inventory = factoryHall.inventories[j];
            // first add the part node
            let partNode = graph.insertVertex(inventoryNode, null, inventory, 0, 0, 200, 300, 'part');
            // then add the title of the part
            for (let key in inventory.info) {
              // and finally all of the details
              if (inventory.hasOwnProperty(key) && key != 'id' && key != 'title') {
                graph.insertVertex(partNode, null, key + ":" + inventory[key], 0, 0, 200, 20, "partDetails");
              }
            }
          }
          // now iterate through the parts and add them 
          for (let j = 0; j < factoryHall.capabilities.length; j++) {
            let capability = factoryHall.capabilities[j];

            switch (capability.type) {
              case 'forklift':
                graph.insertVertex(hallNode, null, null, 0, 0, 200, 20, "shape=mxgraph.lean_mapping.move_by_forklift");
                break;
              case 'part':
                // first add the part node
                let partNode = graph.insertVertex(hallNode, null, capability, 0, 0, 200, 300, 'part');
                // then add the title of the part
                for (let key in capability) {
                  // and finally all of the details
                  if (capability.hasOwnProperty(key) && key != 'id' && key != 'title') {
                    graph.insertVertex(partNode, null, key + ":" + capability[key], 0, 0, 200, 20, "partDetails");
                  }
                }
                break;
              case 'process':
                //TODO: implement process 
                graph.insertVertex(hallNode, null, null, 0, 0, 200, 20, "shape=mxgraph.lean_mapping.manufacturing_process");
              default:
                break;
            }
          }

        }
        // now add the edges
        for (let i = 0; i < dataModel.transportLinks.length; i++) {
          let edge = dataModel.transportLinks[i];
          let source = graph.getModel().getCell(edge.fromId);
          let target = graph.getModel().getCell(edge.toId);
          graph.insertEdge(parent, null, edge, source, target);
        }
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

    function createStyles(graph) {
      // Enables crisp rendering of rectangles in SVG
      var style = graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = false;

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
      style[mxConstants.STYLE_FONTSIZE] = 13;
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
      style[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_ORTHOGONAL;
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
    }

    function loadLeanMappingShapes() {
      var req = mxUtils.load('lean_mapping.xml');
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


  main(document.getElementById('graphContainer'));
};
