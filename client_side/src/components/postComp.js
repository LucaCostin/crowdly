import React, { useState, useCallback, useEffect } from 'react';
import { Form, Button, Modal, Input, Upload  } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createPost } from '../redux/postProvider';
import { useNavigate } from 'react-router-dom';

import { getBase64, beforeUpload, dummyRequest } from './common';

const { TextArea } = Input;

const PostComp = () => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    /* Only changes if one of the dependencies has changed. */
    const showModal = useCallback(() => setModalVisible(true), [setModalVisible]);
    const hideModal = useCallback(() => setModalVisible(false), [setModalVisible]);

    const[formData, setFormData] = useState({ });

    const { contains, imageList } = formData;
    const { error } = useSelector((state) => ({...state.post}));
    const { user } = useSelector((state) => ({...state.auth}));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        error && toast.error(error);
    }, [error])

    const [pending, setPending] = useState(false);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewVisible(false);

    /**
     * It takes a file object, and if the file object has a url or preview property, it sets the
     * previewImage state to the url or preview property, sets the previewVisible state to true, and sets
     * the previewTitle state to the file name or the last part of the url.
     */
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
        file.preview = imageList[0]?.thumbUrl;
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ( NewImageList ) => {
        setFormData({...formData, imageList: NewImageList.fileList });
        console.log(formData)
    };


    const handleTextChange = (event) => {
        setFormData({...formData, contains: event.target.value})
    }

    /**
     * It resets the form data, hides the modal, and resets the form fields.
     */
    const resetState = () => {
        hideModal();
        setFormData({});
        form.resetFields();
    }

    /**
     * It takes the imageList array, and if it contains an image, it will get the base64 of the image and
     * then update the formData object with the image's base64 and the user's name.
     */
    const handleFinish = async () => {
        setPending(true)
        if(contains) {
            if(imageList) imageList[0].thumbUrl = await getBase64(imageList[0]?.originFileObj);
            const updatedFormData = { ...formData, name: user?.result?.name };
            console.log(updatedFormData)
            dispatch(createPost({ updatedFormData }));
        }
        setTimeout(() => {
            setPending(false)
            Modal.success({ title: 'Success', content: 'Posted successfully!.', onOk: resetState })
        }, 0)
    }

    const handleNoUser =(e) => {
        if (user?.result?._id) showModal();
        else navigate('/login');
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
            style={{
            marginTop: 8,
            }}
            >
                Upload
            </div>
        </div>
    );

    return (
        <div>
        <Input placeholder={'Create a post...'} onClick={handleNoUser} style={{'cursor':'pointer'}}/>
        <Modal
            title="New Post"
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
            <Form form={form} onFinish={handleFinish}>
            <Form.Item
                name='contains'
                rules={[
                {
                    required: true,
                    message: 'Post is empty!',
                },
                ]}
            >
                <TextArea value={contains} onChange={handleTextChange} rows={4} type='text' placeholder='Your thoughts here...'></TextArea>
            </Form.Item>
            <Form.Item
                >
                <Upload
                listType="picture-card"
                fileList={imageList}
                onPreview={handlePreview}
                onChange={handleChange}
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                >
                {imageList?.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                >
                <img
                    alt="example"
                    style={{
                    width: '100%',
                    }}
                    src={previewImage}
                />
                </Modal>
            </Form.Item>
            </Form>
        </Modal>
        </div>
    )
}

export default PostComp;
