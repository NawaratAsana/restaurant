import { Modal } from "antd";
import React from "react";
import Selling from "./Selling";

const ReportDayModal = (open: any, setOpen: any) => {
  return (
    <Modal
      width={900}
      open={open}
      footer={false}
      onCancel={() => setOpen(false)}
    >
      <Selling />
    </Modal>
  );
};

export default ReportDayModal;
