import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Checkbox, Form, Input, Spin, } from 'antd';
import { toast } from 'react-toastify';
import { register } from '../redux/authProvider';

const Register = () => {
    const [formData, setFormData] = useState({
        email:'',
        firstName: '',
        lastName: '',
        password:'',
    });

    const { loading, error } = useSelector((state) => ({ ...state.auth }));

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = (values) => {
        if (formData !== values) setFormData((formData) => ({...formData, ...values}));
        console.log(formData);
    };

    const formDataCheck = formData.email && formData.password && formData.firstName && formData.lastName;

    /* Checking if the formDataCheck is true and if it is it will dispatch the register action. */
    useEffect(() => {
        formDataCheck && dispatch(register({formData, navigate, toast}));
    },[formData,])

    /* Checking if there is an error and if there is it will display a toast message. */
    useEffect(() => {
        if (error && formDataCheck) toast.error(error);
        console.log(error)
    },[error])

  const form_style = {
		margin: "auto",
		padding: "15px",
		maxWidth: "450px",
		alignContent: "center",
		marginTop: "120px",
	};

    return (
        <Card style={form_style} title="Register">
            <Form
                name="normal_register"
                className="register-form"
                initialValues={{
                }}
                onFinish={onFinish}
                >
                <Form.Item
                name="email"
                rules={[
                    {
                    required: true,
                    message: 'Please input your Email!',
                    },
                ]}
                value = {formData.email}
                >
                <Input
                    type="email"
                    placeholder="Email"
                />
                </Form.Item>
                <Form.Item
                name="firstName"
                rules={[
                    {
                    required: true,
                    message: 'Please input your First Name!',
                    },
                ]}
                value = {formData.firstName}
                >
                <Input
                    type="text"
                    placeholder="First Name"
                />
                </Form.Item>
                <Form.Item
                name="lastName"
                rules={[
                    {
                    required: true,
                    message: 'Please input your Last Name!',
                    },
                ]}
                value = {formData.lastName}
                >
                <Input
                    type="text"
                    placeholder="Last Name"
                />
                </Form.Item>
                <Form.Item
                name="password"
                rules={[
                    {
                    required: true,
                    message: 'Please input your Password!',
                    },
                    {
                    min: 8,
                    message:'Password must be at least 8 characters!'
                    }
                ]}
                value = {formData.password}
                >
                <Input
                    type="password"
                    placeholder="Password"
                />
                </Form.Item>
                <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    {loading && (
                    <Spin size="small"/>
                    )}
                    Join Now
                </Button>
                Or <Link to="/login"><a>login now!</a></Link>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default Register;
