TW.Runtime.Widgets.mxdiagram = function() {
    // the html is really simple. Just a ccanvas
    this.renderHtml = function() {
        return '<div class="widget-content widget-mxgraph"></div>';
    };

    this.afterRender = async function () {
        let data = await import('./value_process/dataExample')
        let diagram = await import('./value_process/mxValueProcessDiagram');
        debugger
        diagram.createValueProcessDiagram(this.jqElement[0], data.dataModel);
    }
}