import React, { useState } from "react";
import TodosModal from "../../components/Modal";

function CurrentTodos() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <TodosModal setModalOpen={setModalOpen} modalOpen={modalOpen} />
    </div>
  );
}

export default CurrentTodos;
