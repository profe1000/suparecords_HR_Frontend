import React, { useEffect, useState } from "react";
import { Form, Input, Button, Table, Modal, Space, message } from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "../../../apiservice/expenses-service";
import {
  ExpenseCategory,
  CreateExpenseCategoryPayload,
} from "../../../apiservice/expenses-service.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";

export default function ExpenseCategoriesComp() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const authData = useAppSelector((state: RootState) => state.AdminAuthData);
  const branchId = authData.staff?.branch_id || authData.data?.id || 1;

  useEffect(() => {
    loadCategories();
  }, [branchId]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await getExpenseCategories({ branch_id: branchId });
      setCategories(response.data || []);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Failed to load expense categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: ExpenseCategory) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record: ExpenseCategory) => {
    Modal.confirm({
      title: "Delete Expense Category",
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteExpenseCategory(record.id);
          message.success("Category deleted successfully");
          await loadCategories();
        } catch (error: any) {
          message.error(
            error?.response?.data?.message || "Failed to delete category"
          );
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const payload: CreateExpenseCategoryPayload = {
        branch_id: branchId,
        name: values.name,
        description: values.description,
      };

      if (editingCategory) {
        await updateExpenseCategory(editingCategory.id, {
          name: values.name,
          description: values.description,
        });
        message.success("Category updated successfully");
      } else {
        await createExpenseCategory(payload);
        message.success("Category created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      await loadCategories();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Failed to save category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "50%",
    },
    {
      title: "Status",
      dataIndex: "deleted_at",
      key: "status",
      width: "10%",
      render: (deletedAt: string | null) => (
        <span className={deletedAt ? "text-red-600" : "text-green-600"}>
          {deletedAt ? "Deleted" : "Active"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_: any, record: ExpenseCategory) => (
        <Space>
          <button
            type="button"
            onClick={() => handleEdit(record)}
            className="inline-flex items-center rounded-lg border border-blue-500 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
          >
            <EditOutlined />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(record)}
            className="inline-flex items-center rounded-lg border border-red-500 px-2 py-1 text-sm text-red-600 hover:bg-red-50"
          >
            <DeleteOutlined />
          </button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Expense Categories
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage expense categories for your branch
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <PlusOutlined className="mr-2" />
          Add Category
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={false}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter category name",
              },
            ]}
          >
            <Input placeholder="e.g., General Expenses" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter description",
              },
            ]}
          >
            <Input.TextArea
              placeholder="e.g., This is used to track all general expenses"
              rows={3}
            />
          </Form.Item>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setIsModalVisible(false)}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="expense-category-form"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting && <LoadingOutlined />}
              {editingCategory ? "Update" : "Create"}
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
