import { Layout } from "antd";
import { useTranslation } from "react-i18next";
import { useTranslationApi } from "../hooks/useTranslationApi";

const { Content } = Layout;
const { t } = useTranslationApi();
const Home = () => {
    return (
        <Content style={{ padding: "24px" }}>
            <h1>{t('search.welcome')}</h1>
            {/* Your home page content here */}
        </Content>
    );
};

export default Home;
