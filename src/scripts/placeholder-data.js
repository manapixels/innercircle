const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User 11111',
    email: 'user1@nextmail.com',
    password: '123456',
  },
  {
    id: '410544b2-4001-4271-9855-abcdef11223344c',
    name: 'User 22222',
    email: 'user2@nextmail.com',
    password: '123456',
  },
];

const events = [
  {
    customer_id: customers[0].id,
    status: 'pending',
    date_start: '2022-12-06',
    date_end: '2022-12-06',
    customer_id: [customers[0].id,]
  },
  {
    customer_id: customers[1].id,
    status: 'pending',
    date_start: '2022-11-14',
    date_end: '2022-12-14',
    customer_id: []
  },
  {
    customer_id: customers[4].id,
    status: 'paid',
    date_start: '2022-10-29',
    date_end: '2022-12-29',
    customer_id: []
  },
  {
    customer_id: customers[3].id,
    status: 'paid',
    date_start: '2023-09-10',
    date_end: '2023-12-10',
    customer_id: []
  },
  {
    customer_id: customers[5].id,
    status: 'pending',
    date_start: '2023-08-05',
    date_end: '2023-12-05',
    customer_id: []
  },
];

module.exports = {
  users,
  events,
};