import {
  Avatar,
  Button,
  Card,
  Col,
  Layout,
  Radio,
  Row,
  Space,
  Spin,
  Switch,
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
import { EditOutlined, SearchOutlined } from "@ant-design/icons";

export async function getServerSideProps(context: any) {
  if (context.req?.cookies?.user) {
    const getCookie = JSON.parse(context.req?.cookies?.user);
    return {
      props: {
        userCookie: getCookie,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/loginEmployee",
        parmanent: false,
      },
    };
  }
}
const { Title } = Typography;
interface IEmployee {
  // employee: String;
  // position: String;
  name: string;
  active: String;
  address: String;
  phone: String;
  birthday: Date;
  email: String;
  employeeID: String;
  gender: String;
  lname: String;
  password: String;
  username: String;
  position_id: string;
  role: string;
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
          router.push("/loginEmployee");
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

  const queryPosition = async (filter: any) => {
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
          router.push("/loginEmployee");
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
          router.push("/loginEmployee");
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
          router.push("/loginEmployee");
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
    queryPosition(positionFilter);
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

      // width: "32%",
      render: (_: any, record: any) => (
        <>
          {employee.map((item: any, i: number) => {
            if (item?.name === record?.name) {
              return (
                <Typography key={i}>
                  {item?.name + " " + item?.lname}
                </Typography>
              );
            }
          })}
        </>
      ),
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
              return <Typography key={index}>{value?.name}</Typography>;
            }
          })}
        </>
      ),
    },
    {
      title: "status",
      key: "active",
      dataIndex: "active",
      align: "center",
      render: (_: any, record: any) => (
        <>
          <Typography style={{}}>
            {record?.active === true ? (
              <span style={{ color: "#52c41a" }}>ใช้งาน</span>
            ) : (
              <span style={{ color: "#f5222d" }}>ระงับการใช้งาน</span>
            )}
          </Typography>
          
        </>
      ),
    },
    {
      title: "Action",
      key: "manage",
      dataIndex: "manage",
      align: "center",
      width: "20%",
      render: (_: any, record: any) => (
        <Row justify="center" gutter={8} style={{ width: "100%" }}>
          <Col span={10}>
            <EditOutlined
              style={{
                fontSize: "24px",
                fontFamily: "SukhumvitSet-Bold",
                color: "#064595",
              }}
              onClick={() =>
                setModal({
                  // header: props?.user?.role === "63f5124b0e947c18f977699d" ? "แก้ไขข้อมูล" : "รายละเอียด",
                  header: "แก้ไขข้อมูล",
                  // status: props?.user?.role === "63f5124b0e947c18f977699d" ? "edit" : "detail",
                  status: "edit",
                  open: true,
                  value: record,
                })
              }
            />
          </Col>
          <Col span={10}>
            <SearchOutlined
              style={{
                fontSize: "24px",
                fontFamily: "SukhumvitSet-Bold",
                color: "#064595",
              }}
              onClick={() =>
                setModal({
                  header: "รายละเอียด",
                  status: "detail",
                  open: true,
                  value: record,
                })
              }
            />
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Content style={{ margin: "24px 16px 0" }}>
        <div
          style={{
            padding: 24,
            textAlign: "center",
          }}
        >
          <Row gutter={[24, 0]}>
            <Col span={20} style={{ textAlign: "left" }} xs="20" xl={20}>
              <Title> ข้อมูลพนักงาน</Title>
            </Col>
            <Col span={4}>
              <ButtonStyled
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
              </ButtonStyled>
            </Col>
          </Row>
          {/* <Space align="center"> */}
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
              <CardStyle
                bordered={false}

                // title="Employee"
              >
                <div className="table-responsive">
                  {loading ? (
                    <Spin />
                  ) : (
                    <Table
                      style={{fontSize:14}}
                      pagination={{
                        current: page,
                        total: totalPage,
                        pageSize: pageSize,
                        showSizeChanger: false,
                        onChange: async (page: number) => {
                          let newFilter = {
                            ...filter,
                            skip: (page - 1) * pageSize,
                          };
                          setPage(page);
                          setFilter(newFilter);
                          await queryPosition(newFilter);
                        },
                      }}
                      columns={columns}
                      dataSource={employee}
                      // className="ant-border-space"
                    />
                  )}
                </div>
              </CardStyle>
            </Col>
          </Row>
          {/* </Space> */}
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

const ButtonStyled = styled(Button)`
  height: 40px;
  width: 100%;
  border-radius: 20px;
  font-size: 18px;
  border: none;
`;

const CardStyle = styled(Card)`
  box-shadow: 0px 20px 27px #0000000d;
  border-radius: 12px;
`;
export default employee;
