import { Layout, Row, Col, Typography, Divider } from "antd";
import {
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
    return (
        <Footer style={styles.footer}>
            <Row gutter={[24, 24]} style={styles.text}>
                <Col xs={24} sm={12} md={6}>
                    <Text strong className="white-text"></Text>
                    <div>{/* <PhoneOutlined /> */}</div>
                    <div>{/* <MailOutlined /> */}</div>
                    <div>{/* <ClockCircleOutlined /> */}</div>
                    <Text className="white-text"></Text>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Text strong className="white-text"></Text>
                    <div>
                        <Link href="#"></Link>
                    </div>
                    <div>
                        <Link href="#"></Link>
                    </div>
                    <div>
                        <Link href="#"></Link>
                    </div>
                    <div>
                        <Link href="#"></Link>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Text strong className="white-text"></Text>
                    <div>
                        <Link href="#"></Link>
                    </div>
                    <div>
                        <Link href="#"></Link>
                    </div>
                    <div>
                        <Link href="#"></Link>
                    </div>
                    <div>
                        <Link href="#"></Link>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Text strong className="white-text"></Text>
                    <div>
                        <Link href="#"></Link>
                    </div>
                    <div>
                        <Link href="#"></Link>
                    </div>
                    <div>
                        <Link href="#"></Link>
                    </div>
                </Col>
            </Row>
            <Divider />
            <Row justify="center">
                <Col>
                    <Text className="white-text"></Text>
                </Col>
            </Row>
        </Footer>
    );
};

const styles = {
    footer: {
        backgroundColor: "#2E294E",
        color: "#fff",
    },
    text: {
        color: "#fff",
    },
};

export default AppFooter;
