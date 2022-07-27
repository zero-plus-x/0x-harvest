import { Tooltip } from "antd";
import { TimeEntry } from "../../types";
import { taskInfoFromTimEntry } from "../../utils";
import TaskName from "./TaskName";

const TaskNameWithTooltip = ({ entry }: { entry: TimeEntry }) => {
  return (
    <Tooltip
      title={
        <>
          Project ID: {entry.project.id}
          <br />
          Project Name: {entry.project.name}
          <br />
          Task ID: {entry.task.id}
          <br />
          Task Name: {entry.task.name}
        </>
      }
    >
      <div
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <TaskName entry={taskInfoFromTimEntry(entry)} />
      </div>
    </Tooltip>
  );
};

export default TaskNameWithTooltip;
