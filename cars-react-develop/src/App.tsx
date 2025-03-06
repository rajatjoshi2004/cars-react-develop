import { ConfigProvider, Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./components/Header";
import AppFooter from "./components/Footer";
import "./App.css";
import "./index.css";
import { styleToken } from "./styles/antStyle/antStyleToken";
import { Toaster } from "react-hot-toast";

const { Content } = Layout;

const App = () => {
    const location = useLocation();
    const hideHeaderFooterRoutes = ["/verify-email"]; // Add routes where header/footer should be hidden

    return (
        <ConfigProvider theme={styleToken}>
            <Layout style={styles.layout}>
                {!hideHeaderFooterRoutes.includes(location.pathname) && <AppHeader />}
                <Content style={styles.content}>
                    <div>
                        <Toaster position="bottom-center" reverseOrder={false} />
                    </div>
                    <Outlet />
                </Content>
                {!hideHeaderFooterRoutes.includes(location.pathname) && <AppFooter />}
            </Layout>
        </ConfigProvider>
    );
};

const styles = {
    layout: {
        minHeight: "100vh",
    },
    content: {
        backgroundColor: "#fff",
    },
};

export default App;