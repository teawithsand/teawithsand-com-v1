import useWindowDimensions from "./windowDimesionsHook";

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const BREAKPOINT_XS: Breakpoint = 'xs';
export const BREAKPOINT_SM: Breakpoint = 'sm';
export const BREAKPOINT_MD: Breakpoint = 'md';
export const BREAKPOINT_LG: Breakpoint = 'lg';
export const BREAKPOINT_XL: Breakpoint = 'xl';
export const BREAKPOINT_XXL: Breakpoint = 'xxl';

export const BREAKPOINTS = [
    BREAKPOINT_XS,
    BREAKPOINT_SM,
    BREAKPOINT_MD,
    BREAKPOINT_LG,
    BREAKPOINT_XL,
    BREAKPOINT_XXL,
]

const resolveBreakpointIndex = (width: number): number => {
    if (width < 576) {
        return 0;
    } else if (width >= 576 && width < 768) {
        return 1;
    } else if (width >= 768 && width < 992) {
        return 2;
    } else if (width >= 992 && width < 1200) {
        return 3;
    } else if (width >= 1200 && width < 1440) {
        return 4;
    } else/* if (width >= 1440) */ {
        return 5;
    }
};

export const useBreakpoint = (): Breakpoint => {
    const { width } = useWindowDimensions()
    return BREAKPOINTS[resolveBreakpointIndex(width)]
}

export const useBreakpointIndex = (): number => {
    const { width } = useWindowDimensions()
    return resolveBreakpointIndex(width)
}