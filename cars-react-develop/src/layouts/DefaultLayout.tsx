import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "./styles/layout.css"

const { Content } = Layout;

const DefaultLayout = () => {
  return (
    <Layout style={styles.layout}>
     <div className='header-root'></div> <Header />
      <Content style={styles.content}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

const styles = {
  layout: {
    minHeight: '100vh',
  },
  content: {
    padding: '24px',
    backgroundColor: '#fff',
  },
};

export default DefaultLayout;