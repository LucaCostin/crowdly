import React, { useState, useCallback, useEffect } from 'react';
import { Form, Button, Modal, Input, Upload, Tooltip } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { editPost } from '../redux/postProvider';

import { getBase64, beforeUpload, dummyRequest } from './common';

const { TextArea } = Input;

const EditPost = ({post}) => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    /* Only changes if one of the dependencies has changed. */
    const showModal = useCallback(() => setModalVisible(true), [setModalVisible]);
    const hideModal = useCallback(() => setModalVisible(false), [setModalVisible]);

    const[formData, setFormData] = useState({ });

    const { contains, imageList} = formData;

    const { error } = useSelector((state) => ({...state.post}));
    const { result } = useSelector((state) => ({...state.auth.user}));

    const dispatch = useDispatch();

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
    const handlePreview = (file) => {
        setPreviewImage(file?.thumbUrl);
        setPreviewVisible(true);
        setPreviewTitle(file?.name);
    };

    const handleChange = ( NewImageList ) => {
        setFormData({...formData, imageList: NewImageList.fileList });
        console.log(formData)
    };

    const handleTextChange = (event) => {
        setFormData({...formData, contains: event.target.value})
    }

    const postId = post._id;

    const handleFinish = async () => {
        setPending(true)
            if(contains) {
                if(imageList?.[0]?.originFileObj) imageList[0].thumbUrl = await getBase64(imageList[0]?.originFileObj);  
                const updatedPost = { ...formData, name: result?.name, username: result?.username};
                dispatch(editPost({ updatedPost, postId, toast}));
            }
            setTimeout(() => {
                setPending(false)
                Modal.success({ title: 'Success', content: 'Updated successfully!.', onOk: hideModal })
            }, 0)
    }

    useEffect(() => {
            setFormData({...post})
    },[post])

  /**
   * If the user is the author of the post, then show the edit button.
   * @returns The EditButton component is being returned.
   */
    const EditButton = () => {
        // console.log(post)
        let isUser;
        try{
            isUser = result?._id === post.user;
        }catch(err){
            isUser = false;
        }
        return (
            <>
                {isUser &&
                <Tooltip title='Edit Post'>
                    <EditOutlined key='edit' onClick={showModal}/>
                </Tooltip>}
            </>
        )
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
        <>
            <EditButton/>
            <Modal
            title="Edit Post"
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
            <Form form={form} initialValues={formData} onFinish={handleFinish}>
            <Form.Item
                name='contains'
                rules={[
                {
                    required: true,
                    message: 'Post is empty!',
                },
                ]}
            >
                <TextArea value={contains} onChange={handleTextChange} rows={4} type='text'></TextArea>
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
        </>
    )
}

export default EditPost;
