import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import images from 'assets/images';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div>
            <img src={images.homeCover} className={cx('image')} />
        </div>
    );
}

export default Home;
