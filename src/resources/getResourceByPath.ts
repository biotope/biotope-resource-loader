import { Resource } from '../types';

const getResourceByPath = (resources: Resource[], path: string) => resources.find(r => r.path === path);

export default getResourceByPath;
