import React, { useState, useCallback, useEffect } from 'react';
import { Form, Button, Modal, Input, Upload, Select, DatePicker, Tooltip } from 'antd'
import { PlusOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';

import { getBase64, beforeUpload, dummyRequest } from './common';
import { editDetails } from '../redux/userProvider';
import { setUserAvatar } from '../redux/authProvider';

const { TextArea } = Input;
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const EditAccDetails = () => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    const [loading, setLoading] = useState();

    const [details, setDetails] = useState({});
    const { avatar, age, description, location, gender } = details;

    const { error, account } = useSelector((state) => ({ ...state.user }));
    const { result } = useSelector((state) => ({ ...state.auth.user }));

    useEffect(() => {
        error && toast.error(error);
    }, [error])

    useEffect(() => {
        setDetails({...account?.user?.accountDetails, avatar: account?.user?.avatar})
    },[])

    const showModal = useCallback(() => setModalVisible(true), [setModalVisible]);
    const hideModal = useCallback(() => setModalVisible(false), [setModalVisible]);

    const [pending, setPending] = useState(false);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = (image) => {
       setDetails({...details, avatar: image.fileList});
       console.log(image.fileList)
    };

 /**
  * It takes a date, calculates the age, and sets the age in the details object.
  * @param date - the date selected by the user
  */
    const handleAgeChange = (date) => {
        let today =  moment(Date.now());
        let age = today.diff(moment(date), 'years');
        setDetails({...details, age: age});
    }

    const handleDescriptionChange = (event) => {
        setDetails({...details, description: event.target.value});
    }
    const handleLocationChange = (event) => {
        setDetails({...details, location: event.target.value});
    }
    const handleGenderChange = (value) => {
        setDetails({...details, gender: value});
    }

    const dispatch = useDispatch();
    const username = account?.user?.username;

    const handleFinish =() => {
        setPending(true);
        dispatch(editDetails({ username, details }));
        const avatar = {
            name: details?.avatar?.[0]?.name,
            status: details?.avatar?.[0].status,
            thumbUrl: details?.avatar?.[0].thumbUrl
        }
        dispatch(setUserAvatar(avatar));
        setTimeout(() => {
            setPending(false)
            Modal.success({ title: 'Success', content: 'Updated successfully!.', onOk: hideModal })
        }, 0)
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div
            style={{
              marginTop: 8,
            }}
          >
            Upload
          </div>
        </div>
    );

    const EditButton = () => {
        // console.log(post)
        let isUser;
        try{
            isUser = result?._id === account?.user?._id;
        }catch(err){
            isUser = false;
        }
        return (
            <>
                {isUser &&
                <Tooltip title='Edit account details'>
                    <EditOutlined key='edit' onClick={showModal}/>
                </Tooltip>
                }
            </>
        )
    }

    return (
        <>
            <EditButton/>
        <Modal
          title="Edit Details"
          closable={!pending}
          maskClosable={!pending}
          visible={modalVisible}
          destroyOnClose
          onCancel={hideModal}
          okText={pending ? 'Loading...' : 'Ok'}
          footer={[
            <Button key="back" onClick={hideModal}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={pending} onClick={() => form.submit()}>
              Submit
            </Button>
        ]}
      >
        <Form form={form} initialValues={details} onFinish={handleFinish}>
          <Form.Item
            rules={[
              {
                required: false,
                // message: 'Post is empty!',
              },
            ]}
          >
            <TextArea value={description} onChange={handleDescriptionChange} placeholder={'Write something about you..'} rows={4} type='text'/>
        </Form.Item>
        <Form.Item>
            <Input.Group >
                <Select defaultValue={gender} placeholder={'Select gender'} onChange={handleGenderChange}>
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                </Select>
            </Input.Group>
        </Form.Item>
        <Form.Item>
            <DatePicker defaultValue={moment('2000/01/01', dateFormat)} placeholder='Select Birth Date' onChange={handleAgeChange} />
        </Form.Item>
        <Form.Item>
            <Input value={location} onChange={handleLocationChange} placeholder='Write your location' type="text"/>
        </Form.Item>
        <Form.Item>
            <Upload
              listType="picture-card"
              fileList={avatar}
              onPreview={handlePreview}
              onChange={handleChange}
              customRequest={dummyRequest}
              beforeUpload={beforeUpload}
              >
              {avatar?.length >= 1? (
                null
            ) : (
                uploadButton
            )}
            </Upload>
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="avatar"
                style={{
                  width: '100%',
                }}
                src={previewImage}
              />
            </Modal>
          </Form.Item>
        </Form>
      </Modal>
      </>
    )
}

export default EditAccDetails
