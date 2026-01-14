"use client";
import { AssignmentsHeader } from "./components/assignments-header";
import { AssignmentsList } from "./components/assignments-list";
import { useAssignmentStore } from "./store";
import { DeleteAssignmentModal } from "./components/delete-assignment-modal";

export const Assignments = () => {
  const isOpenDeleteAssignmentModal = useAssignmentStore(
    (state) => state.isOpenDeleteAssignmentModal
  );
  return (
    <div className="space-y-5">
      <AssignmentsHeader />
      <AssignmentsList />
      {isOpenDeleteAssignmentModal && <DeleteAssignmentModal />}
    </div>
  );
};
