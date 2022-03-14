module.exports = {
    title: "Chronocraft DatePicker - A VueJS 3.0 Efficient DatePicker Component",
    description: "The Chronocraft DatePicker is a flexible datepicker component created for Vue3",
    theme: '@vuepress/theme-default',
    base: '/',
    themeConfig: {
        sidebar: [
            {
                text: 'Get Started',
                link: '/getstarted',
                children: [],
            },
            {
                text: 'About',
                link: '/about',
                children: [],
            },
            {
                text: 'Library Components',
                link: '/librarycomponents',
                children: [],
            },
            {
                text: 'Github',
                link: 'https://github.com/yannisraft/chronocraft-datepicker-vue',
                children: [],
            }
        ]

    },
    docsRepo: 'https://gitlab.com/owner/name',
    docsBranch: 'master',
    docsDir: 'docs',
    editLinkPattern: ':repo/-/edit/:branch/:path',
}