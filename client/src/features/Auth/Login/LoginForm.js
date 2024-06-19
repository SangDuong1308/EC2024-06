import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import PropTypes from 'prop-types';

import InputField from 'components/FormControls/InputField';

import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import Button from 'components/Button';

import { yupResolver } from '@hookform/resolvers/yup';

const cx = classNames.bind(styles);

LoginForm.propsTypes = {
    onSubmit: PropTypes.func.isRequired,
};

function LoginForm(props) {
    const schema = yup.object().shape({
        email: yup.string().email('Please enter a valid email.').required('Please enter your email address.'),
        password: yup.string().required('Please enter your password.'),
    });

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },

        resolver: yupResolver(schema),
    });

    const handleSubmit = async (values) => {
        const { onSubmit } = props;

        await onSubmit(values);
    };

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <InputField form={form} name="email" placeholder="Enter your email" label="Email" />
            <InputField
                form={form}
                name="password"
                placeholder="Enter your password"
                label="Password"
                type="password"
            />

            <Button classNames={cx('submit-btn')}>Login</Button>
        </form>
    );
}

export default LoginForm;
