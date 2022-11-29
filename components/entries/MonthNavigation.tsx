import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons/lib/icons";

const MonthNavigation = ({
  currentMonth,
  currentYear,
  changeDate,
}: {
  currentMonth: number;
  currentYear: number;
  changeDate: (year: number, month: number) => void;
}) => {
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      changeDate(currentYear - 1, 11);
    } else {
      changeDate(currentYear, currentMonth - 1);
    }
  };
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      changeDate(currentYear + 1, 0);
    } else {
      changeDate(currentYear, currentMonth + 1);
    }
  };

  return (
    <div>
      <Button type="link" style={{ padding: 0 }} onClick={goToPreviousMonth}>
        <LeftOutlined />
        previous
      </Button>
      <Button
        type="link"
        style={{ padding: 0, marginLeft: 30 }}
        onClick={goToNextMonth}
      >
        next
        <RightOutlined />
      </Button>
    </div>
  );
};

export default MonthNavigation;
