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
        this.graph.insertVertex(this.parent, null, null, 0, 0, 200, 20, "shape=mxgraph.lean_mapping.move_by_forklift");
    }
}

/**
 * Handles rendering of an operator
 */
class OperatorNodeRenderer extends NodeRenderer {
    /**
     * render: Renders the an all supplier node
     */
    public render() {
        this.graph.insertVertex(this.parent, null, null, 0, 0, 200, 20, "shape=mxgraph.lean_mapping.operator");
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
            if (this.value.hasOwnProperty(key) && key != 'id' && key != 'title' && key != 'type') {
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
        "default": NodeRenderer
    }

    static getCapabilityRenderer(capability): NodeRendererConstructor {
        if(this.mapping[capability]) {
            return this.mapping[capability];
        } else {
            return this.mapping["default"];
        }
    }
}
