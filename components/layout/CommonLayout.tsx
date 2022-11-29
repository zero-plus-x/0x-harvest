import React from "react";
import { Col, Layout, Row } from "antd";
import Header from "./Header";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout.Content style={{ paddingTop: 15 }}>
        <Row>
          <Col xxl={5} xl={4} lg={2} md={2} sm={1} xs={0}></Col>
          <Col
            xxl={14}
            xl={16}
            lg={20}
            md={20}
            sm={22}
            xs={24}
            style={{ paddingTop: 20, paddingBottom: 50 }}
          >
            {children}
          </Col>
          <Col xxl={5} xl={4} lg={2} md={2} sm={1} xs={0}></Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}
