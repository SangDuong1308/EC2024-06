import classNames from 'classnames/bind';

import styles from './DefaultLayout.module.scss';

import Header from 'components/Header';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            {/* Navbar */}

            <div className={cx('content')}>{children}</div>

            {/* Footer */}
        </div>
    );
}

export default DefaultLayout;
