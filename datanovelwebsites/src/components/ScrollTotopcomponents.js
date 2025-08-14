import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollTotopcomponents = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return null; // doesn't render anything visible
};

export default ScrollTotopcomponents;
