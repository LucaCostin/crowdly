import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { Card, Button, Checkbox, Form, Input, Spin} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login, googleLogIn } from '../redux/authProvider';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';


const Login = () => {
	const [formData, setFormData] = useState({
		email:'',
		password:'',
	});

    /* Destructuring the state.auth object from redux store and assigning the loading and error properties 
    to the variables loading and error. */
    const { loading, error } = useSelector((state) => ({ ...state.auth }));

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const devEnv = process.env.NODE_ENV !== 'production';
    const clientId = devEnv ? '809592979327-k45k0jn73g1425brla32jmu88efmdf0t.apps.googleusercontent.com' : 
                                '809592979327-d2726errvuhg5ev3j3biu3jgkf9k2lsn.apps.googleusercontent.com';

    /**
     * When the form is submitted, the values of the form are logged to the console, and the formData
     * state is updated with the values of the form.
     */
    const onFinish = (values) => {
        setFormData({
        email: values.email,
        password: values.password,
        });
        };

    /* This is the code that is supposed to initialize the Google API. */
    useEffect(() => {
        function start() {
        gapi.client.init({
            clientId: clientId,
            scope: 'email',
            });
        }
        gapi.load('client:auth2', start);
    }, []);


/**
 * It takes in a response object from Google's API, and then dispatches an action to the Redux store. 
 * The action is a function that takes in the user object, and then makes an API call to the backend.
 */
    const onSuccess = (res) => {
        const user = {
        email: res?.profileObj?.email,
        name: res?.profileObj?.name,
        googleId: res?.profileObj?.googleId,
        token: res?.tokenId,
        }
        console.log(user)

        dispatch(googleLogIn({user, navigate, toast}));
    };

    const onFailure = (err) => {
        console.log(err);
        toast.error(err);
    };

    const formDataCheck = formData.email && formData.password;

    /* Calling dispatch in useEffect to force render */
    useEffect(() => {
        formDataCheck && dispatch(login({formData, navigate, toast}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formData,])

    useEffect(() => {
        if (error && formDataCheck) toast.error(error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

	const form_style = {
		margin: "auto",
		padding: "15px",
		maxWidth: "450px",
		alignContent: "center",
		marginTop: "120px",
	};

    return (
			<Card title="Log In" style={form_style}>
			<Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
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
        <Input prefix={<UserOutlined className="site-form-item-icon" />}
					type="email"
				 	placeholder="Email"
				/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
				value = {formData.password}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          {loading && (
            <Spin size="small"/>
          )}
          Log in
        </Button>
        </Form.Item>
        <br />
       <GoogleLogin 
        clientId = {clientId}
        render = {(renderProps) => (
          <Button type="primary" danger
                  className="login-form-button"
                  onClick={renderProps.onClick} 
                  disabled={renderProps.disabled}
                  icon={<GoogleOutlined />}>
            Google Log In
          </Button>
        )}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy='single_host_origin'
       />
        Or <Link to="/register"><a>register now!</a></Link>
    </Form>
			</Card>
  )
}

export default Login;
