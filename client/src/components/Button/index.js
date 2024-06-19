import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './Button.module.scss';

const cx = classNames.bind(styles);

Button.propsTypes = {
    href: PropTypes.string,
    localHref: PropTypes.string,

    theme: PropTypes.bool.isRequired,
    rounded: PropTypes.bool.isRequired,
    outline: PropTypes.bool.isRequired,

    size: PropTypes.string.isRequired,

    classNames: PropTypes.object,
    callback: PropTypes.func,
    disabled: PropTypes.bool.isRequired,

    children: PropTypes.object,

    leftIcon: PropTypes.object,
    rightIcon: PropTypes.object,

    type: PropTypes.string,
};

function Button(props) {
    const {
        href,
        localHref,
        theme = true,
        rounded = false,
        outline = false,
        size = 'medium',
        classNames,
        disabled = false,
        callback,
        children,
        leftIcon,
        rightIcon,
        type = 'button',
    } = props;

    const customProps = {
        onClick: callback,
        type: type,
    };

    let Comp = 'button';
    if (href) {
        Comp = 'a';
        customProps.href = href;
    } else if (localHref) {
        Comp = Link;
        customProps.to = localHref;
    }

    if (disabled) {
        customProps.onClick = null;
    }

    const classes = cx('wrapper', {
        theme,
        rounded,
        outline,
        disabled,
        [size]: size,
        [classNames]: classNames,
    });

    return (
        <Comp {...customProps} className={classes}>
            {leftIcon && <span className={cx('icon', 'left')}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={cx('icon', 'right')}>{rightIcon}</span>}
        </Comp>
    );
}

export default Button;
