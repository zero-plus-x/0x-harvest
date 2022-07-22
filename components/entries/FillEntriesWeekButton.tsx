import { PlusOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { createTimeEntry, HARVEST_DATE_FORMAT } from "../../lib/api";
import { TaskWithProject, TimeEntry } from "../../types";
import { Day } from "../../utils";

const FillEntriesWeekButton = ({
  day,
  loading,
  setLoading,
  task,
  loadMonth,
  onCreatedEntries,
}: {
  day: Day;
  loading: boolean;
  setLoading: (value: boolean) => void;
  task: TaskWithProject;
  loadMonth: () => Promise<void>;
  onCreatedEntries: (entries: TimeEntry[]) => void;
}) => {
  return (
    <Button
      disabled={loading}
      loading={loading}
      onClick={async () => {
        setLoading(true);
        const currentDate = day.date.clone();
        const promises = Array(5)
          .fill(1)
          .map(() => {
            const promise = createTimeEntry(
              currentDate.format(HARVEST_DATE_FORMAT),
              task.projectId,
              task.taskId
            );
            currentDate.add(1, "day");
            return promise;
          });

        const responses = await Promise.all(promises);
        setLoading(false);
        if (responses.every((r) => r.status === 201)) {
          message.success("New entries created!");
          onCreatedEntries(responses.map((r) => r.data));
        } else {
          message.error("Something went wrong while creating entries.");
          await loadMonth();
        }
      }}
    >
      <PlusOutlined /> Work entries for this week
    </Button>
  );
};

export default FillEntriesWeekButton;
