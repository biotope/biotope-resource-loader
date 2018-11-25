import { ResourceDefinition } from "./types/external";
import simpleArraysAreEqual from "./helper/simpleArraysAreEqual";

const definitionsAreEqual = (definition1: ResourceDefinition, definition2: ResourceDefinition): boolean => {
    return !!definition1
        && !!definition2
        && simpleArraysAreEqual(definition1.paths, definition2.paths)
        && simpleArraysAreEqual(definition1.dependsOn, definition2.dependsOn)
        && definition1.base === definition2.base;
}

export default definitionsAreEqual;
