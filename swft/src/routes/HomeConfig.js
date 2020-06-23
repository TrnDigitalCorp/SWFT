import { strict } from "assert";

export const  HomePageConfig = {
    HeaderText: "<div>Welcome to SWFT. Please use this tool to plan all your lab and office activities.</div><div>If you need help, please try the help guides and videos on the right. If you are still having problems then please <a href='https://forms.office.com/Pages/ResponsePage.aspx?id=DpvWqfKXUkmc7miDkuQ4tN7XxzwPpIZImNnRJywlQoBURVYxTkJKUlRaRkxDS1VMM01UVEpGNFpSNS4u' target='_blank'>submit a helpdesk ticket.</a></div>",    
    ActionLinks: [
        [
            {
                Text: 'Plan an Experiment',
                Icon: '',
                Tooltip: '',
                RedirectURI: '/PlanExperiment',
                RedirectKey: '1',
            },
            {
                Text: 'Plan Lab Activity',
                Icon: '',
                Tooltip: '',
                RedirectURI: '/PlanActivity',
                RedirectKey: '2',
            },
            {
                Text: 'Plan Office Usage',
                Icon: '',
                Tooltip: '',
                RedirectURI: '/PlanOfficeSpace',
                RedirectKey: '3',
            },
        ],
        [
            {
                Text: 'View Calendar',
                Icon: '',
                Tooltip: '',
                RedirectURI: '/Calendar',
                RedirectKey: '4',
            },
            {
                Text: 'View My Activities',
                Icon: '',
                Tooltip: '',
                RedirectURI: '/MyActivities',
                RedirectKey: '5',
            },
            {
                Text: 'View Lab Today',
                Icon: 'PowerBILogo',
                Tooltip: 'Redirects to Power BI',
                RedirectURI: '',
                RedirectKey: '',
            },
            {
                Text: 'View Near Term Report',
                Icon: 'PowerBILogo',
                Tooltip: 'Redirects to Power BI',
                RedirectURI: '',
                RedirectKey: '',
            },
        ]
    ],
    GuideLinks: [
        {
            Text: 'Introduction to SWFT',
            Icon: 'PDF',
            Tooltip: '',
            RedirectURI: '',
            RedirectKey: '',
        },
        {
            Text: 'Quick Overview',
            Icon: 'MyMoviesTV',
            Tooltip: '',
            RedirectURI: '',
            RedirectKey: '',
        },
        {
            Text: 'Plan an Experiment',
            Icon: 'MyMoviesTV',
            Tooltip: '',
            RedirectURI: '',
            RedirectKey: '',
        },
        {
            Text: 'Plan Lab Activity',
            Icon: 'MyMoviesTV',
            Tooltip: '',
            RedirectURI: '',
            RedirectKey: '',
        },
        {
            Text: 'Plan Office Usage',
            Icon: 'MyMoviesTV',
            Tooltip: '',
            RedirectURI: '',
            RedirectKey: '',
        },
        {
            Text: 'Clone an Experiment or Activity',
            Icon: 'MyMoviesTV',
            Tooltip: '',
            RedirectURI: '',
            RedirectKey: '',
        }
    ]
    
};
