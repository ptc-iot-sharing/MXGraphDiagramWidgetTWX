TW.Runtime.Widgets.mxdiagram = function () {
    let valueProcessDiagramLoader, mxGraphUtils;
    // a list of resources that are hold by the current graph
    let currentGraphResources = [];
    // the html is really simple. just a div acting as the container
    this.renderHtml = function () {
        return '<div class="widget-content widget-mxgraph"></div>';
    };

    this.runtimeProperties  =  function  () {
        return  {
            needsDataLoadingAndError: true,
        };
    }

    this.afterRender = async function () {
        valueProcessDiagramLoader = await import('./value_process/mxValueProcessDiagram');
        if (this.getProperty('ShowTools') || this.getProperty('ShowOutline')) {
            mxGraphUtils = await import('./value_process/mxGraphUtils');
        }
    }

    this.updateProperty = async function (updatePropertyInfo) {
        this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawDataFromInvoke);
        switch (updatePropertyInfo.TargetProperty) {
            case 'ValueDiagram':
                this.resetCurrentGraph();
                let container = this.jqElement[0];
                let currentGraph = valueProcessDiagramLoader.createValueProcessDiagram(container, updatePropertyInfo.RawDataFromInvoke);
                this.initializeEventListener(currentGraph);
                if (this.getProperty('ShowTools')) {
                    currentGraphResources.push(mxGraphUtils.CreateGraphToolbar(currentGraph));
                }
                if (this.getProperty('ShowTools')) {
                    currentGraphResources.push(mxGraphUtils.CreateGraphOutline(currentGraph));
                }
                currentGraphResources.push(currentGraph);
                break;
        }
    }

    this.initializeEventListener = function (graph) {
        let thisWidget = this;
        graph.addListener('labelChanged', function(sender, evt)
        {
            let cell = evt.getProperty('cell');
            
            if (cell != null)
            {
                if(cell.value.id) {
                    thisWidget.setProperty("EditedCellId", cell.value.id + "-" + cell.value.key);
                } else {
                    thisWidget.setProperty("EditedCellId", cell.parent.value.id + "-" + cell.value.key);
                }
                thisWidget.setProperty("EditedCellNewLabel", cell.value.value);
                thisWidget.jqElement.triggerHandler('CellLabelChanged');
            }
        });
    }
    this.resetCurrentGraph = function () {
        for (const object of currentGraphResources) {
            object.destroy();
        }
    }
}