import React, { useState } from "react";
import TodosModal from "../../components/Modal";
import { ToastProvider } from "react-toast-notifications";

function CurrentTodos() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <ToastProvider>
      <TodosModal setModalOpen={setModalOpen} modalOpen={modalOpen} />
      </ToastProvider>
    </div>
  );
}

export default CurrentTodos;
