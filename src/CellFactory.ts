import { mxgraph } from "./mxGraphImport"
import { mxValueProcessLayout } from "./mxValueProcessLayout"

let mxStackLayout = mxgraph.mxStackLayout;

interface CellRendererConstructor {
    new(): CellRendererAbstract;
}

class LayoutFactory {
    static defaultLayout;
    static supplierLayout;
    static partLayout;
    static allSuppliersLayout;
    static hallInventoryLayout;
    static processLayout;

    public static initialize = function (graph) {
        LayoutFactory.defaultLayout = new mxValueProcessLayout(graph, false);
        LayoutFactory.defaultLayout.resizeParent = true;
        LayoutFactory.defaultLayout.border = 1;
        LayoutFactory.defaultLayout.horizontal = true;
        LayoutFactory.defaultLayout.spacing = 50;
        LayoutFactory.defaultLayout.resizeParent = true;

        LayoutFactory.supplierLayout = new mxValueProcessLayout(graph, true);
        LayoutFactory.supplierLayout.resizeParent = true;
        LayoutFactory.supplierLayout.spacing = 20;
        LayoutFactory.supplierLayout.marginTop = 80;
        LayoutFactory.supplierLayout.marginBottom = 20;
        LayoutFactory.supplierLayout.marginLeft = 10;

        LayoutFactory.partLayout = new mxValueProcessLayout(graph, false);
        LayoutFactory.partLayout.resizeParent = true;
        LayoutFactory.partLayout.fill = true;
        LayoutFactory.partLayout.fillSpacing = 5;                
        
        LayoutFactory.allSuppliersLayout = new mxValueProcessLayout(graph, false);
        LayoutFactory.allSuppliersLayout.resizeParent = true;
        LayoutFactory.allSuppliersLayout.spacing = 20;

        LayoutFactory.hallInventoryLayout = new mxValueProcessLayout(graph, false);
        LayoutFactory.hallInventoryLayout.resizeParent = true;
        LayoutFactory.hallInventoryLayout.spacing = 20;

        LayoutFactory.processLayout = new mxValueProcessLayout(graph, true);
        LayoutFactory.processLayout.resizeParent = true;
        LayoutFactory.processLayout.spacing = 10;
        LayoutFactory.processLayout.marginTop = 5;
        LayoutFactory.processLayout.marginBottom = 5;
        LayoutFactory.processLayout.marginLeft = 5;        
        
    }

}


/**
 * A abstract cell renderer. This is responsible for rendering the label, and tooltip of a cell
 */
abstract class CellRendererAbstract {
    getRenderedLabel(cell: any): HTMLElement { return; };

    getTooltip(cell: any): String { return; }

    isLabelClipped(cell: any): boolean { return false; }

    isCellFoldable(cell: any): boolean { return true; }

    getLayout(cell: any): any { return LayoutFactory.defaultLayout };

    isCellSelectable(cell: any): boolean { return true }
}

class PartRenderer extends CellRendererAbstract {
    cell: any;
    /**
     * Renderer of a cell that represents a part. Just return the title
     */
    getRenderedLabel(cell: any): any {
        return cell.value.title;
    };

    /**
     * The tooltip is just the title of the part
     */
    getTooltip(cell: any): String {
        return cell.value.title;
    }

    isLabelClipped(cell: any): boolean { return true; }

    isCellFoldable(cell: any): boolean { return true; }

    getLayout(cell: any): any { return LayoutFactory.partLayout }

    isCellSelectable(cell: any): boolean { return true; }

}
/**
 * Renderer of a supplier cell
 * At the moment this is rendererd as a swimlane cell with only the title
 */
class SupplierCellRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): HTMLElement {
        return cell.value.name;
    }

    getTooltip(cell: any): String {
        return cell.value.name;
    }

    isLabelClipped(cell: any): boolean { return true; }

    isCellFoldable(cell: any): boolean { return true; }

    getLayout(cell: any): any { return LayoutFactory.supplierLayout }

    isCellSelectable(cell: any): boolean { return true; }

}

/**
 * The default process renderer. Just returns the value of the cell
 */
class ProcessCellRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): HTMLElement {
        return cell.value.name;
    }

    getTooltip(cell: any): String {
        return cell.value.name;
    }

    isLabelClipped(cell: any): boolean { return false; }

    isCellFoldable(cell: any): boolean { return true; }

    getLayout(cell: any): any { return LayoutFactory.processLayout }

    isCellSelectable(cell: any): boolean { return true; }

}

/**
 * The default cell renderer. Just returns the value of the cell
 */
class DefaultVertexRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): HTMLElement {
        return cell.value;
    }

    getTooltip(cell: any): String {
        return "";
    }

    isLabelClipped(cell: any): boolean { return false; }

    isCellFoldable(cell: any): boolean { return false; }

    getLayout(cell: any): any { return LayoutFactory.defaultLayout }

    isCellSelectable(cell: any): boolean { return true; }

}

/**
 * The default edge renderer.
 */
class DefaultEdgeRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): HTMLElement {
        let content = document.createElement('div');
        content.style.height = '100%';
        content.style.width = '100%';
        content.textContent = cell.value ? cell.value.label : "";
        let image = document.createElement('img');
        image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Linecons_small-truck.svg/2000px-Linecons_small-truck.svg.png'
        image.style.width = '25px';
        image.style.height = '25px';
        content.appendChild(image);
        return content;
    }

    getTooltip(cell: any): String {
        return "";
    }

    isLabelClipped(cell: any): boolean { return false; }

    isCellFoldable(cell: any): boolean { return false; }

    isCellSelectable(cell: any): boolean { return true; }

}

class AllSupplierCell {
    getRenderedLabel(cell: any): HTMLElement { return; };

    getTooltip(cell: any): String { return; }

    isLabelClipped(cell: any): boolean { return false; }

    isCellFoldable(cell: any): boolean { return false; }

    getLayout(cell: any): any { return LayoutFactory.allSuppliersLayout }

    isCellSelectable(cell: any): boolean { return false; }
}

class PartDetailsCell {
    getRenderedLabel(cell: any): any { 
        return cell.value.key + ": " + cell.value.value;
    };

    getTooltip(cell: any): String { return cell.value; }

    isLabelClipped(cell: any): boolean { return false; }

    isCellFoldable(cell: any): boolean { return false; }

    getLayout(cell: any): any { return LayoutFactory.defaultLayout }

    isCellSelectable(cell: any): boolean { return false; }

}


class HallInventoryCell {
    getRenderedLabel(cell: any): HTMLElement { return undefined; };

    getTooltip(cell: any): String { return cell.value; }

    isLabelClipped(cell: any): boolean { return false; }

    isCellFoldable(cell: any): boolean { return false; }

    getLayout(cell: any): any { return LayoutFactory.hallInventoryLayout }

    isCellSelectable(cell: any): boolean { return false; }

}

/**
 * Factory method for getting renderer methods for cell
 */
export class GraphCellRenderer {
    private mapping: { [name: string]: CellRendererConstructor } = {
        "part": PartRenderer,
        "supplier": SupplierCellRenderer,
        "defaultVertex": DefaultVertexRenderer,
        "defaultEdge": DefaultEdgeRenderer,
        "suppliers": AllSupplierCell,
        "partDetails": PartDetailsCell,
        "inventoryContainer": HallInventoryCell,
        "process": ProcessCellRenderer
    }

    constructor(graph) {
        LayoutFactory.initialize(graph);
    }

    private getRendererForCell(cell: any): CellRendererConstructor {
        if (cell && this.mapping[cell.style]) {
            return this.mapping[cell.style];
        } else {
            if (cell.isVertex()) {
                return this.mapping["defaultVertex"];
            } else {
                return this.mapping["defaultEdge"];
            }

        }
    }

    public getCellLabel = (cell) => {
        let cellRenderer = this.getRendererForCell(cell);
        return new cellRenderer().getRenderedLabel(cell);
    }
    public getCellTooltip = (cell) => {
        let cellRenderer = this.getRendererForCell(cell);
        return new cellRenderer().getTooltip(cell);
    }

    public isLabelClipped = (cell) => {
        let cellRenderer = this.getRendererForCell(cell);
        return new cellRenderer().isLabelClipped(cell);
    }

    public isCellFoldable = (cell) => {
        let cellRenderer = this.getRendererForCell(cell);
        return new cellRenderer().isCellFoldable(cell);
    }

    public getLayout = (cell) => {
        let cellRenderer = this.getRendererForCell(cell);
        return new cellRenderer().getLayout(cell);
    }

    public isCellSelectable = (cell) => {
        let cellRenderer = this.getRendererForCell(cell);
        return new cellRenderer().isCellSelectable(cell);
    }
}
