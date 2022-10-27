import { DeleteOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { deleteTimeEntry } from "../../lib/api";
import { TimeEntry } from "../../types";

const DeleteEntryButton = ({
  loadMonth,
  entry,
  onDeleteSuccess,
}: {
  loadMonth: () => Promise<void>;
  onDeleteSuccess: () => void;
  entry: TimeEntry;
}) => {
  return (
    <Button
      danger
      className="delete-button"
      icon={<DeleteOutlined />}
      onClick={async () => {
        try {
          const response = await deleteTimeEntry(entry.id);

          if (response.status === 200) {
            message.success("Entry deleted!");
            onDeleteSuccess();
          } else {
            throw new Error(`Error code ${response.status}.`);
          }
        } catch (e) {
          message.error("Something went wrong while deleting the entry.");
          await loadMonth();
        }
      }}
    />
  );
};

export default DeleteEntryButton;
