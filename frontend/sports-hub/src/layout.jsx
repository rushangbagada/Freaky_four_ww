
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/header'
import NewFooter from '../components/newFooter'

export default function Layout() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isChatbotRoute = location.pathname === '/chatbot';
    
    return (
        <>
            {!isAdminRoute && <Header/>}
            <Outlet />
            {!isAdminRoute && !isChatbotRoute && <NewFooter />}
        </>
    )
}
