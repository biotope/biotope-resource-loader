import { curry } from "ramda";

const resolveBaseWith = (baseMap: { [id: string]: string }, base: string) => {
    if (!(base.substring(0, 2) === '##')) {
        return base;
    }
    return baseMap[base] || '';
}

export default curry(resolveBaseWith);
