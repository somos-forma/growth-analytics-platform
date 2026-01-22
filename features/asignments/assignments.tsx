"use client";
import { AssignmentsHeader } from "./components/assignments-header";
import { AssignmentsList } from "./components/assignments-list";
import { DeleteAssignmentModal } from "./components/delete-assignment-modal";
import { useAssignmentStore } from "./store";

export const Assignments = () => {
  const isOpenDeleteAssignmentModal = useAssignmentStore((state) => state.isOpenDeleteAssignmentModal);
  return (
    <div className="space-y-5">
      <AssignmentsHeader />
      <AssignmentsList />
      {isOpenDeleteAssignmentModal && <DeleteAssignmentModal />}
    </div>
  );
};
