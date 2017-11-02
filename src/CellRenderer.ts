import { mxgraph } from "./mxGraphImport"

interface CellRendererConstructor {
    new(): CellRendererAbstract;
}

/**
 * A abstract cell renderer. This is responsible for rendering the label, and tooltip of a cell
 */
abstract class CellRendererAbstract {
    getRenderedLabel(cell: any): HTMLElement { return; };

    getTooltip(cell: any): String { return; }

    isLabelClipped(cell: any) : boolean { return false;}
}

class PartRenderer extends CellRendererAbstract {
    cell: any;
    /**
     * Renderer of a cell that represents a part
     * It is rendered as a html table with all the data.
     */
    getRenderedLabel(cell: any): HTMLElement {
        if (cell.collapsed) {
            return cell.value.title;
        } else {
            let table = document.createElement('table');
            table.style.height = '100%';
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            let body = document.createElement('tbody');
            table.appendChild(body);
            let tr1 = document.createElement('tr');
            let td1 = document.createElement('td');
            td1.style.textAlign = 'left';
            td1.style.border = '1px solid black';
            td1.style.fontSize = '12px';
            td1.style.color = '#774400';
            td1.textContent = cell.value.title;
            tr1.appendChild(td1);
            body.appendChild(tr1);
            for (let key in cell.value.data) {
                if (cell.value.data.hasOwnProperty(key)) {
                    let tr1 = document.createElement('tr');
                    let td1 = document.createElement('td');
                    td1.style.textAlign = 'left';
                    td1.style.border = '1px solid black';
                    td1.style.fontSize = '11px';                    
                    if (!cell.value.data[key]) {
                        td1.style.fontWeight = 'bold';
                    }
                    td1.textContent = key + ":" + cell.value.data[key];
                    tr1.appendChild(td1);
                    body.appendChild(tr1);
                }
            }

            return table;
        }
    };

    /**
     * The tooltip is just the title of the part
     */
    getTooltip(cell: any): String {
        return cell.value.title;
    }

    isLabelClipped(cell: any) : boolean { return true;}
    
}
/**
 * Renderer of a supplier cell
 * At the moment this is rendererd as a swimlane cell with only the title
 */
class SupplierCellRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): HTMLElement {
        return cell.value;
    }

    getTooltip(cell: any): String {
        return cell.value;
    }

    isLabelClipped(cell: any) : boolean { return true;}
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

    isLabelClipped(cell: any) : boolean { return false;}    
}

/**
 * The default edge renderer.
 */
class DefaultEdgeRenderer extends CellRendererAbstract {
    getRenderedLabel(cell: any): HTMLElement {
        return undefined;
    }

    getTooltip(cell: any): String {
        return "";
    }

    isLabelClipped(cell: any) : boolean { return false;}    
}

/**
 * Factory method for getting renderer methods for cell
 */
export class GraphCellRenderer {
    private mapping: { [name: string]: CellRendererConstructor } = {
        "part": PartRenderer,
        "supplier": SupplierCellRenderer,
        "defaultVertex": DefaultVertexRenderer,
        "defaultEdge": DefaultEdgeRenderer
    }

    private getRendererForCell(cell: any): CellRendererConstructor {
        if (cell && this.mapping[cell.style]) {
            return this.mapping[cell.style];
        } else {
            if(cell.isVertex()) {
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
    public getCellTooltip =  (cell) => {
        let cellRenderer = this.getRendererForCell(cell);
        return new cellRenderer().getTooltip(cell);
    }

    public isLabelClipped =  (cell) => {
        let cellRenderer = this.getRendererForCell(cell);
        return new cellRenderer().isLabelClipped(cell);
    }
}
