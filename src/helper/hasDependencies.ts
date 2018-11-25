import { ResourceDefinition } from "../types/external";

const hasDependencies = (definition: ResourceDefinition): boolean => definition.dependsOn && definition.dependsOn.length > 0;

export default hasDependencies;
