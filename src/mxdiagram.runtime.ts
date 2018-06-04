TW.Runtime.Widgets.mxdiagram = function () {
    let mxGraphNamespace, valueProcessDiagramLoader, mxGraphUtils, xmlDiagramLoader;
    // a list of resources that are hold by the current graph
    let currentGraphResources = [];
    // the html is really simple. just a div acting as the container
    let graph;

    this.renderHtml = function () {
        return '<div class="widget-content widget-mxgraph"></div>';
    };

    this.runtimeProperties = function () {
        return {
            needsDataLoadingAndError: true,
        };
    }

    this.afterRender = async function () {
        mxGraphNamespace = await import("./generic/mxGraphImport");
        mxGraphUtils = await import('./generic/mxGraphUtils');
    }

    this.updateProperty = async function (updatePropertyInfo) {
        this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawDataFromInvoke);
        switch (updatePropertyInfo.TargetProperty) {
            case 'ValueDiagram':
                if (!valueProcessDiagramLoader) {
                    valueProcessDiagramLoader = await import('./value_process/mxValueProcessDiagram');
                }
                this.resetCurrentGraph();
                let container = this.jqElement[0];
                let currentGraph = valueProcessDiagramLoader.createValueProcessDiagram(container, updatePropertyInfo.RawDataFromInvoke);
                this.setNewActiveGraph(currentGraph);
                break;
            case 'XMLDiagram': {
                if (!xmlDiagramLoader) {
                    xmlDiagramLoader = await import('./xml_codec/mxGraphXmlDiagram');
                }
                this.resetCurrentGraph();
                let container = this.jqElement[0];
                let currentGraph = xmlDiagramLoader.createGraphFromXML(container, updatePropertyInfo.SinglePropertyValue,
                    this.getProperty("CustomShapesXMLPath"), this.getProperty("AutoLayout"), this.getProperty("EdgeStyle"));
                graph = currentGraph;

                this.setNewActiveGraph(currentGraph);
                break;
            }
            case 'JSONArrayGraphCells': {
                if (graph == null) {
                    break;
                }

                var data = updatePropertyInfo.SinglePropertyValue;
                var graphCells = JSON.parse(updatePropertyInfo.RawSinglePropertyValue);

                for (var i = 0; i < graphCells.length; i++) {
                    var cellId = graphCells[i].id;
                    var value = graphCells[i].value;
                    var fillColor = graphCells[i].fillColor;
                    var strokeColor = graphCells[i].strokeColor;

                    var cell = this.getGraphCell(graph, cellId);
                    cell.value.setAttribute("label", value);
                    var style = cell.getStyle();
                    this.setCellColor(cell, fillColor, "fillColor");
                    this.setCellColor(cell, strokeColor, "strokeColor");

                    graph.refresh(cell);
                }

                break;
            }
        }
    }

    this.setCellColor = function (cell, color, colorType) {
        var style = cell.getStyle();
        var styleBeforeColor = style.substring(0, style.indexOf(colorType + "=") + (colorType + "=").length);
        var styleAfterColor = style.substring(style.indexOf(colorType + "=") + (colorType + "=").length + "#ffffff".length, style.length);
        var newStyle = styleBeforeColor + color + styleAfterColor;
        cell.setStyle(newStyle);
    }

    this.getGraphCell = function (parent, cellId) {

        var cells = [];
        if (parent.getChildCells) {
            cells = parent.getChildCells();
        } else if (parent.children) {
            cells = parent.children;
        }
        var foundCell;

        for (var i = 0; i < cells.length; i++) {
            if (cells[i].value != undefined && cells[i].value.getAttribute("customId") == cellId) {
                foundCell = cells[i];
                break;
            } else {
                if (foundCell == null) {
                    this.getGraphCell(cells[i], cellId);
                }
            }
        }

        return foundCell;

    }

    this.setNewActiveGraph = function (newGraph) {
        this.initializeEventListener(newGraph);
        currentGraphResources.push(newGraph);
        if (mxGraphUtils && this.getProperty('ShowTools')) {
            currentGraphResources.push(mxGraphUtils.CreateGraphToolbar(newGraph));
        }
        if (mxGraphUtils && this.getProperty('ShowOutline')) {
            currentGraphResources.push(mxGraphUtils.CreateGraphOutline(newGraph));
        }
        this.setProperty("XMLDiagram", mxGraphUtils.exportGraphAsXml(newGraph));
    };

    this.initializeEventListener = function (graph) {
        let thisWidget = this;
        graph.addListener('labelChanged', function (sender, evt) {
            let cell = evt.getProperty('cell');

            if (cell != null) {
                if (cell.value.id) {
                    thisWidget.setProperty("EditedCellId", cell.value.id + "-" + cell.value.key);
                } else {
                    thisWidget.setProperty("EditedCellId", cell.parent.value.id + "-" + cell.value.key);
                }
                thisWidget.setProperty("EditedCellNewLabel", cell.value.value);
                thisWidget.jqElement.triggerHandler('CellLabelChanged');

            }
        });

        graph.getSelectionModel().addListener('change', function (sender, evt) {
            var cells = evt.getProperty('removed');//.getProperty('added');

            for (var i = 0; i < cells.length; i++) {

                var cell = cells[i];

                if (cell != null && cell.value && cell.value.getAttribute) {
                    thisWidget.setProperty("SelectedCellId", cell.value.getAttribute("customId"));
                    thisWidget.jqElement.triggerHandler('SelectedCellChanged');
                }
            }

        });

        graph.addListener('doubleClick', function (sender, evt) {
            var cell = evt.getProperty('cell');
            if (cell && cell.value && cell.value.getAttribute) {
                thisWidget.setProperty("SelectedCellId", cell.value.getAttribute("customId"));
                thisWidget.jqElement.triggerHandler('CellDoubleClicked');
            }
        });
    }

    this.serviceInvoked = function (serviceName) {
        if (serviceName == "GenerateXML") {
            this.setProperty("XMLDiagram", mxGraphUtils.exportGraphAsXml(graph));
        } 
    }
    this.resetCurrentGraph = function () {
        for (const object of currentGraphResources) {
            object.destroy();
        }
    }

    this.beforeDestroy = function () {
        this.resetCurrentGraph();
    }
}