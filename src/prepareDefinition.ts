import { ResourceDefinition } from './types';
const prepareDefinition = (definition: ResourceDefinition): any => {

}

export default prepareDefinition;


// for (const definition of queue.definitions) {
//     definition.id = makeRandomId();
//     for (const pathIndex in definition.paths) {
//         const path = definition.paths[pathIndex];
//         definition.paths[pathIndex] = normalizePath(path, definition, options);
//     }
//     if (definition.dependsOn) {
//         for (const dependsOnKey in definition.dependsOn) {
//             const path = definition.dependsOn[dependsOnKey];
//             definition.dependsOn[dependsOnKey] = normalizePath(
//                 path,
//                 definition,
//                 options
//             );
//         }
//     }
// }
