"use client";

import {
  ReloadOutlined,
  DashboardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Spin, message, Card, Row, Col, Alert, Statistic, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IAdminAuthType } from "../../../apiservice/admin-AuthService.type";
import type {
  IAdminDashboardTypeData,
} from "../../../apiservice/admin-AuthService.type";
import type { StaffRecord } from "../StaffLogin/staffLogin.types";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";
import type { ILoadState } from "../../../utils/loading.utils.";
import { adminGetDashboardDetails } from "../../../apiservice/admin-AuthService";
import { getStaffs } from "../../../apiservice/staff-service";

// ─── Fetch ──────────────────────────────────────────────────────────────────

const fetchDashboardData = async (
  branchId: number
): Promise<IAdminDashboardTypeData> => {
  const res = await adminGetDashboardDetails(branchId);
  return res.data;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminDashboardWrapper = () => {
  const [loadState, setLoadState] = useState<ILoadState>("notLoading");
  const [dashboardData, setDashboardData] = useState<IAdminDashboardTypeData | null>(
    null
  );
  const [recentStaff, setRecentStaff] = useState<StaffRecord[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const authAdminData: IAdminAuthType = useAppSelector(
    (state: RootState) => state?.AdminAuthData
  );

  const branchId = authAdminData.staff?.branch_id || authAdminData.data?.id || 1;

  const fetchData = async (showMessage = false) => {
    setLoadState("loading");
    try {
      const [data, staffResponse] = await Promise.all([
        fetchDashboardData(branchId),
        getStaffs({ branch_id: branchId, page: 1, perPage: 5, sort_order: "desc" }),
      ]);
      if (!data) {
        setLoadState("noData");
        return;
      }
      setDashboardData(data);
      setRecentStaff(staffResponse.data ?? []);
      setLastUpdated(new Date());
      setLoadState("completed");
      if (showMessage) message.success("Dashboard data refreshed successfully!");
    } catch {
      setLoadState("error");
      message.error("Failed to load data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  // ── Table columns ──────────────────────────────────────────────────────────

  const recentStaffColumns = [
    {
      title: "Staff",
      key: "name",
      render: (_: unknown, record: StaffRecord) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.first_name} {record.last_name}
          </div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    { title: "Department", dataIndex: "department", key: "department", render: (value: string | null) => value || "-" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: StaffRecord["status"]) => (
        <Tag color={status === "ACTIVE" ? "green" : status === "SUSPENDED" ? "gold" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Date Added",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  // ── Animation variants ────────────────────────────────────────────────────

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  // ── State renderers ───────────────────────────────────────────────────────

  const renderLoadingState = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center mt-16">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-gray-600">Loading dashboard data…</p>
      </div>
    </motion.div>
  );

  const renderErrorState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center mt-16">
      <Card className="text-center max-w-md">
        <Alert message="Error Loading Data" description="We encountered an issue while loading your dashboard data. Please try refreshing." type="error" showIcon className="mb-4" />
        <Button icon={<ReloadOutlined />} onClick={() => fetchData(true)} type="primary" size="large">Refresh Dashboard</Button>
      </Card>
    </motion.div>
  );

  const renderNoDataState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center mt-16">
      <Card className="text-center max-w-md">
        <Alert message="No Data Available" description="There's no data available at the moment. The system may still be collecting data." type="info" showIcon className="mb-4" />
        <Button icon={<ReloadOutlined />} onClick={() => fetchData(true)} type="primary" size="large">Check Again</Button>
      </Card>
    </motion.div>
  );

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DashboardOutlined className="text-blue-600" />
                Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Welcome back, {authAdminData?.data?.credentials?.fullName || "Admin"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchData(true)}
                loading={loadState === "loading"}
                type="default"
              >
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loadState === "loading" && renderLoadingState()}
          {loadState === "error" && renderErrorState()}
          {loadState === "noData" && renderNoDataState()}

          {loadState === "completed" && (
            <motion.div
              key="dashboard-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* ── Summary Stats ── */}
              <motion.div variants={itemVariants}>
                <Row gutter={[16, 16]}>
                  {[
                    {
                      title: "Total Staff",
                      value: dashboardData?.numberOfStaff ?? 0,
                      icon: <TeamOutlined style={{ color: "#3b82f6" }} />,
                      color: "#3b82f6",
                    },
                    {
                      title: "Active Staff",
                      value: dashboardData?.activeStaff ?? 0,
                      icon: <CheckCircleOutlined style={{ color: "#16a34a" }} />,
                      color: "#16a34a",
                    },
                    {
                      title: "Inactive Staff",
                      value: dashboardData?.inActiveStaff ?? 0,
                      icon: <StopOutlined style={{ color: "#dc2626" }} />,
                      color: "#dc2626",
                    },
                  ].map((stat) => (
                    <Col key={stat.title} xs={24} sm={12} lg={8}>
                      <Card
                        className="shadow-sm"
                        bodyStyle={{ padding: "20px" }}
                        style={{ borderTop: `3px solid ${stat.color}` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-500 text-sm font-medium">{stat.title}</span>
                          <span className="text-xl">{stat.icon}</span>
                        </div>
                        <Statistic value={stat.value} valueStyle={{ color: stat.color, fontWeight: 700 }} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </motion.div>

              {/* ── Recent Staff ── */}
              <motion.div variants={itemVariants}>
                <Row>
                  <Col xs={24}>
                    <Card
                      title={
                        <div className="flex items-center gap-2">
                          <ClockCircleOutlined className="text-blue-600" />
                          <span>Recent Staff</span>
                        </div>
                      }
                      className="shadow-sm h-full"
                      bodyStyle={{ padding: "16px" }}
                    >
                      <Table
                        rowKey="id"
                        columns={recentStaffColumns}
                        dataSource={recentStaff}
                        pagination={false}
                        size="small"
                        scroll={{ x: 640 }}
                        locale={{ emptyText: "No staff records found" }}
                      />
                    </Card>
                  </Col>
                </Row>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboardWrapper;