/**
 * An abstract renderer for any given node in the value process diagram
 */
class NodeRenderer {
    protected parent;
    protected value;
    protected graph;

    constructor(parent, value, graph) {
        this.parent = parent;
        this.value = value;
        this.graph = graph;
    }

    /**
     * render: Renders the current node
     */
    public render() {

    }
}

/**
 * Renderer for links in the diagram
 */
class LinkRenderer extends NodeRenderer {
    protected source;
    protected target;

    constructor(parent, value, graph, source, target) {
        super(parent, value, graph);
        this.source = source;
        this.target = target;
    }
}


/**
 * A renderer that takes care of the entire value process diagram
 * It firstly renders the suppliers, then the logistic centers, and finally the factory
 */
export class ValueProcessDiagramRenderer extends NodeRenderer {
    /**
     * render: Renders the entire value process diagram
    */
    public render() {
        new AllSuppliersNodeRenderer(this.parent, this.value.suppliers, this.graph).render();
        new AllLogisticCentersNodeRenderer(this.parent, this.value.logisticsCenters, this.graph).render();
        new FactoryNodeRenderer(this.parent, this.value.factory, this.graph).render();
        // now add the edges
        new AllLinksRenderer(this.parent, this.value.transportLinks, this.graph).render();
    }
}

/**
 * Handles rendering all of the links in the diagram
 */
class AllLinksRenderer extends NodeRenderer {
    /**
     * render: Renders all of the links in the diagram
     */
    public render() {
        for (let i = 0; i < this.value.length; i++) {
            let edge = this.value[i];
            let source = this.graph.getModel().getCell(edge.fromId);
            let target = this.graph.getModel().getCell(edge.toId);
            if (edge.type == "truck") {
                new TruckLinkRender(this.parent, edge, this.graph, source, target).render();
            }
        }
    }
}

class TruckLinkRender extends LinkRenderer {
    /**
      * render: Renders the truck link
      */
    public render() {
        this.graph.insertEdge(this.parent, null, this.value, this.source, this.target);
    }
}

/**
 * Handles rendering a given factory
 */
class FactoryNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the factory and the halls in it
     */
    public render() {
        let factoryNode = this.graph.insertVertex(this.parent, null, this.value, 0, 0, 1800, 1800, 'factory');
        for (let i = 0; i < this.value.halls.length; i++) {
            let factoryHall = this.value.halls[i];
            new FactoryHallNodeRenderer(factoryNode, factoryHall, this.graph).render();
        }
    }
}

/**
 * Handles rendering a given factory hall
 */
class FactoryHallNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the factory and the halls in it
     */
    public render() {
        let hallNode = this.graph.insertVertex(this.parent, null, this.value, 0, 0, 1800, 1800, 'supplier');
        let inventoryNode = this.graph.insertVertex(hallNode, null, null, 0, 0, 0, 0, 'inventoryContainer');
        // now render all the inventories
        for (let i = 0; i < this.value.inventories.length; i++) {
            let inventory = this.value.inventories[i];
            new InventoryNodeRenderer(inventoryNode, inventory, this.graph).render();
            inventory.info.title = inventory.name;
            new DataBoxRenderer(inventoryNode, inventory.info, this.graph).render();
        }
        // now iterate through the capabilities and add them 
        for (let j = 0; j < this.value.capabilities.length; j++) {
            let capability = this.value.capabilities[j];
            let renderer = CapabilityFactory.getCapabilityRenderer(capability.type);
            new renderer(hallNode, capability, this.graph).render();
        }
    }
}

/**
 * Handles rendering all the logistic centers in a given diagram
 */
class AllLogisticCentersNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        let logisticCentersVertex = this.graph.insertVertex(this.parent, null, null, 0, 0, 1800, 1800, 'suppliers');
        for (let i = 0; i < this.value.length; i++) {
            let logisticCenter = this.value[i];
            new LogisticCenterNodeRenderer(logisticCentersVertex, logisticCenter, this.graph).render();
        }
    }
}

/**
 * Handles rendering all the logistic centers in a given diagram
 */
class LogisticCenterNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        let logisticCenter = this.graph.insertVertex(this.parent, this.value.id, this.value, 0, 0, 1800, 1800, 'supplier');
        // now iterate through the capabilities and add them 
        for (let j = 0; j < this.value.capabilities.length; j++) {
            let capability = this.value.capabilities[j];
            let renderer = CapabilityFactory.getCapabilityRenderer(capability.type);
            new renderer(logisticCenter, capability, this.graph).render();
        }
    }
}

/**
 * Handles rendering of forklift
 */
class ForkliftNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        this.graph.insertVertex(this.parent, null, {tooltip: 'Forklift'}, 0, 0, 200, 20, "capability;shape=mxgraph.lean_mapping.move_by_forklift");
    }
}

/**
 * Handles rendering of X type cells
 */
class CapabilityXNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        this.graph.insertVertex(this.parent, null, 'X', 0, 0, 200, 20, "shape=rectangle;fontSize=18;strokeColor=black;strokeWidth=1;fillColor=transparent;spacing=6");
    }
}

/**
 * Handles rendering of generic text type cells
 */
class TextNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        this.graph.insertVertex(this.parent, null, this.value.value, 0, 0, 200, 20, "fontSize=12;spacing=6;whiteSpace=wrap");
    }
}

/**
 * Handles rendering of a lift
 */
class LiftNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        this.graph.insertVertex(this.parent, null, {tooltip: 'Lift'}, 0, 0, 200, 20, "capability;shape=mxgraph.lean_mapping.lift");
    }
}

/**
 * Handles rendering of a inventoryBox
 */
class InventoryNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        this.graph.insertVertex(this.parent, null, {tooltip: 'Lift'}, 0, 0, 200, 20, "capability;shape=mxgraph.lean_mapping.inventory_box");
    }
}

/**
 * Handles rendering of an operator
 */
class OperatorNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the operator note using a custom shape
     */
    public render() {
        this.graph.insertVertex(this.parent, null, {tooltip: 'Operator'}, 0, 0, 200, 20, "capability;shape=mxgraph.lean_mapping.operator");
    }
}

/**
 * Handles rendering of a process
 */
class ProcessNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        let processNode = this.graph.insertVertex(this.parent, null, this.value, 0, 0, 200, 20, "process");
        // now iterate through the capabilities and add them 
        for (let j = 0; j < this.value.capabilities.length; j++) {
            let capability = this.value.capabilities[j];
            let renderer = CapabilityFactory.getCapabilityRenderer(capability.type);
            new renderer(processNode, capability, this.graph).render();
        }

    }
}

/**
 * Handles rendering all the suppliers in a given diagram
 */
class AllSuppliersNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        let suppliersParent = this.graph.insertVertex(this.parent, null, null, 0, 0, 1800, 1800, 'suppliers');
        for (let i = 0; i < this.value.length; i++) {
            let supplier = this.value[i];
            new SupplierNodeRenderer(suppliersParent, supplier, this.graph).render();
        }
    }
}

/**
 * Renders a given suppliers. First renders the supplier vertex and 
 * then the parts inside of it
 */
class SupplierNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        let supplierNode = this.graph.insertVertex(this.parent, this.value.id, this.value, 0, 0, 400, 300, 'supplier');
        for (let j = 0; j < this.value.parts.length; j++) {
            let part = this.value.parts[j];
            new DataBoxRenderer(supplierNode, part, this.graph).render();
        }
    }
}

/**
 * Handles a "part" in the value process diagram.
 * This part is rendered as a DataBox
 */
class DataBoxRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        let partNode = this.graph.insertVertex(this.parent, this.value.id, this.value, 0, 0, 10, 300, 'part');
        // then add the title of the part
        for (let key in this.value) {
            // and finally all of the details
            if (this.value.hasOwnProperty(key) && key != 'id' && key != 'title' && key != 'type' && key != 'objectLink') {
                new DataBoxItemRenderer(partNode, { key: key, value: this.value[key] }, this.graph).render();
            }
        }
    }
}

class DataBoxItemRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        this.graph.insertVertex(this.parent, null, { key: this.value.key, value: this.value.value }, 0, 0, 200, 20, "partDetails");
    }
}

interface NodeRendererConstructor {
    new(parent, value, graph): NodeRenderer;
}

class CapabilityFactory {
    private static mapping: { [name: string]: NodeRendererConstructor } = {
        "forklift": ForkliftNodeRenderer,
        "databox": DataBoxRenderer,
        "process": ProcessNodeRenderer,
        "operator": OperatorNodeRenderer,
        "X": CapabilityXNodeRenderer,
        "lift": LiftNodeRenderer,
        "inventory": InventoryNodeRenderer,
        "text": TextNodeRenderer,
        "default": NodeRenderer
    }

    static getCapabilityRenderer(capability): NodeRendererConstructor {
        if (this.mapping[capability]) {
            return this.mapping[capability];
        } else {
            return this.mapping["default"];
        }
    }
}
