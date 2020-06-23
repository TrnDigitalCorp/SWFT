# Introduction 
This is a library that provides an application that has an interactive tool for the workforce to plan Lab and Office activities tightly aligned to COVID - 19 work rules provided by the CDC. Users can plan their work/tasks for week(s)/day  in which they mention the location(s)  and equipment(s) they use to perform the work/task. Interactive boards/cards can be viewed along with the reporting plus analytics that can be drawn from the data stored.

# Installation and Configuration
1.	Create Azure Resource Group 
2.	Create Azure SQL Database
3.  Execute the SQL script (/DB-Scripts/OpenSourceDBSetup.sql) to create tables, stored procedures, types and populate master data. 
4.	Create Azure AD App
5.	Add the necessary API Permissions to the AD App. 

|API Permission|Type|Description|Admin consent?|
| ------------- | ------------- | ------------- | ------------- |
|profile|Delegated|View users' basic profile|No|
|User.Read.All (Exchange)|Application|Read all users' full profiles|Yes|
|Contacts.Read|Application|Read contacts in all mailboxes|Yes|
|Contacts.Read|Delegated|Read contacts in all mailboxes|No|
|Directory.Read.All|Delegated|Read directory data|Yes|
|Directory.Read.All|Application|Read directory data|Yes|
|Group.Read.All|Delegated|Read all groups|Yes|
|Group.Read.All|Application|Read all groups|Yes|
|People.Read|Delegated|Read users' relevant people lists|No|
|People.Read.All|Delegated|Read all users' relevant people lists|Yes|
|People.Read.All|Application|Read all users' relevant people lists|Yes|
|User.Read|Delegated|Sign in and read user profile|No|
|User.Read.All|Delegated|Read all users' full profiles|Yes|
|User.ReadBasic.All|Delegated|Read all users' basic profiles|No|
|User.Read.All|Application|Read all users' full profiles|Yes|

6.	Create Azure web app (Node 10.14) and app service plan
7.	Set configurations in the web app as shown below:
```
[
  {
    "name": "DATABASE",
    "value": "{/*SQL DATABASE NAME*/}",
    "slotSetting": false
  },
  {
    "name": "REACT_APP_AAD_CLIENT_ID",
    "value": "{/*AZURE AD APP CLIENT ID*/}",
    "slotSetting": false
  },
  {
    "name": "REACT_APP_AAD_TENANT_ID",
    "value": "{/*TENANT ID*/}",
    "slotSetting": false
  },
  {
    "name": "REACT_APP_APPLICATION_NAME",
    "value": "SWFT ",
    "slotSetting": false
  },
  {
    "name": "REACT_APP_HOME_PAGE_CONFIG",
    "value": “{\"HeaderText\":\"<div> <\/div>\",\"ActionLinks\":[[{\"Text\":\"Plan an Experiment\",\"Icon\":\"\",\"Tooltip\":\"\",\"RedirectURI\":\"\/PlanExperiment\",\"RedirectKey\":\"1\"},{\"Text\":\"Plan Lab Activity\",\"Icon\":\"\",\"Tooltip\":\"\",\"RedirectURI\":\"\/PlanActivity\",\"RedirectKey\":\"2\"},{\"Text\":\"Plan Office Usage\",\"Icon\":\"\",\"Tooltip\":\"\",\"RedirectURI\":\"\/PlanOfficeSpace\",\"RedirectKey\":\"3\"}],[{\"Text\":\"View Calendar\",\"Icon\":\"\",\"Tooltip\":\"\",\"RedirectURI\":\"\/Calendar\",\"RedirectKey\":\"4\"},{\"Text\":\"View My Activities\",\"Icon\":\"\",\"Tooltip\":\"\",\"RedirectURI\":\"\/MyActivities\",\"RedirectKey\":\"5\"},{\"Text\":\"View Lab Today\",\"Icon\":\"PowerBILogo\",\"Tooltip\":\"Redirects to Power BI\",\"RedirectURI\":\"\",\"RedirectKey\":\"\"},{\"Text\":\"View Near Term Report\",\"Icon\":\"PowerBILogo\",\"Tooltip\":\"Redirects to Power BI\",\"RedirectURI\":\"\",\"RedirectKey\":\"\"}]],\"GuideLinks\":[{\"Text\":\"Introduction to SWFT\",\"Icon\":\"PDF\",\"Tooltip\":\"\",\"RedirectURI\":\"\",\"RedirectKey\":\"\"},{\"Text\":\"Quick Overview\",\"Icon\":\"MyMoviesTV\",\"Tooltip\":\"\",\"RedirectURI\":\"\",\"RedirectKey\":\"\"},{\"Text\":\"Plan an Experiment\",\"Icon\":\"MyMoviesTV\",\"Tooltip\":\"\",\"RedirectURI\":\"\",\"RedirectKey\":\"\"},{\"Text\":\"Plan Lab Activity\",\"Icon\":\"MyMoviesTV\",\"Tooltip\":\"\",\"RedirectURI\":\"\",\"RedirectKey\":\"\"},{\"Text\":\"Plan Office Usage\",\"Icon\":\"MyMoviesTV\",\"Tooltip\":\"\",\"RedirectURI\":\"\",\"RedirectKey\":\"\"},{\"Text\":\"Clone an Experiment or Activity\",\"Icon\":\"MyMoviesTV\",\"Tooltip\":\"\",\"RedirectURI\":\"\",\"RedirectKey\":\"\"}]}”
    "slotSetting": false
  },
  {
    "name": "REACT_APP_OFFICE_LOCATION_ID",
    "value": "17",
    "slotSetting": false
  },
  {
    "name": "REACT_APP_OFFICE_LOCATION_NAME",
    "value": "Office",
    "slotSetting": false
  },
  {
    "name": "SCM_COMMAND_IDLE_TIMEOUT",
    "value": "1800",
    "slotSetting": false
  },
  {
    "name": "SERVER",
    "value": "{/*AZURE SERVER NAME*/}",
    "slotSetting": false
  },
  {
    "name": "SQL_USER_LOGIN",
    "value": "{/*AZURE SERVER USER LOGIN NAME*/}",
    "slotSetting": false
  },
  {
    "name": "SQL_USER_PSWD",
    "value": "{/*AZURE SERVER USER PASSWORD*/}",
    "slotSetting": false
  },
  {
    "name": "USP_CANCEL_ACTIVITIES",
    "value": "[dbo].[usp_Cancel_Activities]",
    "slotSetting": false
  },
  {
    "name": "USP_CANCEL_EXPERIMENT_ACTIVITY",
    "value": "[dbo].[usp_Cancel_Experiment_Activity]",
    "slotSetting": false
  },
  {
    "name": "USP_CLONE_ACTIVITY",
    "value": "[dbo].[usp_Clone_Activity]",
    "slotSetting": false
  },
  {
    "name": "USP_CLONE_EXPERIMENT",
    "value": "[dbo].[usp_Clone_Experiment]",
    "slotSetting": false
  },
  {
    "name": "USP_CREATE_ACTIVITY",
    "value": "[dbo].[usp_Create_Activity]",
    "slotSetting": false
  },
  {
    "name": "USP_CREATE_EXPERIMENT",
    "value": "[dbo].[usp_Create_Experiment]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_ACTIVITIES_FOR_USER",
    "value": "[dbo].[usp_Get_ActivitiesForUser]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_ACTIVITY_BY_ID",
    "value": "[dbo].[usp_Get_ActivityById]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_CALENDAR_DATA_ALL",
    "value": "[dbo].[usp_Get_CalenderData]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_EQUIPMENT_BY_LOC_ID",
    "value": "[dbo].[usp_Get_EquipmentByLocID]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_EXP_WITHOUT_ACTIVITIES_FOR_USER",
    "value": "[dbo].[usp_Get_ExpWithoutActivities]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_EXPERIMENT",
    "value": "[dbo].[usp_Get_Experiment]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_LOCATION_AND_EQUIPMENT",
    "value": "[dbo].[usp_Get_ActiveLocationAndEquipment]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_LOCATION_DATA_ALL",
    "value": "[dbo].[usp_Get_LocationAndEquipment]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_PROJECTS_DATA_ALL",
    "value": "[dbo].[usp_Get_Projects]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_SHIFT_LOCATION_AVAILABILITY",
    "value": "[dbo].[usp_Get_ShiftLocationAvailability]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_SHIFTS_DATA_ALL",
    "value": "[dbo].[usp_Get_Shifts]",
    "slotSetting": false
  },
  {
    "name": "USP_GET_SYSTEM_ADMIN_DATA",
    "value": "[dbo].[usp_Get_SystemAdminData]",
    "slotSetting": false
  },
  {
    "name": "USP_UPDATE_ACTIVITY",
    "value": "[dbo].[usp_Update_Activity]",
    "slotSetting": false
  },
  {
    "name": "USP_UPDATE_EXPERIMENT",
    "value": "[dbo].[usp_Update_Experiment]",
    "slotSetting": false
  }
]

```
8.	Update the Azure AD application with redirect URL of the web app and select the Access tokens and ID tokens.
9.	Open SSH console of the web app and run the following commands
```
npm install --save
npm run build

```
10. Browse the app using Web APP URL
