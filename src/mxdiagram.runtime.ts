TW.Runtime.Widgets.mxdiagram = function() {
    let valueProcessDiagramLoader, mxGraphUtils;
    // a list of resources that are hold by the current graph
    let currentGraphResources = [];
    // the html is really simple. just a div acting as the container
    this.renderHtml = function() {
        return '<div class="widget-content widget-mxgraph"></div>';
    };

    this.afterRender = async function () {
        valueProcessDiagramLoader = await import('./value_process/mxValueProcessDiagram');
        if(this.getProperty('ShowTools') || this.getProperty('ShowOutline')) {
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
                if(this.getProperty('ShowTools')) {
                    currentGraphResources.push(mxGraphUtils.CreateGraphToolbar(currentGraph));
                } 
                if(this.getProperty('ShowTools')) {
                    currentGraphResources.push(mxGraphUtils.CreateGraphOutline(currentGraph));
                }
                currentGraphResources.push(currentGraph);
            break;
        }
    }

    this.resetCurrentGraph = function () {
        for (const object of currentGraphResources) {
            object.destroy();
        }
    }
}