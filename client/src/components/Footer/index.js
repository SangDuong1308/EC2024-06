import classNames from 'classnames/bind';

import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function Footer() {
    return <div className={cx('wrapper')}></div>;
}

export default Footer;
