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
    static factoryLayout;

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

        LayoutFactory.factoryLayout = new mxValueProcessLayout(graph, false);
        LayoutFactory.factoryLayout.resizeParent = true;
        LayoutFactory.factoryLayout.spacing = 20;
        LayoutFactory.factoryLayout.marginTop = 80;
        LayoutFactory.factoryLayout.marginBottom = 20;
        LayoutFactory.factoryLayout.marginLeft = 10;

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
    getRenderedLabel(cell: any): string { return; };

    getTooltip(cell: any): String { return; }

    isLabelClipped(cell: any): boolean { return false; }

    isCellFoldable(cell: any): boolean { return true; }

    getLayout(cell: any): any { return LayoutFactory.defaultLayout };

    isCellSelectable(cell: any): boolean { return true }

    isCellEditable(cell: any): boolean { return false; }
}

class PartRenderer extends CellRendererAbstract {
    cell: any;
    /**
     * Renderer of a cell that represents a part. Just return the title
     */
    getRenderedLabel(cell: any): any {
        let link = document.createElement('a');
        link.href = cell.value.objectLink;
        link.textContent = cell.value.title;
        link.target = '_blank';
        link.style.color = 'white';
        return link.outerHTML;
    };

    /**
     * The tooltip is just the title of the part
     */
    getTooltip(cell: any): String {
        return cell.value.title;
    }

    isLabelClipped(cell: any): boolean { return true; }

    getLayout(cell: any): any { return LayoutFactory.partLayout }

}
/**
 * Renderer of a supplier cell
 * At the moment this is rendererd as a swimlane cell with only the title
 */
class SupplierCellRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): string {
        let link = document.createElement('a');
        link.href = cell.value.objectLink;
        link.textContent = cell.value.name;
        link.target = '_blank';
        return link.outerHTML;
    }

    getTooltip(cell: any): String {
        return cell.value.name;
    }

    isLabelClipped(cell: any): boolean { return true; }

    getLayout(cell: any): any { return LayoutFactory.supplierLayout }

}

/**
 * The default process renderer. Just returns the value of the cell
 */
class ProcessCellRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): string {
        return cell.value.name;
    }

    getTooltip(cell: any): String {
        return cell.value.name;
    }

    getLayout(cell: any): any { return LayoutFactory.processLayout }

}

/**
 * The default cell renderer. Just returns the value of the cell
 */
class DefaultVertexRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): string {
        return cell.value;
    }

    getTooltip(cell: any): String {
        return cell.value ? cell.value.tooltip : "";
    }

    isCellFoldable(cell: any): boolean { return false; }

}

/**
 * The default edge renderer.
 */
class DefaultEdgeRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): string {
        let content = document.createElement('div');
        content.classList.add("edgeLabelTruck");
        let link = document.createElement('a');
        link.href = cell.value ? cell.value.objectLink : "";
        link.textContent = cell.value ? cell.value.label : "";
        link.target = '_blank';
        content.appendChild(link);
        let image = document.createElement('img');
        image.src = require('../images/truckIcon.png');
        content.appendChild(image);
        if (cell.value && cell.value.info) {
            for (const key in cell.value.info) {
                if (cell.value.info.hasOwnProperty(key)) {
                    const element = cell.value.info[key];
                    let label = document.createElement("span");
                    label.textContent = key + ": " + cell.value.info[key];
                    content.appendChild(label);
                }
            }
        }
        return content.outerHTML;
    }

    getTooltip(cell: any): String {
        return "";
    }

    isCellFoldable(cell: any): boolean { return false; }

}

class AllSupplierCell extends CellRendererAbstract {
    getRenderedLabel(cell: any): string { return; };

    getTooltip(cell: any): String { return; }

    isCellFoldable(cell: any): boolean { return false; }

    getLayout(cell: any): any { return LayoutFactory.allSuppliersLayout }

    isCellSelectable(cell: any): boolean { return false; }
}

class PartDetailsCell extends CellRendererAbstract {
    getRenderedLabel(cell: any): any {
        let container = document.createElement('div');
        let keyElement = document.createElement('strong');
        keyElement.textContent = cell.value.key + ': ';
        container.appendChild(keyElement);
        let valueElement = document.createElement('span');
        valueElement.textContent = cell.value.value;
        container.appendChild(valueElement);
        return container.outerHTML;
    };

    getTooltip(cell: any): String { return cell.key + ": " + cell.value; }

    isCellFoldable(cell: any): boolean { return false; }

    isCellSelectable(cell: any): boolean { return false; }

    isCellEditable(cell: any): boolean {
        return cell.value.isEditable ? true : false;
    }
}


class HallInventoryCell extends CellRendererAbstract {
    getRenderedLabel(cell: any): string { return undefined; };

    getTooltip(cell: any): String { return cell.value; }

    isCellFoldable(cell: any): boolean { return false; }

    getLayout(cell: any): any { return LayoutFactory.hallInventoryLayout }

    isCellSelectable(cell: any): boolean { return false; }

}

class FactoryCellRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): string { return cell.value.name; };

    getTooltip(cell: any): String { return cell.value.name; }

    getLayout(cell: any): any { return LayoutFactory.factoryLayout }

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
        "factory": FactoryCellRenderer,
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

    public isCellEditable = (cell) => {
        let cellRenderer = this.getRendererForCell(cell);
        return new cellRenderer().isCellEditable(cell);
    }
}
