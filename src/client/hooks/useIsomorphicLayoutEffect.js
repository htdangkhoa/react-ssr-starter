// References: https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#gistcomment-2911761
import { useLayoutEffect, useEffect } from 'react';

const useIsomorphicLayoutEffect = __SERVER__ ? useEffect : useLayoutEffect;

export default useIsomorphicLayoutEffect;
