import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createLearningPlan, 
  getLearningPlans, 
  updateLearningPlan, 
  deleteLearningPlan,
  addTopicToPlan,
  updateTopic,
  deleteTopic,
  addResourceToTopic,
  updateResource,
  deleteResource
} from '../../Redux/LearningPlan/Action';
import { 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Checkbox, 
  List, 
  Card, 
  Space, 
  message, 
  Collapse, 
  Tag, 
  Alert, 
  Spin,
  Typography,
  Tooltip,
  Progress,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LinkOutlined,
  FileAddOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  CalendarOutlined,
  StarOutlined,
  SettingOutlined
} from '@ant-design/icons';
import moment from 'moment';
import "./LearningPlan.css";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const LearningPlan = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { learningPlan } = useSelector((store) => store);
  const [planForm] = Form.useForm();
  const [topicForm] = Form.useForm();
  const [resourceForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePanelKey, setActivePanelKey] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planModal, setPlanModal] = useState({
    visible: false,
    mode: 'create',
    currentPlan: null
  });
  const [topicModal, setTopicModal] = useState({
    visible: false,
    mode: 'create',
    currentTopic: null,
    planId: null
  });
  const [resourceModal, setResourceModal] = useState({
    visible: false,
    mode: 'create',
    currentResource: null,
    topicId: null
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (isMounted) setLoading(true);
        await dispatch(getLearningPlans(token));
      } catch (err) {
        if (isMounted) setError("Failed to load learning plans. Please try again.");
        console.error("Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [dispatch, token]);

  const handleCreatePlan = async (values) => {
    try {
      await dispatch(createLearningPlan({
        jwt: token,
        planData: values
      }));
      setPlanModal({...planModal, visible: false});
      planForm.resetFields();
      message.success('Learning plan created successfully');
    } catch (err) {
      message.error(err.message || 'Failed to create learning plan');
    }
  };

  const handleUpdatePlan = async (values) => {
    try {
      await dispatch(updateLearningPlan({
        jwt: token,
        planId: planModal.currentPlan.id,
        planData: values
      }));
      setPlanModal({...planModal, visible: false});
      planForm.resetFields();
      message.success('Learning plan updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update learning plan');
    }
  };

  const handleDeletePlan = (planId) => {
    Modal.confirm({
      title: 'Delete Learning Plan',
      content: 'Are you sure you want to delete this learning plan?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await dispatch(deleteLearningPlan({
            jwt: token,
            planId
          }));
          message.success('Learning plan deleted successfully');
        } catch (err) {
          message.error(err.message || 'Failed to delete learning plan');
        }
      }
    });
  };

  const handleCreateTopic = async (values) => {
    try {
      const newTopic = await dispatch(addTopicToPlan({
        jwt: token,
        planId: topicModal.planId,
        topicData: {
          ...values,
          targetCompletionDate: values.targetCompletionDate?.format('YYYY-MM-DD') || null
        }
      }));
      setTopicModal({...topicModal, visible: false});
      topicForm.resetFields();
      message.success('Topic added successfully');
      
      // Update the selected plan's topics
      if (selectedPlan) {
        setSelectedPlan({
          ...selectedPlan,
          topics: [...(selectedPlan.topics || []), newTopic]
        });
      }
    } catch (err) {
      message.error(err.message || 'Failed to add topic');
    }
  };

  const handleUpdateTopic = async (values) => {
    try {
      await dispatch(updateTopic({
        jwt: token,
        topicId: topicModal.currentTopic.id,
        topicData: {
          ...values,
          targetCompletionDate: values.targetCompletionDate?.format('YYYY-MM-DD') || null
        }
      }));
      setTopicModal({...topicModal, visible: false});
      topicForm.resetFields();
      message.success('Topic updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update topic');
    }
  };

  const handleDeleteTopic = (topicId) => {
    Modal.confirm({
      title: 'Delete Topic',
      content: 'Are you sure you want to delete this topic?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await dispatch(deleteTopic({
            jwt: token,
            topicId
          }));
          message.success('Topic deleted successfully');
        } catch (err) {
          message.error(err.message || 'Failed to delete topic');
        }
      }
    });
  };

  const handleCreateResource = async (values) => {
    try {
      await dispatch(addResourceToTopic({
        jwt: token,
        topicId: resourceModal.topicId,
        resourceData: values
      }));
      setResourceModal({...resourceModal, visible: false});
      resourceForm.resetFields();
      message.success('Resource added successfully');
    } catch (err) {
      message.error(err.message || 'Failed to add resource');
    }
  };

  const handleUpdateResource = async (values) => {
    try {
      await dispatch(updateResource({
        jwt: token,
        resourceId: resourceModal.currentResource.id,
        resourceData: values
      }));
      setResourceModal({...resourceModal, visible: false});
      resourceForm.resetFields();
      message.success('Resource updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update resource');
    }
  };

  const handleDeleteResource = (resourceId) => {
    Modal.confirm({
      title: 'Delete Resource',
      content: 'Are you sure you want to delete this resource?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await dispatch(deleteResource({
            jwt: token,
            resourceId
          }));
          message.success('Resource deleted successfully');
        } catch (err) {
          message.error(err.message || 'Failed to delete resource');
        }
      }
    });
  };

  const showPlanModal = (mode = 'create', plan = null) => {
    setPlanModal({
      visible: true,
      mode,
      currentPlan: plan
    });
    if (mode === 'edit') {
      planForm.setFieldsValue({
        title: plan.title,
        description: plan.description
      });
    }
  };

  const showTopicModal = (mode = 'create', topic = null, planId = null) => {
    setTopicModal({
      visible: true,
      mode,
      currentTopic: topic,
      planId
    });
    if (mode === 'edit') {
      topicForm.setFieldsValue({
        title: topic.title,
        description: topic.description,
        completed: topic.completed,
        targetCompletionDate: topic.targetCompletionDate ? moment(topic.targetCompletionDate) : null
      });
    }
  };

  const showResourceModal = (mode = 'create', resource = null, topicId = null) => {
    setResourceModal({
      visible: true,
      mode,
      currentResource: resource,
      topicId
    });
    if (mode === 'edit') {
      resourceForm.setFieldsValue({
        url: resource.url,
        description: resource.description
      });
    }
  };

  const handlePanelChange = (key) => {
    setActivePanelKey(key);
    if (key.length > 0) {
      const planId = key[0];
      const selected = learningPlan.plans.find(plan => plan.id === planId);
      setSelectedPlan(selected);
    } else {
      setSelectedPlan(null);
    }
  };

  const renderEmptyState = () => (
    <div className="empty-state">
      <FileAddOutlined className="empty-state-icon" />
      <Title level={4} className="text-gray-600">No learning plans yet</Title>
      <Text className="text-gray-500 mb-4 block">
        Start your learning journey by creating your first plan
      </Text>
      <Button 
        type="primary"
        size="large"
        icon={<PlusOutlined />}
        onClick={() => showPlanModal()}
      >
        Create Your First Plan
      </Button>
    </div>
  );

  const renderPlanProgress = (plan) => {
    const completedTopics = plan.topics?.filter(t => t.completed).length || 0;
    const totalTopics = plan.topics?.length || 0;
    const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <Text strong>Progress</Text>
          <Text type="secondary">{completedTopics} of {totalTopics} completed</Text>
        </div>
        <Progress 
          percent={progress} 
          strokeColor={{
            '0%': '#4f46e5',
            '100%': '#7c3aed',
          }}
          showInfo={false}
          className="progress-bar"
        />
      </div>
    );
  };

  const renderTopicCard = (topic, planId) => (
    <Card
      size="small"
      className="w-full"
      title={
        <div className="flex items-center">
          <Checkbox 
            checked={topic.completed}
            className="mr-2"
            onChange={(e) => {
              const updatedTopic = {
                ...topic,
                completed: e.target.checked
              };
              dispatch(updateTopic({
                jwt: token,
                topicId: topic.id,
                topicData: updatedTopic
              }));
              // Update the selected plan's topics
              if (selectedPlan) {
                setSelectedPlan({
                  ...selectedPlan,
                  topics: selectedPlan.topics.map(t => 
                    t.id === topic.id ? updatedTopic : t
                  )
                });
              }
            }}
          />
          <span className={topic.completed ? "line-through text-gray-500" : "font-medium"}>
            {topic.title}
          </span>
        </div>
      }
      extra={
        <Space className="action-buttons">
          <Tooltip title="Add Resource">
            <Button
              size="small"
              icon={<PlusOutlined />}
              className="action-button"
              onClick={() => showResourceModal('create', null, topic.id)}
            />
          </Tooltip>
          <Tooltip title="Edit Topic">
            <Button
              size="small"
              icon={<EditOutlined />}
              className="action-button"
              onClick={() => showTopicModal('edit', topic, planId)}
            />
          </Tooltip>
          <Tooltip title="Delete Topic">
            <Button
              size="small"
              icon={<DeleteOutlined />}
              danger
              className="action-button"
              onClick={() => handleDeleteTopic(topic.id)}
            />
          </Tooltip>
        </Space>
      }
    >
      <div className="mb-2">
        <Text type="secondary">{topic.description}</Text>
      </div>
      {topic.targetCompletionDate && (
        <div className="mt-2">
          <Tag 
            icon={<ClockCircleOutlined />}
            color="orange"
          >
            Target: {new Date(topic.targetCompletionDate).toLocaleDateString()}
          </Tag>
          {new Date(topic.targetCompletionDate) < new Date() && !topic.completed && (
            <Tag color="red" className="ml-2">Overdue</Tag>
          )}
        </div>
      )}

      {topic.resources?.length > 0 && (
        <div className="mt-4">
          <Title level={5} className="mb-2">Resources</Title>
          <List
            size="small"
            dataSource={topic.resources}
            renderItem={(resource) => (
              <List.Item className="!px-0">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    <LinkOutlined className="mr-2 text-blue-500" />
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      {resource.description || resource.url}
                    </a>
                  </div>
                  <Space>
                    <Tooltip title="Edit Resource">
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        className="action-button"
                        onClick={() => showResourceModal('edit', resource, topic.id)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete Resource">
                      <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                        className="action-button"
                        onClick={() => handleDeleteResource(resource.id)}
                      />
                    </Tooltip>
                  </Space>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );

  const renderSidebar = () => (
    <div className="learning-plan-sidebar">
      <div className="learning-plan-sidebar-header">
        <div className="learning-plan-sidebar-title">
          <BookOutlined />
          Learning Plans
        </div>
        <Text className="learning-plan-sidebar-subtitle">
          Manage your learning journey
        </Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showPlanModal()}
          block
        >
          New Plan
        </Button>
      </div>

      <div className="learning-plan-sidebar-content">
        <div 
          className={`learning-plan-sidebar-item ${!selectedPlan ? 'active' : ''}`}
          onClick={() => setSelectedPlan(null)}
        >
          <HomeOutlined className="learning-plan-sidebar-item-icon" />
          <span className="learning-plan-sidebar-item-text">All Plans</span>
          <span className="learning-plan-sidebar-item-count">
            {learningPlan.plans?.length || 0}
          </span>
        </div>

        {learningPlan.plans?.map((plan) => (
          <div
            key={plan.id}
            className={`learning-plan-sidebar-item ${selectedPlan?.id === plan.id ? 'active' : ''}`}
            onClick={() => setSelectedPlan(plan)}
          >
            <BookOutlined className="learning-plan-sidebar-item-icon" />
            <span className="learning-plan-sidebar-item-text">{plan.title}</span>
            <span className="learning-plan-sidebar-item-count">
              {plan.topics?.length || 0}
            </span>
          </div>
        ))}
      </div>

      <div className="learning-plan-sidebar-footer">
        <div className="learning-plan-sidebar-item">
          <CalendarOutlined className="learning-plan-sidebar-item-icon" />
          <span className="learning-plan-sidebar-item-text">Upcoming</span>
          <Badge count={getUpcomingTopicsCount()} />
        </div>
        <div className="learning-plan-sidebar-item">
          <StarOutlined className="learning-plan-sidebar-item-icon" />
          <span className="learning-plan-sidebar-item-text">Favorites</span>
        </div>
        <div className="learning-plan-sidebar-item">
          <SettingOutlined className="learning-plan-sidebar-item-icon" />
          <span className="learning-plan-sidebar-item-text">Settings</span>
        </div>
      </div>
    </div>
  );

  const getUpcomingTopicsCount = () => {
    if (!learningPlan.plans) return 0;
    return learningPlan.plans.reduce((count, plan) => {
      return count + (plan.topics?.filter(topic => 
        !topic.completed && 
        topic.targetCompletionDate && 
        new Date(topic.targetCompletionDate) > new Date()
      ).length || 0);
    }, 0);
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-10">
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
            className="mb-4"
          />
          <Button 
            type="primary" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-10">
          <Spin size="large" />
          <Text className="block mt-4">Loading your learning plans...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-plan-container">
      {renderSidebar()}
      <div className="learning-plan-main">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="learning_plan-header">
            {selectedPlan ? selectedPlan.title : 'All Learning Plans'}
          </Title>
          {selectedPlan && (
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showTopicModal('create', null, selectedPlan.id)}
              >
                Add Topic
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={() => showPlanModal('edit', selectedPlan)}
              >
                Edit Plan
              </Button>
            </Space>
          )}
        </div>

        {error ? (
          <div className="text-center py-10">
            <Alert 
              message="Error" 
              description={error} 
              type="error" 
              showIcon 
              className="mb-4"
            />
            <Button 
              type="primary" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="text-center py-10">
            <Spin size="large" />
            <Text className="block mt-4">Loading your learning plans...</Text>
          </div>
        ) : learningPlan.plans?.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {selectedPlan ? (
              <div>
                <div className="mb-4">
                  <Text type="secondary">{selectedPlan.description}</Text>
                </div>
                {renderPlanProgress(selectedPlan)}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <Title level={4}>Topics</Title>
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => showTopicModal('create', null, selectedPlan.id)}
                    >
                      Add Topic
                    </Button>
                  </div>
                  {selectedPlan.topics?.length > 0 ? (
                    <List
                      dataSource={selectedPlan.topics}
                      renderItem={(topic) => (
                        <List.Item className="!px-0">
                          {renderTopicCard(topic, selectedPlan.id)}
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div className="text-center py-4 border-2 border-dashed rounded-lg">
                      <Text type="secondary">No topics yet</Text>
                      <div className="mt-2">
                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          onClick={() => showTopicModal('create', null, selectedPlan.id)}
                          className="w-full"
                        >
                          Add First Topic
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Collapse 
                activeKey={activePanelKey}
                onChange={handlePanelChange}
                className="mb-6"
              >
                {learningPlan.plans?.map((plan) => (
                  <Panel 
                    header={
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{plan.title}</span>
                        <div>
                          <Tag color="blue">{plan.topics?.length || 0} Topics</Tag>
                        </div>
                      </div>
                    }
                    key={plan.id.toString()}
                    extra={
                      <Space>
                        <Tooltip title="Add Topic">
                          <Button
                            size="small"
                            icon={<PlusOutlined />}
                            className="action-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              showTopicModal('create', null, plan.id);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Edit Plan">
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            className="action-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              showPlanModal('edit', plan);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete Plan">
                          <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            className="action-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlan(plan.id);
                            }}
                          />
                        </Tooltip>
                      </Space>
                    }
                  >
                    <div className="mb-4">
                      <Text type="secondary">{plan.description}</Text>
                    </div>
                    {renderPlanProgress(plan)}
                  </Panel>
                ))}
              </Collapse>
            )}
          </>
        )}

        <Modal
          title={planModal.mode === 'create' ? 'Create Learning Plan' : 'Edit Learning Plan'}
          visible={planModal.visible}
          onCancel={() => setPlanModal({...planModal, visible: false})}
          onOk={() => planForm.submit()}
          destroyOnClose
          width={600}
        >
          <Form 
            form={planForm} 
            onFinish={planModal.mode === 'create' ? handleCreatePlan : handleUpdatePlan}
            layout="vertical"
          >
            <Form.Item 
              name="title" 
              label="Plan Title" 
              rules={[
                { required: true, message: 'Please input the plan title!' },
                { max: 100, message: 'Title must be less than 100 characters' }
              ]}
            >
              <Input placeholder="Enter plan title" />
            </Form.Item>
            <Form.Item 
              name="description" 
              label="Description"
              rules={[{ max: 500, message: 'Description must be less than 500 characters' }]}
            >
              <TextArea rows={4} placeholder="Describe what you want to learn" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={topicModal.mode === 'create' ? 'Add New Topic' : 'Edit Topic'}
          visible={topicModal.visible}
          onCancel={() => setTopicModal({...topicModal, visible: false})}
          onOk={() => topicForm.submit()}
          destroyOnClose
          width={600}
        >
          <Form 
            form={topicForm} 
            onFinish={topicModal.mode === 'create' ? handleCreateTopic : handleUpdateTopic}
            layout="vertical"
          >
            <Form.Item 
              name="title" 
              label="Topic Title" 
              rules={[
                { required: true, message: 'Please input the topic title!' },
                { max: 100, message: 'Title must be less than 100 characters' }
              ]}
            >
              <Input placeholder="Enter topic title" />
            </Form.Item>
            <Form.Item 
              name="description" 
              label="Description"
              rules={[{ max: 500, message: 'Description must be less than 500 characters' }]}
            >
              <TextArea rows={3} placeholder="Describe what this topic covers" />
            </Form.Item>
            <Form.Item name="targetCompletionDate" label="Target Completion Date">
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder="Select target date"
                disabledDate={(current) => {
                  // Disable dates before today
                  return current && current < moment().startOf('day');
                }}
              />
            </Form.Item>
            <Form.Item name="completed" valuePropName="checked">
              <Checkbox>Mark as completed</Checkbox>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={resourceModal.mode === 'create' ? 'Add New Resource' : 'Edit Resource'}
          visible={resourceModal.visible}
          onCancel={() => setResourceModal({...resourceModal, visible: false})}
          onOk={() => resourceForm.submit()}
          destroyOnClose
          width={600}
        >
          <Form 
            form={resourceForm} 
            onFinish={resourceModal.mode === 'create' ? handleCreateResource : handleUpdateResource}
            layout="vertical"
          >
            <Form.Item 
              name="url" 
              label="Resource URL" 
              rules={[
                { required: true, message: 'Please input the resource URL!' },
                { type: 'url', message: 'Please enter a valid URL!' }
              ]}
            >
              <Input 
                prefix={<LinkOutlined />} 
                placeholder="https://example.com/resource" 
              />
            </Form.Item>
            <Form.Item 
              name="description" 
              label="Description (Optional)"
              rules={[{ max: 200, message: 'Description must be less than 200 characters' }]}
            >
              <Input placeholder="Brief description of the resource" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default LearningPlan;