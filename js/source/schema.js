import classification from './classification';

export default [
    {
        id: 'name',
        label: 'Name',
        show: true, // show in the `Excel` table
        sample: '$2 chuck',
        align: 'left', // align in `Excel`
    },
    {
        id: 'link',
        label: 'Link',
        type: 'text',
        show: true,
        sample: 'https://abc.com',
    },
    {
        id: 'username',
        label: 'User Name',
        show: false,
        sample: 'myusername',
    },
    {
        id: 'password',
        label: 'Password',
        type: 'password',
        show: false,
        sample: 'mypassword',
    },
    {
        id: 'year',
        label: 'Year',
        type: 'year',
        show: true,
        sample: 2015,
    },
    {
        id: 'grape',
        label: 'Grape',
        type: 'suggest',
        options: classification.grapes,
        show: true,
        sample: 'Merlot',
        align: 'left',
    },
    {
        id: 'rating',
        label: 'Rating',
        type: 'rating',
        show: true,
        sample: 3,
    },
    {
        id: 'comments',
        label: 'Comments',
        type: 'text',
        sample: 'Nice for the price',
    },
]