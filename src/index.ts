import { dataModel } from './dataExample'
import {createValueProcessDiagram} from './mxValueProcessDiagram'


window.onload = function () {
  // Program starts here. Creates a sample graph in the
  // DOM node with the specified ID. This function is invoked
  // from the onLoad event handler of the document (see below).
  // Program starts here. Creates a sample graph in the
  // DOM node with the specified ID. This function is invoked
  // from the onLoad event handler of the document (see below).
  createValueProcessDiagram(document.getElementById('graphContainer'), dataModel);
};
