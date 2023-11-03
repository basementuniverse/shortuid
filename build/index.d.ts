export declare type ShortuidOptions = {
    prime: string | number;
    base: string | number;
    inverse: string | number;
    mixer: string | number;
    alpha: string;
};
export default class Shortuid {
    static encode(i: number, options?: ShortuidOptions): string;
    static decode(id: string, options?: ShortuidOptions): number;
    private static parseOptions;
    private static encode1;
    private static encode2;
    private static decode1;
    private static decode2;
}
