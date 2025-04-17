import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  List,
  Tooltip,
  Tag,
  Typography,
  Divider,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ToolOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const templateMeta = {
  tutorial: {
    icon: <FileTextOutlined style={{ color: "#1890ff" }} />,
    color: "blue",
    label: "Completed Tutorial",
  },
  skill: {
    icon: <ToolOutlined style={{ color: "#52c41a" }} />,
    color: "green",
    label: "New Skill Learned",
  },
  project: {
    icon: <RocketOutlined style={{ color: "#faad14" }} />,
    color: "gold",
    label: "Built a Project",
  },
};

const LearningProgress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [updates, setUpdates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSubmit = (values) => {
    if (editing) {
      setUpdates((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? { ...item, ...values, template: selectedTemplate || item.template }
            : item
        )
      );
    } else {
      setUpdates((prev) => [
        {
          ...values,
          id: Date.now(),
          template: selectedTemplate,
          date: new Date().toLocaleDateString(),
        },
        ...prev,
      ]);
    }
    setIsModalOpen(false);
    setEditing(null);
    setSelectedTemplate(null);
    form.resetFields();
  };

  const handleEdit = (item) => {
    setEditing(item);
    setSelectedTemplate(item.template);
    form.setFieldsValue({
      title: item.title,
      content: item.content,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setUpdates((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
    if (!editing) {
      // Optionally auto-fill title/content based on template
      if (value === "tutorial") {
        form.setFieldsValue({ title: "Completed a Tutorial", content: "" });
      } else if (value === "skill") {
        form.setFieldsValue({ title: "Learned a New Skill", content: "" });
      } else if (value === "project") {
        form.setFieldsValue({ title: "Built a Project", content: "" });
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen p-0 md:p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-10 mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Title level={3} className="!mb-0 !text-blue-700 dark:!text-blue-300 flex items-center gap-2">
            📈 Learning Progress
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => {
              setIsModalOpen(true);
              setEditing(null);
              setSelectedTemplate(null);
              form.resetFields();
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Update
          </Button>
        </div>

        <Divider />

        <List
          dataSource={updates}
          locale={{
            emptyText: (
              <Empty
                description={
                  <span className="text-gray-500 dark:text-gray-400">
                    No progress updates yet. Click <b>Add Update</b> to get started!
                  </span>
                }
              />
            ),
          }}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className="rounded-lg mb-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-sm p-4"
              actions={[
                <Tooltip title="Edit" key="edit">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEdit(item)}
                  />
                </Tooltip>,
                <Tooltip title="Delete" key="delete">
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => handleDelete(item.id)}
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Tag
                    color={templateMeta[item.template]?.color || "default"}
                    className="flex items-center px-3 py-1 text-base"
                    style={{ fontSize: 18, borderRadius: 8 }}
                  >
                    {templateMeta[item.template]?.icon}
                  </Tag>
                }
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      {item.title}
                    </span>
                    <Tag color={templateMeta[item.template]?.color || "default"}>
                      {templateMeta[item.template]?.label}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <Text className="text-gray-600 dark:text-gray-300">{item.content}</Text>
                    <div className="text-xs text-gray-400 mt-1">{item.date}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />

        <Modal
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditing(null);
            setSelectedTemplate(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          title={
            <span className="flex items-center gap-2">
              {editing ? (
                <>
                  <EditOutlined /> Edit Update
                </>
              ) : (
                <>
                  <PlusOutlined /> Add Progress Update
                </>
              )}
            </span>
          }
          okText={editing ? "Save" : "Add"}
          okButtonProps={{ className: "bg-blue-600 hover:bg-blue-700" }}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{
              title: "",
              content: "",
            }}
          >
            {!editing && (
              <Form.Item label="Choose a Template" name="template" rules={[{ required: true, message: "Please select a template" }]}>
                <Select
                  placeholder="Select a template"
                  onChange={handleTemplateChange}
                  optionLabelProp="label"
                  size="large"
                >
                  <Option value="tutorial" label="📚 Completed Tutorial">
                    <FileTextOutlined /> 📚 Completed Tutorial
                  </Option>
                  <Option value="skill" label="🛠️ New Skill Learned">
                    <ToolOutlined /> 🛠️ New Skill Learned
                  </Option>
                  <Option value="project" label="🚀 Built a Project">
                    <RocketOutlined /> 🚀 Built a Project
                  </Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input size="large" placeholder="e.g., Completed React Bootcamp" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Details"
              rules={[{ required: true, message: "Please enter details" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="What did you learn or complete?"
                showCount
                maxLength={300}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default LearningProgress;