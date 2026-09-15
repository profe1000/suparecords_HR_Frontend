import React from "react";
import { Form, Input } from "antd";
import { ExpenseCategory } from "../../../apiservice/expenses-service.type";

type Props = {
  formId: string;
  branchId: number;
  initialValues?: ExpenseCategory | null;
  onSubmit: (values: any) => void;
};

export default function AddEditExpenseCategoryForm({
  formId,
  branchId,
  initialValues,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        description: initialValues.description,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form
      id={formId}
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="Category Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please enter category name",
          },
          {
            min: 2,
            message: "Category name must be at least 2 characters",
          },
        ]}
      >
        <Input
          placeholder="e.g., General Expenses"
          className="h-10 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
        />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: "Please enter description",
          },
          {
            min: 5,
            message: "Description must be at least 5 characters",
          },
        ]}
      >
        <Input.TextArea
          placeholder="e.g., This is used to track all general expenses"
          rows={4}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100"
        />
      </Form.Item>
    </Form>
  );
}
