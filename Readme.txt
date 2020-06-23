    The SWFT solution is designed to help organization plan the safe return of scientists to the lab.  It allows scientists to plan their lab activity at a program level and allows scientists, team leads and managers to view the aggregated lab space usage.

    The SWFT tool should not be used in isolation.  It is essential that you work with your lab manager(s) to assess the lab space and understand its capacity with OSHA and CDC guidance in mind.  You should also work closely with your scientists to understand their workflow in the lab and look at ways to reduce their cross lab movement.  This could include moving instruments or supplies.  

    SWFT is only successful when these pieces all come together and when Scientists are part of the process from the beginning.  We hope you find this tool/approach useful.  Together we will get through this Covid situation.

## Getting started
    1)	Unzip the SWFT.zip to ‘C:\’  
    2)	Open the pbix file in Power Bi Desktop
	SWFT_DEMO.pbix pulls data from the 3 Excel files included in the folder.
 
    If you unzip to C:\SWFT to start, then the Power Bi file will already have the correct path to the demo Excel files. Otherwise the file paths will need to be updated to the user's file path.

# Changing the source of the Excel files - Method 1
    Within Power Bi Desktop
    Click 'File' from the menu bar
    Navigate to 'Options and settings' and select Data source settings
    Change the source of each of the files
    Confirm the changes

# Changing the source of the Excel files - Method 2
    Within Power Bi Desktop the source file paths can also be edited in the Advanced Editor for each of the query files that pull data from the Excel files. (The name for these queries end in ‘pull’). 

    A SharePoint file can also be used as the source for Power Bi server refreshes. The user will need to follow the prompts within Power Bi Desktop for connecting to a SharePoint folder, and then specify the excel file(s).

## Power Bi Table descriptions

     Project1pull and Project2pull: These queries pull the Excel tables from the files which are expected to contain the activity data entered by one or more users. By default, the filter will pull data only from tables with names that contain the text ‘table’.
StudyActivityPrioritypull: This query pulls the priority table which contains Study names and metadata that is useful for filtering or grouping the downstream activity data.

    TablePullAppend: This query is a join (row append) of the tables from Excel files of the previous pulls.

    DateShiftTable: This query generates a table of all dates from the earliest date to the latest in the TablePullAppend table. This data is merged with Shifts to give a full set of all possible day-shifts for the activities. Finally, the data is merged against the TablePullAppend using a Left Outer to yield a data table will empty day-shift rows where activities were not recorded in the Project Excel tables.

    TablePullAppendAllDates: This query combines the TablePullAppend table with the DateShiftTable to yield a data table with all day-shifts. This serves as the primary table for the visual reports.

    LastRefreshed: This query creates a table with the current datetime for reporting when the last data refresh occurred.

## Excel Project files
Each file contains a guidance tab for filling out the activity tables and for creating new tables. The pbix file expects the activity data to be formal Excel tables. When the tables are expanded or additional tables are added, minimal changes to the pbix file will be required to pull in the additional data. At the start, the table pulls filter to only Excel workbook tables with names that contain the text ‘table’.
