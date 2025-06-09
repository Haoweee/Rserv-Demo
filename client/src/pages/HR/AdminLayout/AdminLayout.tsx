import Layout from '../../../components/Layout/Layout';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
