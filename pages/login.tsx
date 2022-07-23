import { Button } from "antd";
import type { NextPage } from "next";
import { forbidAuth } from "../lib/routeGuards";

export const getServerSideProps = forbidAuth;

const Login: NextPage = () => {
  return (
    <Button onClick={() => window.location.replace("/api/oauth2")}>
      Log in via Harvest
    </Button>
  );
};

export default Login;
