import LoginForm from './LoginForm';

function Login() {
    const handleSubmit = (values) => {
        console.log(values);
    };

    return (
        <div>
            <LoginForm onSubmit={handleSubmit} />
        </div>
    );
}

export default Login;
