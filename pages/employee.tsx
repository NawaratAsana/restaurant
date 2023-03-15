import {
  Avatar,
  Button,
  Card,
  Col,
  Layout,
  Radio,
  Row,
  Table,
  Typography,
  notification,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import EmployeeModal from "../component/Layout/Employee/EmployeeModal";
import styled from "styled-components";
import { DeleteFilled, FormOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface IEmployee {
  employee: String;
  position: String;
}
interface Iprops {
  user: any;
}
interface IModalEmployee {
  header?: string;
  status?: string;
  open?: boolean;
  value?: any;
}
const employee = (props: Iprops) => {
  const router = useRouter();
  const [employee, setEmployee] = useState<IEmployee[]>([]);
  const [modal, setModal] = useState<IModalEmployee>({
    header: "",
    status: "",
    open: false,
    value: {},
  });
  const [position, setPosition] = useState([
    {
      id: "",
      name: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  let pageSize: number = 10;
  const [filter, setFilter] = useState({
    where: {},
    query: "",
    limit: 10,
    skip: 0,
  });
  const [positionFilter, setPositionFilter] = useState({
    where: {},
    query: "",
    limit: 10,
    skip: 0,
  });
 
  const queryEmployee = async (filter: any) => {
    setLoading(true);
    const result = await axios({
      method: "post",
      url: `/api/employee/query`,
      data: filter,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/login");
        }
      }
    });
    if (result?.status === 200) {
      // console.log("result?.data?.data?.rows >>>>> ", result?.data?.data)
      setTotalPage(result?.data?.data?.count);
      setEmployee(result?.data?.data);
      setLoading(false);
    } else {
      setTotalPage(0);
      setEmployee([]);
      setLoading(false);
    }
  };

  const QueryPosition = async (filter: any) => {
    
    const result = await axios({
      method: "post",
      url: `/api/position/query`,
      data: filter,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/login");
        }
      }
    });
    if (result?.status === 200) {
      // console.log("result position >>>> ", result?.data?.data?.rows);
      let positionData: any[] = [];
      result?.data?.data?.map((value: any) => {
        positionData.push({
          id: value._id,
          name: value?.name,
        });
      });

      setPosition(positionData);
    }
  };
  const onAddEmployee = async (value: any) => {
    const result = await axios({
      method: "post",
      url: `/api/employee/create`,
      data: value,
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/login");
        }
      }
    });
    if (result?.status === 200) {
      notification["success"]({
        message: "employee-add-success",
      });
      queryEmployee(filter);
    }
  };
  const onEditEmployee = async (value: any) => {
    console.log("edit value >>>>>>>>>>> ", value);
    const result = await axios({
      method: "post",
      url: `/api/employee/update`,
      data: { ...value, id: modal?.value?._id },
    }).catch((err) => {
      if (err) {
        // console.log(err)
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/login");
        }
      }
    });
    if (result?.status === 200) {
      notification["success"]({
        message: "employee-edit-success",
      });
      queryEmployee(filter);
    }
  };
  const onDeleteEmployee = async (value: any) => {
    const result = await axios({
      method: "post",
      url: `/api/delete/delete`,
      data: { id: modal?.value?._id },
    }).catch((err) => {
      if (err) {
        if (err?.response?.data?.message?.status === 401) {
          notification["error"]({
            message: "Query ข้อมูลไม่สำเร็จ",
            description: "กรุณาเข้าสู่ระบบ",
          });
          Cookies.remove("user");
          router.push("/login");
        }
      }
    });
    if (result?.status === 200) {
      notification["success"]({
        message: "cameras-delete-success",
      });
      queryEmployee(filter);
    }
  };
  useEffect(() => {
    queryEmployee(filter);
  }, [modal, setModal, filter, setFilter]);

  useEffect(() => {
    QueryPosition(positionFilter);
  }, [modal, setModal, positionFilter, setPositionFilter]);

  const columns: any = [
    {
      title: "EmployeeID",
      dataIndex: "employeeID",
      key: "employeeID",
      align: "center",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      // width: "32%",
      render: (_:any,record:any)=>(
        <>
          {
            employee.map((item:any,i:number)=>{
              if(item?.name === record?.name){
                return <Typography key={i}>{item?.name + ' ' + item?.lname}</Typography>
              }
            })
          }
        </>
      )
    },

    {
      title: "Phone",
      key: "phone",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "Position",
      key: "position_id",
      dataIndex: "position_id",
      align: "center",
      render: (_: any, record: any) => (
        
        <>
          {position?.map((value: any, index: number) => {
            if (value?.id === record?.position_id) {
              return <Typography key={index}>{value?.name}</Typography>
            }
          })}
        </>
      ),
      
    },
    {
      title: "Manage",
      key: "manage",
      dataIndex: "manage",
      align: "center",
      render: (_: any, record: any) => (
        <Row justify="center" gutter={8} style={{ width: "100%" }}>
          <Col span={20}>
            <Button
              onClick={() =>
                setModal({
                  header:
                    props?.user?.role === "63f5124b0e947c18f977699d"
                      ? "แก้ไขข้อมูล"
                      : "รายละเอียด",
                  status: props?.user?.role === "63f5124b0e947c18f977699d" ? "edit" : "detail",
                  open: true,
                  value: record,
                })
              }
              style={{
                width: "80%",
                border: "1px solid #064595",
                borderRadius: "50px",
                height: "36px",
                color: "#064595",
              }}
            >
              <FormOutlined
                style={{
                  fontSize: "24px",
                  fontFamily: "SukhumvitSet-Bold",
                  color: "#064595",
                }}
              />
              {props?.user?.role === "63f5124b0e947c18f977699d" ? "แก้ไขข้อมูล" : "รายละเอียด"}
            </Button>
          </Col>
          {props?.user?.role === "63f5124b0e947c18f977699d" && (
            <Col span={4}>
              <Button
                onClick={() =>
                  setModal({
                    header: "cameras-delete-camera",
                    status: "delete",
                    open: true,
                    value: record,
                  })

                }
                style={{
                  background: "none",
                  border: "none",
                }}
              >
                <DeleteFilled 
                  style={{
                    fontSize: "24px",
                    fontFamily: "SukhumvitSet-Bold",
                    color: "#979797",
                  }}
                />
              </Button>
            </Col>
          )}
        </Row>
      ),
    },
  ];

  const onChange = (e: any) => console.log(`radio checked:${e.target.value}`);
  return (
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <div
          style={{
            padding: 24,
            textAlign: "center",
          }}
        >
          <Row gutter={[24, 0]}>
            <Col span={20} style={{ textAlign: "left" }}>
              <Title> Employee</Title>
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                onClick={() =>
                  setModal({
                    header: "เพิ่มพนักงาน",
                    status: "add",
                    open: true,
                  })
                }
              >
                Add Employee
              </Button>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
              <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title="Employee"
                extra={
                  <>
                    <Radio.Group onChange={onChange} defaultValue="a">
                      <Radio.Button value="a">All</Radio.Button>
                      <Radio.Button value="b">ONLINE</Radio.Button>
                    </Radio.Group>
                  </>
                }
              >
                <div className="table-responsive">
                  <Table
                    columns={columns}
                    dataSource={employee}
                    className="ant-border-space"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      {EmployeeModal(
        modal,
        setModal,
        onAddEmployee,
        onEditEmployee,
        onDeleteEmployee,
        position
      )}
    </Layout>
  );
};

const ButtonStyle = styled(Button)`
  background: #f1be44;
  border: none;
  border-radius: 10px;
  color: white;
  width: 50%;
  height: 40px;
  font-size: 18px;
  display: block;
  margin: 0px auto;
`;
export default employee;
