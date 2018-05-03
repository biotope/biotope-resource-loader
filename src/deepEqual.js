const deepEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (const key in a) {
    const aa = a[key];
    const bb = b[key];

    if (
      aa.paths.length !== bb.paths.length &&
			aa.dependsOn.length !== bb.dependsOn.length
    )
      return false;
    for (const dependsKey in aa.dependsOn) {
      if (aa.dependsOn[dependsKey] !== bb.dependsOn[dependsKey]) return false;
    }
    for (const pathKey in aa.paths) {
      if (aa.paths[pathKey] !== bb.paths[pathKey]) return false;
    }
  }
  return true;
};

export default deepEqual;
