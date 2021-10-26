TW.Runtime.Widgets.mxdiagram = function () {
    let valueProcessDiagramLoader, xmlDiagramLoader;
    // a list of resources that are hold by the current graph
    let currentGraphResources = [];
    let resizeInterval;

    this.initializeResponsiveContainer = function (element: HTMLElement) {
        // whenever the element resizes, we must be responsive.
        // so watch for element resizes via an interval
        function onResize(element, callback) {
            let height = element.clientHeight;
            let width = element.clientWidth;

            return setInterval(() => {
                if (element.clientHeight != height || element.clientWidth != width) {
                    height = element.clientHeight;
                    width = element.clientWidth;
                    callback();
                }
            }, 500);
        }
        resizeInterval = onResize(element, () => {
            if (this.graph) {
                this.graph.doResizeContainer(element.clientWidth, element.clientHeight);
                this.graph.fit();
            }
        });
    }
    this.renderHtml = function () {
        return '<div class="widget-content widget-mxgraph"></div>';
    };

    this.runtimeProperties = function () {
        return {
            needsDataLoadingAndError: true,
        };
    }

    this.afterRender = async function () {
        this.boundingBox.css({ width: "100%", height: "100%" });
        this.mxGraphNamespace = await import("./generic/mxGraphImport");
        this.mxGraphUtils = await import('./generic/mxGraphUtils');
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
                    this.getProperty("CustomShapesXMLPath"), this.getProperty("AutoLayout"), this.getProperty("EdgeStyleValue"));
                this.setNewActiveGraph(currentGraph);
                break;
            }
            case 'JSONArrayGraphCells': {
                if (this.graph == null) {
                    break;
                }

                var data = updatePropertyInfo.SinglePropertyValue;
                var graphCells = JSON.parse(updatePropertyInfo.RawSinglePropertyValue);

                for (var i = 0; i < graphCells.length; i++) {
                    var cellId = graphCells[i].id;
                    var value = graphCells[i].value;
                    var fillColor = graphCells[i].fillColor;
                    var strokeColor = graphCells[i].strokeColor;

                    var cell = this.getGraphCell(this.graph.getModel().cells, cellId);
                    cell.value.setAttribute("label", value);
                    var style = cell.getStyle();
                    this.setCellColor(cell, fillColor, "fillColor");
                    this.setCellColor(cell, strokeColor, "strokeColor");

                    this.graph.refresh(cell);
                }

                break;
            }
        }
    }

    this.setCellColor = function (cell, color, colorType) {
         var style = cell.getStyle();
        let newStyle:string;
        
        //there is a posibility that the style of the element does not contain any color information.
        //1. When the style contains color information
        if (style.indexOf(colorType + "=")!=-1)
        {
        var styleBeforeColor = style.substring(0, style.indexOf(colorType + "=") + (colorType + "=").length);
        var styleAfterColor = style.substring(style.indexOf(colorType + "=") + (colorType + "=").length + color.length, style.length);
        newStyle = styleBeforeColor + color + styleAfterColor;
        }
        //2. When the style does not contain color information
        else{
             newStyle = style+";"+colorType+"="+color;    
        }
        cell.setStyle(newStyle);
    }

    this.getGraphCell = function (cells, cellId) {
        var foundCell;
        for (const cellIterator in cells) {
            if (cells.hasOwnProperty(cellIterator)) {
                const cell = cells[cellIterator];
                if (cell.value != undefined && cell.value.getAttribute && cell.value.getAttribute("customId") == cellId) {
                    foundCell = cell;
                    break;
                }
            }
        }
        if(!foundCell) {
            foundCell = cells[cellId]
        }

        return foundCell;

    }

    this.graphChanged = function (graph) {
        // empty function be overriden when in a script for example
    }

    this.setNewActiveGraph = function (newGraph) {
        this.graph = newGraph;
        this.initializeEventListener(newGraph);
        currentGraphResources.push(newGraph);
        if (this.mxGraphUtils && this.getProperty('ShowTools')) {
            currentGraphResources.push(this.mxGraphUtils.CreateGraphToolbar(newGraph));
        }
        if (this.mxGraphUtils && this.getProperty('ShowOutline')) {
            currentGraphResources.push(this.mxGraphUtils.CreateGraphOutline(newGraph));
        }
        if (this.mxGraphUtils) {
            this.setProperty("XMLDiagram", this.mxGraphUtils.exportGraphAsXml(newGraph));
        }
        if (this.getProperty("AutoFit")) {
            this.graph.fit();
            this.initializeResponsiveContainer(this.boundingBox[0]);
        }
        this.graphChanged(newGraph);
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
            var cells = evt.getProperty('removed') || [];

            for (var i = 0; i < cells.length; i++) {

                var cell = cells[i];

                if (cell) {
                    if (cell.value && cell.value.getAttribute) {
                        thisWidget.setProperty("SelectedCellId", cell.value.getAttribute("customId"));
                        thisWidget.jqElement.triggerHandler('SelectedCellChanged');
                    } else {
                        thisWidget.setProperty("SelectedCellId", cell.id);
                        thisWidget.jqElement.triggerHandler('SelectedCellChanged');
                    }
                }
            }

        });

        graph.addListener('doubleClick', function (sender, evt) {
            var cell = evt.getProperty('cell');
            if (cell) {
                if (cell.value && cell.value.getAttribute) {
                    thisWidget.setProperty("SelectedCellId", cell.value.getAttribute("customId"));
                    thisWidget.jqElement.triggerHandler('CellDoubleClicked');
                } else {
                    thisWidget.setProperty("SelectedCellId", cell.id);
                    thisWidget.jqElement.triggerHandler('CellDoubleClicked');
                }
            }
        });
    }

    this.serviceInvoked = function (serviceName) {
        if (serviceName == "GenerateXML") {
            this.setProperty("XMLDiagram", this.mxGraphUtils.exportGraphAsXml(this.graph));
        }
    }
    this.resetCurrentGraph = function () {
        for (const object of currentGraphResources) {
            object.destroy();
        }
    }

    this.beforeDestroy = function () {
        clearInterval(resizeInterval);
        this.resetCurrentGraph();
    }
}
