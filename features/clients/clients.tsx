"use client";

import { ClientsHeader } from "./components/clients-header";
import { ClientsList } from "./components/clients-list";
import { DeleteClientModal } from "./components/delete-client-modal";
import { EditClientModal } from "./components/edit-client-modal";
import { useClientStore } from "./store";

export const Clients = () => {
  const { isOpenDeleteClientModal, client, isOpenEditClientModal } = useClientStore();
  return (
    <div className="space-y-5">
      <ClientsHeader />
      <ClientsList />
      {isOpenDeleteClientModal && client && <DeleteClientModal />}
      {isOpenEditClientModal && client && <EditClientModal />}
    </div>
  );
};
