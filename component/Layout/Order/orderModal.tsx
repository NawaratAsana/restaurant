import { Modal, Row, Steps, Table } from 'antd'
import React from 'react'

const orderModal = (openOrder:any, setOpenOrder:any) => {
    const dataSource = [
        {
          key: '1',
          food: 'ข้าวผัด',
          price: 32,
        
        },
        {
          key: '2',
          food: 'ข้าวผัดกระเพรา',
          price: 42,
         
        },
      ];
      
      const columns = [
        {
          title: 'อาหาร',
          dataIndex: 'food',
          key: 'food',
        },
        {
          title: 'ราคา',
          dataIndex: 'price',
          key: 'price',
        },
        
      ];
      
     
    const description = 'This is a description.';
  return (
    <Row justify='center'>
      
   <Modal
        title="รายการอาหาร"
        centered
        open={openOrder}
        onOk={() => setOpenOrder(false)}
        onCancel={() => setOpenOrder(false)}
        width={800}
      >
          <Steps
    current={1}
    items={[
      {
        title: 'สั่งอาหาร',
        description,
      },
      {
        title: 'กำลังทำอาหาร',
        description,
        // subTitle: 'Left 00:00:08',
      },
      {
        title: 'เสร็จสิ้น',
        description,
      },
    ]}
  />
   <Table dataSource={dataSource} columns={columns} pagination={false} style={{marginTop:"20px"}}/>
      </Modal>
    </Row>
  )
}

export default orderModal