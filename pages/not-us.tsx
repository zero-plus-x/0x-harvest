import { Result } from "antd";
import type { NextPage } from "next";

const Settings: NextPage = () => {
  return (
    <Result
      status="403"
      title="No time logging for you"
      subTitle="Sorry, this app is only meant to be used by Hyper One employees."
    />
  );
};

export default Settings;
