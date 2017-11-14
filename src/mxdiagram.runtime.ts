TW.Runtime.Widgets.mxdiagram = function() {
    let diagram;
    // the html is really simple. just a div acting as the container
    this.renderHtml = function() {
        return '<div class="widget-content widget-mxgraph"></div>';
    };

    this.afterRender = async function () {
        diagram = await import('./value_process/mxValueProcessDiagram');
    }

    this.updateProperty = async function (updatePropertyInfo) {
        this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawDataFromInvoke);
        switch (updatePropertyInfo.TargetProperty) {
            case 'ValueDiagram': 
                let graph = diagram.createValueProcessDiagram(this.jqElement[0], updatePropertyInfo.RawDataFromInvoke);
                if(this.getProperty('ShowTools') || this.getProperty('ShowOutline')) {
                    let mxGraphUtils = await import('./value_process/mxGraphUtils');   
                    if(this.getProperty('ShowTools')) {
                        mxGraphUtils.CreateGraphToolbar(graph);
                    } 
                    if(this.getProperty('ShowTools')) {
                        mxGraphUtils.CreateGraphOutline(graph);
                    } 
                }
            break;
        }
    }
}