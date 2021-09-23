import { Button } from "antd";
import type { NextPage } from "next";
import CommonLayout from "../components/layout/CommonLayout";
import { forbidAuth } from "../lib/routeGuards";

export const getServerSideProps = forbidAuth;

const Login: NextPage = () => {
  return (
    <CommonLayout>
      <Button onClick={() => window.location.replace("/api/oauth2")}>
        Login via Harvest
      </Button>
    </CommonLayout>
  );
};

export default Login;
