import Mock from 'mockjs';

const LoginUsers = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545047861890&' +
            'di=0466374455b70ef7cf1aeef9a125e957&imgtype=0&src=http%3A%2F%2Fp0.so.qhmsg.com%2Ft016a4678a82123d72f.jpg',
        name: 'ZJU_AIOPS'
    }
];

const Users = [];

for (let i = 0; i < 86; i++) {
    Users.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        addr: Mock.mock('@county(true)'),
        'age|18-60': 1,
        birth: Mock.Random.date(),
        sex: Mock.Random.integer(0, 1)
    }));
}

export {LoginUsers, Users};
