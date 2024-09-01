## APIs docs
[APIs documentation](https://documenter.getpostman.com/view/30706098/2sA3rzLszY)

## Database Seed

* The seed command will create an admin user in the database
* The email and password are passed with the command as arguments
* Like below command, replace brackets with email and password.
* For more information, see code [here](src/utils/seed.js)

```
npm run seed:admin [email-***@****.com] [password-******] // This is just an example.
```

* For more information, see code [here](src/data/seedDB.js)

```
node .\seedDB.js --import

```
* Delete Data
```
node .\seedDB.js --delete

```
## Thông tin thẻ ngân hàng - sử dụng cho việc test tích hợp Cổng ZaloPay

### Thông tin thẻ Visa, Master, JCB

| **Thông tin**       | **Chi tiết**              | **Ghi chú** |
|---------------------|---------------------------|-------------|
| **Số thẻ**          | 4111 1111 1111 1111        |             |
| **Tên**             | NGUYEN VAN A               |             |
| **Ngày hết hạn**    | 01/25                      |             |
| **Mã CVV**          | 123                        |             |


## Thông tin thẻ ngân hàng - sử dụng cho việc test tích hợp Cổng VnPay

| **Thông tin**       | **Chi tiết**              | **Ghi chú** |
|---------------------|---------------------------|-------------|
| **Ngân hàng**       | NCB                        | Thành công  |
| **Số thẻ**          | 9704 1985 2619 1432 198    |             |
| **Tên chủ thẻ**     | NGUYEN VAN A               |             |
| **Ngày phát hành**  | 07/15                      |             |
| **Mật khẩu OTP**    | 123456                     |             |

