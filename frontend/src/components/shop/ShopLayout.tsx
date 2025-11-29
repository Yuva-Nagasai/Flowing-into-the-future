import { Outlet } from 'react-router-dom';
import { ShopAuthProvider } from '../../contexts/ShopAuthContext';

export default function ShopLayout() {
  return (
    <ShopAuthProvider>
      <Outlet />
    </ShopAuthProvider>
  );
}
