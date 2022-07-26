import { Button } from "antd";
import type { NextPage } from "next";

const Login: NextPage = () => {
  return (
    <Button onClick={() => window.location.replace("/api/oauth2")}>
      Log in via Harvest
    </Button>
  );
};

export default Login;
