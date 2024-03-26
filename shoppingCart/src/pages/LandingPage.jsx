import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

import './pageNavigation.css'
const LandingPage = () => {

    useEffect(() => {
        document.title = 'Kitchen on Selwyn Rd';
      }, []);

    const location = useLocation(); // Get the current location

    const pathSegments = location.pathname.split('/');
    const pageId = pathSegments.length > 1 ? pathSegments[1] : 'landingPage';
    const hideNavigationBar = location.pathname.includes('/adminPage');
    const footerPages = ['/shoppingCartPage', '/checkoutPage', '/orderRequestSent', '/orderManagement' ]
    const showFooter = footerPages.some(pagePath => location.pathname.includes(pagePath));


    return (
        <>
            {/* Conditionally render NavigationBar */}
            {!hideNavigationBar && <NavigationBar />}
            <div className='pageContent' id={pageId}>
                <Outlet />
            </div>
            {showFooter && <Footer />}
        </>
    );
}

export default LandingPage