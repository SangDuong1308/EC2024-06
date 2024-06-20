import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import classNames from 'classnames/bind';

import styles from './InputField.module.scss';
import { type } from '@testing-library/user-event/dist/type';

const cx = classNames.bind(styles);

InputField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,

    label: PropTypes.string,
    classNames: PropTypes.object,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    type: PropTypes.string,
};

function InputField(props) {
    const { form, name, label, classNames, disabled, placeholder, type = 'text' } = props;
    const { errors } = form.formState;
    const hasErrors = !!errors[name];

    const classes = cx('wrapper', {
        [classNames]: classNames,
    });

    return (
        <Controller
            control={form.control}
            name={name}
            render={({ field: { onChange, onBlur, value, name } }) => (
                <>
                    {label && (
                        <div className={cx('label')} htmlFor={name}>
                            {label}
                        </div>
                    )}
                    <input
                        type={type}
                        className={classes}
                        placeholder={placeholder || ''}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                    />
                    {hasErrors && <span className={cx('error-message')}>{errors[name]}</span>}
                </>
            )}
        />
    );
}

export default InputField;
