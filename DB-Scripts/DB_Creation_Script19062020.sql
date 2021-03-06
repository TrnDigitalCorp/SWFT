/****** Object:  UserDefinedTableType [dbo].[Ids]    Script Date: 19-06-2020 16:01:43 ******/
CREATE TYPE [dbo].[Ids] AS TABLE(
	[ID] [int] NULL
)
GO
/****** Object:  Table [dbo].[Activity]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Activity](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ExperimentId] [int] NULL,
	[Name] [nvarchar](255) NULL,
	[Description] [nvarchar](max) NULL,
	[DayOffset] [int] NULL,
	[ActivityDate] [datetime] NULL,
	[BookedByEmail] [nvarchar](255) NULL,
	[BookedForEmail] [nvarchar](255) NULL,
	[StatusId] [int] NULL,
	[BookedByName] [nvarchar](255) NULL,
	[BookedForName] [nvarchar](255) NULL,
	[Created] [datetime] NULL,
	[Modified] [datetime] NULL,
	[IsEmployee] [bit] NULL,
	[PBIDate]  AS (format([ActivityDate],'ddd-ddMMMM')),
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ActivityLocation]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActivityLocation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ActivityId] [int] NULL,
	[LocationId] [int] NULL,
	[Created] [datetime] NULL,
	[Modified] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ActivityShift]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActivityShift](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ActivityId] [int] NULL,
	[ShiftId] [int] NULL,
	[Created] [datetime] NULL,
	[Modified] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Location]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Location](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Capacity] [int] NULL,
	[Description] [nvarchar](max) NULL,
	[StatusId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Shift]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shift](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[StartHour] [int] NULL,
	[StartMin] [int] NULL,
	[EndHour] [int] NULL,
	[EndMin] [int] NULL,
	[DisplayName] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[BookedForNameByActivitySLC]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[BookedForNameByActivitySLC] AS
SELECT 
CAST (ACT.ActivityDate AS DATE) AS ActivityDate
,SH.Name AS Shift
,LO.Name AS Location
,LO.Capacity
,COUNT (DISTINCT ACT.BookedForName) AS BookedForNameCount
FROM
Activity ACT
LEFT JOIN ActivityShift ACS ON ACT.Id=ACS.ActivityId
LEFT JOIN Shift SH ON ACS.ShiftId=SH.Id
LEFT JOIN ActivityLocation ACL ON ACT.Id=ACL.ActivityId
LEFT JOIN Location LO ON ACL.LocationId=LO.Id
WHERE ACT.StatusId = 1
GROUP BY 
ACT.ActivityDate
,SH.Name
,LO.Name
,LO.Capacity
GO
/****** Object:  Table [dbo].[ActivityAudit]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActivityAudit](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ActivityId] [int] NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedByEmail] [nvarchar](255) NULL,
	[Notes] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ActivityEquipment]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActivityEquipment](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ActivityId] [int] NULL,
	[EquipmentId] [int] NULL,
	[Created] [datetime] NULL,
	[Modified] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DateTable]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DateTable](
	[ActivityDate] [date] NOT NULL,
	[ShiftName] [nvarchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Equipment]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Equipment](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[EquipmentTypeId] [int] NULL,
	[LocationId] [int] NULL,
	[Status] [nvarchar](255) NULL,
	[StatusId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EquipmentType]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EquipmentType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Description] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Experiment]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Experiment](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProjectId] [int] NULL,
	[Name] [nvarchar](255) NULL,
	[StartDate] [datetime] NULL,
	[Description] [nvarchar](max) NULL,
	[StatusId] [int] NULL,
	[Remarks] [nvarchar](max) NULL,
	[Owner] [nvarchar](255) NULL,
	[OwnerName] [nvarchar](255) NULL,
	[Created] [datetime] NULL,
	[Modified] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Project]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Priority] [int] NULL,
	[Description] [nvarchar](max) NULL,
	[StatusId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Status]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Status](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SystemAdmin]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SystemAdmin](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[EmailId] [nvarchar](255) NULL,
	[IsActive] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD FOREIGN KEY([ExperimentId])
REFERENCES [dbo].[Experiment] ([Id])
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [dbo].[Status] ([Id])
GO
ALTER TABLE [dbo].[ActivityAudit]  WITH CHECK ADD FOREIGN KEY([ActivityId])
REFERENCES [dbo].[Activity] ([Id])
GO
ALTER TABLE [dbo].[ActivityEquipment]  WITH CHECK ADD FOREIGN KEY([ActivityId])
REFERENCES [dbo].[Activity] ([Id])
GO
ALTER TABLE [dbo].[ActivityEquipment]  WITH CHECK ADD FOREIGN KEY([EquipmentId])
REFERENCES [dbo].[Equipment] ([Id])
GO
ALTER TABLE [dbo].[ActivityLocation]  WITH CHECK ADD FOREIGN KEY([ActivityId])
REFERENCES [dbo].[Activity] ([Id])
GO
ALTER TABLE [dbo].[ActivityLocation]  WITH CHECK ADD FOREIGN KEY([LocationId])
REFERENCES [dbo].[Location] ([Id])
GO
ALTER TABLE [dbo].[ActivityShift]  WITH CHECK ADD FOREIGN KEY([ActivityId])
REFERENCES [dbo].[Activity] ([Id])
GO
ALTER TABLE [dbo].[ActivityShift]  WITH CHECK ADD FOREIGN KEY([ShiftId])
REFERENCES [dbo].[Shift] ([Id])
GO
ALTER TABLE [dbo].[Equipment]  WITH NOCHECK ADD FOREIGN KEY([EquipmentTypeId])
REFERENCES [dbo].[EquipmentType] ([Id])
GO
ALTER TABLE [dbo].[Equipment]  WITH NOCHECK ADD FOREIGN KEY([LocationId])
REFERENCES [dbo].[Location] ([Id])
GO
ALTER TABLE [dbo].[Equipment]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [dbo].[Status] ([Id])
GO
ALTER TABLE [dbo].[Equipment]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [dbo].[Status] ([Id])
GO
ALTER TABLE [dbo].[Experiment]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([Id])
GO
ALTER TABLE [dbo].[Experiment]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [dbo].[Status] ([Id])
GO
ALTER TABLE [dbo].[Location]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [dbo].[Status] ([Id])
GO
ALTER TABLE [dbo].[Location]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [dbo].[Status] ([Id])
GO
ALTER TABLE [dbo].[Project]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [dbo].[Status] ([Id])
GO
ALTER TABLE [dbo].[Project]  WITH CHECK ADD FOREIGN KEY([StatusId])
REFERENCES [dbo].[Status] ([Id])
GO
/****** Object:  StoredProcedure [dbo].[usp_Cancel_Activities]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:     Saurabh Jain
-- Create Date: 02-06-2020
-- Description: This stored procedure cancel the future activities.
-- =============================================
CREATE PROCEDURE [dbo].[usp_Cancel_Activities]
(
@ActivityIds AS dbo.IDs READONLY,
@Notes nvarchar(max) = null
)
AS
BEGIN  
	BEGIN TRY
	DECLARE @today date;
	SET @today = (SELECT CAST(CAST(GETDATE() AS DATE) AS DATETIME))
	update Activity Set StatusId  = 2, [Modified]=GETDATE()  where ID IN (Select ID from @ActivityIds) and ActivityDate >= @today

		DECLARE @ModifiedOnDate datetime
		Set @ModifiedOnDate = GETDATE()
		INSERT INTO ActivityAudit
		(ActivityId,ModifiedOn,Notes) 
		select Id,@ModifiedOnDate,@Notes from @ActivityIds
		

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END


/****** Object:  StoredProcedure [dbo].[usp_Clone_Activity]    Script Date: 6/15/2020 2:32:30 PM ******/
SET ANSI_NULLS ON


GO
/****** Object:  StoredProcedure [dbo].[usp_Cancel_Experiment_Activity]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Cancel_Experiment_Activity]
(
@ExperimentId int = null,
@ActivityId [int] = null,
@Notes nvarchar(max) = null
)
AS
BEGIN  
	BEGIN TRY 
	DECLARE @ModifiedOnDate datetime
	Set @ModifiedOnDate = GETDATE()

	IF (@ExperimentId IS NOT null)
		BEGIN
		update Experiment Set StatusId = 2 , [Modified]=@ModifiedOnDate where Id = @ExperimentId
		update Activity Set StatusId  = 2, [Modified]=@ModifiedOnDate  where ExperimentId = @ExperimentId
		INSERT INTO ActivityAudit
		(ActivityId,ModifiedOn,Notes)Select Id,@ModifiedOnDate,@Notes from Activity where ExperimentId = @ExperimentId
		
		END
	ELSE
		BEGIN
		update Activity Set StatusId  = 2, [Modified]=@ModifiedOnDate where Id = @activityid
		INSERT INTO ActivityAudit
		(ActivityId,ModifiedOn,Notes)  VALUES
		(@ActivityId,@ModifiedOnDate,@Notes)
		END
		
		
	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Clone_Activity]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author:      Surya Saurav Mishra
-- Create Date: 02-06-2020
-- Description: This stored procedure creates clone of an activity and its associated records.
-- =============================================
CREATE PROCEDURE [dbo].[usp_Clone_Activity]
(
    -- Add the parameters for the stored procedure here
    @ActivityId int,
	@ExperimentId int = null,	
	@ExperimentStartDate date = null,
	@CloneId int OUTPUT
)
AS
BEGIN
    BEGIN TRY
		
		DECLARE @ActDate date;
		DECLARE @TodayDate date;

		SET @TodayDate = (SELECT CAST(CAST(GETDATE() AS DATE) AS DATETIME));
		
		--if activity is not part of an experiment, then set activity date of clone as "Tomorrow" otherwise set it "Tomorrow + Offset"
		IF @ExperimentStartDate is null
		BEGIN
			SET @ActDate=(SELECT CASE WHEN ActivityDate < @TodayDate THEN DATEADD(DAY, 1, @TodayDate) ELSE ActivityDate END FROM Activity where Id=@ActivityId);			
		END
		ELSE
		BEGIN
			SET @ActDate=(SELECT DATEADD(DAY, DayOffset, @ExperimentStartDate) FROM Activity where Id=@ActivityId);			
		END

		INSERT INTO Activity (
			[ExperimentId]
           ,[Name]
           ,[Description]
           ,[DayOffset]
           ,[ActivityDate]
           ,[BookedByEmail]
           ,[BookedForEmail]
           ,[StatusId]
           ,[BookedByName]
           ,[BookedForName]
           ,[IsEmployee]
		   ,[Created]
		   ,[Modified]
		   )
		SELECT 
			CASE WHEN @ExperimentId is null then [ExperimentId] ELSE @ExperimentId END
           ,[Name]
           ,[Description]
           ,[DayOffset]
           ,@ActDate
           ,[BookedByEmail]
           ,[BookedForEmail]
           ,1
           ,[BookedByName]
           ,[BookedForName]
           ,[IsEmployee]
		   ,GETDATE()
		   ,GETDATE()
			FROM Activity
			WHERE id = @ActivityId;

		SET @CloneId = SCOPE_IDENTITY()

		--clone ActivityShift records
		DECLARE @shiftId int;
		DECLARE cursor_shifts CURSOR FOR SELECT ShiftId from ActivityShift where ActivityId=@ActivityId;
		OPEN cursor_shifts;
		FETCH NEXT FROM cursor_shifts INTO @shiftId;
		WHILE @@FETCH_STATUS=0
		BEGIN
			INSERT INTO ActivityShift(ActivityId, ShiftId,[Created],[Modified]) VALUES (@CloneId, @shiftId,GETDATE(),GETDAte())
			FETCH NEXT FROM cursor_shifts INTO @shiftId;
		END
		CLOSE cursor_shifts;
		DEALLOCATE cursor_shifts;

		--clone ActivityLocation records
		DECLARE @locationId int;
		DECLARE cursor_locations CURSOR FOR SELECT LocationId from ActivityLocation where ActivityId=@ActivityId;
		OPEN cursor_locations;
		FETCH NEXT FROM cursor_locations INTO @locationId;
		WHILE @@FETCH_STATUS=0
		BEGIN
			INSERT INTO ActivityLocation(ActivityId, LocationId,[Created],[Modified]) VALUES (@CloneId, @locationId,GETDATE(),GETDAte())
			FETCH NEXT FROM cursor_locations INTO @locationId;
		END
		CLOSE cursor_locations;
		DEALLOCATE cursor_locations;

		--clone ActivityEquipment records
		DECLARE @equipmentId int;
		DECLARE cursor_equipment CURSOR FOR SELECT EquipmentId from ActivityEquipment where ActivityId=@ActivityId;
		OPEN cursor_equipment;
		FETCH NEXT FROM cursor_equipment INTO @equipmentId;
		WHILE @@FETCH_STATUS=0
		BEGIN
			INSERT INTO ActivityEquipment(ActivityId, EquipmentId,[Created],[Modified]) VALUES (@CloneId, @equipmentId,GETDATE(),GETDAte())
			FETCH NEXT FROM cursor_equipment INTO @equipmentId;
		END
		CLOSE cursor_equipment;
		DEALLOCATE cursor_equipment;

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Clone_Experiment]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      Surya Saurav Mishra
-- Create Date: 2020-06-02
-- Description: Creates a clone of an experiment, its activities and all associated records of the activity
-- =============================================
CREATE PROCEDURE [dbo].[usp_Clone_Experiment]
(
	@ExperimentId int,
	@CloneExpId int OUTPUT,
	@CloneId int OUTPUT
)
AS
BEGIN
    BEGIN TRY
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON

	DECLARE @TodayDate date;
	DECLARE @ExptStartDate date;
	SET @TodayDate = (SELECT CAST(CAST(GETDATE() AS DATE) AS DATETIME));
	-- set start date for new cloned experiment to "Tomorrow" if original start date is in the past else set to original start date
	SET @ExptStartDate = (SELECT CASE WHEN StartDate < @TodayDate THEN DATEADD(DAY, 1, @TodayDate) ELSE StartDate END FROM Experiment WHERE Id = @ExperimentId);

	INSERT INTO [dbo].[Experiment]
		   ([ProjectId]
           ,[Name]
           ,[StartDate]
           ,[Description]
           ,[StatusId]
           ,[Remarks]
           ,[Owner]
           ,[OwnerName]
		   ,[Created]
		   ,[Modified]
		   )
	SELECT 
			[ProjectId]
           ,[Name] +' (Cloned)'
           ,@ExptStartDate	
           ,[Description]
           ,1
           ,''
           ,[Owner]
           ,[OwnerName]
		   ,GETDATE()
		   ,GETDATE()
	FROM [dbo].[Experiment]
	WHERE Id=@ExperimentId

	SET @CloneExpId=SCOPE_IDENTITY()

	--clone Activity records
	DECLARE @activityId int;
	-- STATIC is very important otherwise it goes into infinite loop
	DECLARE cursor_activity CURSOR STATIC FOR SELECT Id from Activity where ExperimentId=@ExperimentId and StatusId =1;	
	OPEN cursor_activity;
	FETCH NEXT FROM cursor_activity INTO @activityId;
	WHILE @@FETCH_STATUS=0
	BEGIN		 
		Exec [dbo].[usp_Clone_Activity] @ActivityId=@activityId, @ExperimentId=@CloneExpId, @ExperimentStartDate=@ExptStartDate, @CloneId = @CloneId OUTPUT
		FETCH NEXT FROM cursor_activity INTO @activityId;
	END
	CLOSE cursor_activity;
	DEALLOCATE cursor_activity;

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Create_Activity]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Create_Activity]
(
@ExperimentId int = null,
@ExperimentOwner nvarchar(255) = null,
@ActivityName nvarchar(255),
@ActivityDescription nvarchar(max),
@DayOffset int = 0,
@ActivityDate datetime,
@BookedByEmail nvarchar(255),
@BookedForEmail nvarchar(255),
@BookedByName nvarchar(255),
@BookedForName nvarchar(255),
@ShiftIds AS dbo.IDs READONLY,
@LocationIds AS dbo.IDs READONLY,
@EquipmentIds AS dbo.IDs READONLY,
@Notes nvarchar(max) = null,
@IsEmployee BIT,
@ActivityId [int] OUTPUT
)
AS
BEGIN  
    set nocount on;
	BEGIN TRY 
	    BEGIN TRANSACTION 
	    INSERT INTO Activity    
        ([ExperimentId],[Name],[Description],[DayOffset],[ActivityDate],[BookedByEmail],[BookedForEmail],[BookedByName],[BookedForName],[StatusId],[IsEmployee],[Created],[Modified]) VALUES
	    (@ExperimentId,	@ActivityName,@ActivityDescription,	@DayOffset,	@ActivityDate,@BookedByEmail, @BookedForEmail,@BookedByName,@BookedForName,1,@IsEmployee,GETDATE(),GETDATE())
	
		SET @ActivityId = SCOPE_IDENTITY()

		INSERT INTO ActivityShift (ActivityId,ShiftId,[Created],[Modified])SELECT  @ActivityId, Id, GETDATE(), GETDATE() from @ShiftIds

	    INSERT INTO ActivityLocation (ActivityId,LocationId,[Created],[Modified])SELECT  @ActivityId, Id, GETDATE(), GETDATE() from @LocationIds

		INSERT INTO ActivityEquipment (ActivityId,EquipmentId,[Created],[Modified])SELECT @ActivityId, Id, GETDATE(), GETDATE() from @EquipmentIds

		COMMIT

		DECLARE @ModifiedOnDate datetime
		Set @ModifiedOnDate = GETDATE()
		INSERT INTO ActivityAudit
		(ActivityId,ModifiedOn,ModifiedByEmail,Notes)  VALUES
		(@ActivityId,@ModifiedOnDate,@BookedByEmail,@Notes)


	RETURN @@ERROR
	END TRY
	BEGIN CATCH
	    IF @@TRANCOUNT > 0
        ROLLBACK
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Create_Experiment]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Create_Experiment]
(
@ProjectId nvarchar(255) = null,
@ExpName nvarchar(255),
@ExpStartDate datetime,
@ExpDescription nvarchar(max),
@ExpRemarks nvarchar(max),
@ExpOwner nvarchar(255),
@ExpOwnerName nvarchar(255),
@ExperimentId [int] OUTPUT
)
AS
BEGIN  
    set nocount on;
	BEGIN TRY 	    
	    INSERT INTO Experiment    
        ([ProjectId] ,[Name] ,[StartDate] ,[Description] ,[StatusId],[Remarks],[Owner],[OwnerName],[Created],[Modified]) VALUES
	    (@ProjectId, @ExpName, @ExpStartDate,@ExpDescription,1,@ExpRemarks,@ExpOwner, @ExpOwnerName,GETDATE(),GETDATE())	

		SET @ExperimentId = SCOPE_IDENTITY()

	RETURN @@ERROR
	END TRY
	BEGIN CATCH	   
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_ActiveLocationAndEquipment]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[usp_Get_ActiveLocationAndEquipment]
(@Status nvarchar(250) = 'functioning')
AS
BEGIN  
	BEGIN TRY
	 SELECT loc.[Id] as LocationId
      ,loc.[Name] as LocationName
	  ,loc.[Description] as LocationDescription
	  ,loc.[Capacity] as LocationCapacity
      ,eqp.[EquipmentTypeId] as EquipmentTypeId
	  ,eqp.[Id] as EquipmentId
      ,eqp.[Name] as EquipmentName
  FROM [dbo].[Location] as loc LEFT JOIN [dbo].[Equipment] as eqp ON loc.Id = eqp.LocationId 
  Where loc.StatusId=1 and eqp.[StatusId] =1 and eqp.Status = @Status or (loc.StatusId=1 and eqp.Status is null) ORDER BY loc.[Name] ASC 

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_ActivitiesForUser]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      SURYA
-- Create Date: 23-MAY-2020
-- Description: THIS SP GETS ALL ACTIVITIES WHICH A SPECIFIED USER (OF FOR ALL  IS TAGGED TO (AS EXPT OWNER, ACTIVITY CREATOR OR ACTIVITY USER)
-- =============================================
CREATE PROCEDURE [dbo].[usp_Get_ActivitiesForUser]
(
    @userEmail varchar(255) null,
	@statusId int null,
	@experimentId int null
)
AS
BEGIN
    BEGIN TRY
		SELECT --TOP 10
		AC.Id ActivityId,
		AC.Name ActivityName,
		AC.ActivityDate,
		AC.Description ActivityDescription,
		AC.BookedByEmail,
		Ac.BookedByName,
		AC.BookedForEmail,
		Ac.BookedForName,
		AC.DayOffset,
		EX.Id ExperimentId,
		EX.Name ExperimentName,
		EX.Owner,
		EX.StartDate as ExperimentStartDate,
		SH.DisplayName ShiftName,
		LO.Name LocationName,
		EQ.Name EquipmentName
		FROM
		DBO.Activity AC 
		LEFT JOIN DBO.Experiment EX ON AC.ExperimentId=EX.Id
		LEFT JOIN DBO.ActivityShift ACS ON AC.Id=ACS.ActivityId
		LEFT JOIN DBO.ActivityLocation ACL ON AC.Id=ACL.ActivityId
		LEFT JOIN DBO.ActivityEquipment ACE ON AC.Id=ACE.ActivityId
		LEFT JOIN DBO.Shift SH ON ACS.ShiftId=SH.Id
		LEFT JOIN DBO.Location LO ON ACL.LocationId=LO.Id
		LEFT JOIN DBO.Equipment EQ ON ACE.EquipmentId=EQ.Id
		WHERE 		
		(@userEmail IS NULL OR (AC.BookedByEmail=@userEmail OR AC.BookedForEmail=@userEmail OR EX.Owner=@userEmail))
		AND (@statusId IS NULL OR AC.StatusId=@statusId) 
		AND (@experimentId IS NULL OR EX.Id=@experimentId) 
		--AND EX.StatusId=1	--only fetch active experiments
		ORDER BY AC.Id	
	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_ActivityById]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Get_ActivityById]
(@ActivityId Int)
AS
BEGIN  
    set nocount on;
	BEGIN TRY
	 SELECT 
	   ex.[Id] as ExperimentId
	  ,ex.[Owner] as ExperimentOwner
	  ,ex.[OwnerName] as ExperimentOwnerName
	  ,ex.[StatusId] as ExperimentStatusId
	  ,ex.[StartDate] as ExperimentStartDate
	  ,act.[Id] as ActivityId
      ,act.[Name] as ActivityName 
      ,act.[Description] as ActivityDescription
      ,act.[DayOffset] 
      ,act.[ActivityDate]
      ,act.[BookedByEmail]
      ,act.[BookedForEmail]
      ,act.[BookedByName]
      ,act.[BookedForName]
	  ,act.[IsEmployee],
	  act.[StatusId] as ActivityStatus
	  FROM [dbo].Activity as act 
	  LEFT JOIN [dbo].Experiment ex ON act.ExperimentId = ex.ID
	  Where act.Id = @ActivityId

	  Select LocationId as Id from ActivityLocation  Where ActivityId = @ActivityId
	  Select ShiftId as Id from ActivityShift  Where ActivityId = @ActivityId
	  Select EquipmentId as Id from ActivityEquipment  Where ActivityId = @ActivityId
	 

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_CalenderData]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[usp_Get_CalenderData]
(
 @CalenderDate datetime
)
AS
BEGIN  
	BEGIN TRY	     
		SELECT 
		ACT.Id ActivityId,
		ACT.Name ActivityName,		
		ACT.Description as ActivityDescription,
		ACT.DayOffset ActivityDayOffset,
		ACT.ActivityDate, 
		ACT.BookedByEmail, 
		ACT.BookedForEmail, 
		ACT.BookedByName, 
		ACT.BookedForName,
		ACT.IsEmployee,
		EX.Id as ExperimentId,
		EX.Name as ExperimentName,
		ACS.ShiftId, 
		ACL.LocationId ActivityLocationID,
		ACE.EquipmentId EquipmentID,
		SH.DisplayName ShiftDisplayName,
		SH.Name ShiftName,
		LO.Id LocationId, 
		LO.Name LocationName,
		LO.Capacity,
		LO.Description LocationDescription,
		EQ.ID EquipmentID, 
		EQ.Name EquipmentName
		FROM 
		Activity ACT
		LEFT JOIN Experiment EX ON ACT.ExperimentId=EX.Id
		LEFT JOIN ActivityShift ACS ON ACT.Id=ACS.ActivityId
		LEFT JOIN ActivityLocation ACL ON ACT.Id=ACL.ActivityId
		LEFT JOIN ActivityEquipment ACE ON ACT.Id=ACE.ActivityId
		LEFT JOIN DBO.Shift SH ON ACS.ShiftId=SH.Id
		LEFT JOIN DBO.Location LO ON ACL.LocationId=LO.Id
		LEFT JOIN DBO.Equipment EQ ON ACE.EquipmentId=EQ.Id

		WHERE 
		ACT.ActivityDate >= @CalenderDate  
		AND ACT.ActivityDate < @CalenderDate +  7
		AND ACT.StatusId =1 
		--AND ACT.Name='June second'
		
		ORDER BY 
		LO.Name, 
		SH.DisplayName,
		ACT.ActivityDate ASC		

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_EquipmentByLocID]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Get_EquipmentByLocID]
(
 @Location_ID int
)
AS
BEGIN  
	BEGIN TRY
	 SELECT [Id]
      ,[Name]
      ,[EquipmentTypeId]
      ,[LocationId]
      ,[Status]
  FROM [dbo].[Equipment] Where LocationId = @Location_ID ORDER BY [Name] ASC 
	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_Experiment]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      SURYA
-- Create Date: 31-MAY-2020
-- Description: THIS SP GETS AN EXPERIMENT WITH THE SPECIFIED ID
-- =============================================
CREATE PROCEDURE [dbo].[usp_Get_Experiment]
(
    @expId INT NULL
)
AS
BEGIN
    BEGIN TRY
		SELECT
			[Id]
			,[ProjectId]
			,[Name]
			,[StartDate]
			,[Description]
			,[StatusId]
			,[Remarks]
			,[Owner]
			,[OwnerName]
			,[Created]
			,[Modified] 
		FROM 
		[dbo].[Experiment]
		WHERE 
		Id=@expId
	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_ExpWithoutActivities]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:      Saurabh
-- Create Date: 08-June-2020
-- Description: THIS SP GETS ALL Experiments WHICH A SPECIFIED USER
-- =============================================
CREATE PROCEDURE [dbo].[usp_Get_ExpWithoutActivities]
(
    @ownerEmail varchar(255) = null,
	@statusId int = 1
)
AS
BEGIN
    BEGIN TRY
	IF(@ownerEmail IS NULL)
	BEGIN
	SELECT
		EX.Id ExperimentId,
		EX.Name ExperimentName,
		EX.StartDate ExperimentStartDate,
		EX.Owner ExperimentOwner,
		EX.[OwnerName] ExperimentOwnerName,
		EX.[Description] ExperimentDescription,
		EX.[Remarks] ExperimentRemarks     
		from Experiment EX
		where EX.Id NOT IN (Select AC.ExperimentId from Activity AC where EX.Id =AC.ExperimentId  and AC.StatusId =1)
		And EX.StatusId = @statusId
		Order BY StartDate
	END
	ELSE 
	BEGIN
	SELECT
		EX.Id ExperimentId,
		EX.Name ExperimentName,
		EX.StartDate ExperimentStartDate,
		EX.Owner ExperimentOwner,
		EX.[OwnerName] ExperimentOwnerName,
		EX.[Description] ExperimentDescription,
		EX.[Remarks] ExperimentRemarks     
		from Experiment EX
		where EX.Id NOT IN (Select AC.ExperimentId from Activity AC where EX.Id =AC.ExperimentId  and AC.StatusId =1)
		And EX.StatusId = @statusId
		And EX.Owner = @ownerEmail
		Order BY StartDate
		END
	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_Location]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Get_Location]
AS
BEGIN  
	BEGIN TRY
	  SELECT [Id]
      ,[Name]
      ,[Capacity]
      ,[Description]
  FROM [dbo].[Location] ORDER BY [Name] ASC 
	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_LocationAndEquipment]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Get_LocationAndEquipment]
(@Status nvarchar(250) = 'functioning')
AS
BEGIN  
	BEGIN TRY
	 SELECT loc.[Id] as LocationId
      ,loc.[Name] as LocationName
	  ,loc.[Description] as LocationDescription
	  ,loc.[Capacity] as LocationCapacity
      ,eqp.[EquipmentTypeId] as EquipmentTypeId
	  ,eqp.[Id] as EquipmentId
      ,eqp.[Name] as EquipmentName
  FROM [dbo].[Location] as loc LEFT JOIN [dbo].[Equipment] as eqp ON loc.Id = eqp.LocationId 
  Where eqp.Status = @Status or  eqp.Status is null ORDER BY loc.[Name] ASC 

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_LocationData]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Get_LocationData]
AS
BEGIN  
	BEGIN TRY 

    Select Id as LocationId, name as LocationName, Capacity as LocationCapacity, Description as LocationDescription
	from Location

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_Projects]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Get_Projects]
AS
BEGIN  
	BEGIN TRY
	SELECT [Id]
		  ,[Name]
		  ,[Priority]
		  ,[Description]
	  FROM [dbo].[Project] WHERE [StatusId]=1 ORDER BY [Name] ASC 
	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_ShiftLocationAvailability]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Get_ShiftLocationAvailability]
(
 @ActivityDate varchar(50)
)
AS
BEGIN  
	BEGIN TRY 
			select CASE WHEN Count(*) >= loc.Capacity   THEN 'Red' ELSE 'Green'  END as Color,
			sh.Id as ShiftId, loc.Id as LocationId,loc.Name as LocationName,loc.Description as LocationDescription,
			sh.DisplayName as ShiftDisplayName, Count(*) as NoOfActivities,  loc.Capacity as LocationCapacity
			from Activity act,ActivityLocation  actl,[Location] loc, ActivityShift acts, [Shift] sh
			where 
			actl.LocationId = loc.ID and
			acts.ShiftId = sh.ID and
			act.ID = actl.ActivityId and
			act.ID = acts.ActivityId and
			ActivityDate = @ActivityDate			
			group by sh.ID,loc.Name ,sh.DisplayName,loc.Capacity,loc.Id,loc.Description
			order by sh.ID,loc.Name ASC 

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_Shifts]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Get_Shifts]
(
 @Id int = null
)
AS
BEGIN  
    SET NOCOUNT ON
	BEGIN TRY
	IF @Id IS NULL OR @Id =0
	BEGIN
	   SELECT [Id]
      ,[Name]
      ,[StartHour]
      ,[StartMin]
      ,[EndHour]
      ,[EndMin]
      ,[DisplayName]
  FROM [dbo].[Shift] ORDER BY [DisplayName] ASC 
  END
  ELSE 
  BEGIN
   SELECT [Id]
      ,[Name]
      ,[StartHour]
      ,[StartMin]
      ,[EndHour]
      ,[EndMin]
      ,[DisplayName]
  FROM [dbo].[Shift] sh where sh.Id = @Id ORDER BY [DisplayName] ASC 
  END

	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Get_SystemAdminData]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Get_SystemAdminData]
AS
BEGIN  
	BEGIN TRY
	  SELECT
        [Id] SystemAdminId,[Name] SystemAdminName,[EmailId] SystemAdminEmailId
      FROM [dbo].[SystemAdmin]  where IsActive = 1
	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_PBI_Get_LocationsUseByDayShift]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      Surya Saurav Mishra
-- Create Date: 06-06-2020
-- Description: This stored procedure was created for getting data in a format that can be used in Power BI dashboard. Requested by Henry Rogalin
-- =============================================
CREATE PROCEDURE [dbo].[usp_PBI_Get_LocationsUseByDayShift]
AS
BEGIN
DECLARE @START_DATE DATE;
DECLARE @END_DATE DATE;
DECLARE @CALENDAR TABLE (
    CALDATE DATE,
	CALDAYSTR NVARCHAR(20)
);
DECLARE @CALENDAR_SHIFT TABLE(
	Day DATE,
	CalDayStr NVARCHAR(20),
	Shift NVARCHAR(10),
	ShiftId INT
);
DECLARE @ACTIVITY_SHIFTID_LOCATION TABLE(
	Activity NVARCHAR(255),
	Personnel nvarchar(255),
	ActivityDate DATE,
	ShiftId INT,
	PrimaryWorkLocation nvarchar(100)
);


SET @START_DATE = '2020-05-01'
SET @END_DATE = '2021-04-30'

DECLARE @CURR_DATE DATE 
SET @CURR_DATE = @START_DATE
WHILE ( @CURR_DATE <= @END_DATE)
BEGIN
    INSERT INTO @CALENDAR SELECT @CURR_DATE AS CALDATE, CONCAT(SUBSTRING(DATENAME(WEEKDAY, @CURR_DATE),1,3),'-',DATEPART(D, @CURR_DATE),FORMAT(@CURR_DATE, 'MMM')) AS CALDAYSTR
    SET @CURR_DATE = DATEADD(DAY, 1, @CURR_DATE)
END

INSERT INTO @CALENDAR_SHIFT
SELECT 
FORMAT(C.CALDATE, 'MM/dd/yyyy') AS Day
,CONCAT(C.CALDAYSTR, 'S', RIGHT(SH.Name,1)) as CalDayStr
,SH.Name AS Shift
,SH.Id AS ShiftId
FROM 
@CALENDAR C
CROSS JOIN Shift SH
WHERE SH.Id>1

INSERT INTO 
@ACTIVITY_SHIFTID_LOCATION
SELECT 
ACT.NAME AS Activity
,ACT.BookedForName AS Personnel
,ACT.ACTIVITYDATE AS ActivityDate
,ACS.ID AS ShiftId
,LO.Name AS PrimaryWorkLocation
FROM 
Activity ACT
LEFT JOIN ActivityShift ACS ON ACT.Id=ACS.ActivityId
LEFT JOIN ActivityLocation ACL ON ACT.Id=ACL.ActivityId
LEFT JOIN Location LO ON ACL.LocationId=LO.Id

SELECT 
CS.Day
,ASL.Activity
,ASL.Personnel
,CASE WHEN ASL.PrimaryWorkLocation IS NULL THEN 'Not Scheduled' ELSE ASL.PrimaryWorkLocation END AS PrimaryWorkLocation
,CS.Shift
,CS.CalDayStr as DayShift
FROM
@CALENDAR_SHIFT CS
LEFT JOIN @ACTIVITY_SHIFTID_LOCATION ASL ON CAST(CS.Day AS DATE)=CAST(ASL.ActivityDate AS DATE)
ORDER BY CS.Day ,CS.Shift
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Update_Activity]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Update_Activity]
(
@ExperimentId int = null,
@ExperimentOwner nvarchar(255) = null,
@ActivityId int = null,
@ActivityName nvarchar(255),
@ActivityDescription nvarchar(max),
@DayOffset int = 0,
@ActivityDate datetime,
@BookedByEmail nvarchar(255),
@BookedForEmail nvarchar(255),
@BookedByName nvarchar(255),
@BookedForName nvarchar(255),
@ShiftIds AS dbo.IDs READONLY,
@LocationIds AS dbo.IDs READONLY,
@EquipmentIds AS dbo.IDs READONLY,
@IsEmployee BIT,
@Notes nvarchar(max) = null
)
AS
BEGIN  
    set nocount on;
	BEGIN TRY 
		BEGIN TRANSACTION 
	    UPDATE Activity     
        SET [ExperimentId] = @ExperimentId, [Name] = @ActivityName, [Description] = @ActivityDescription,[DayOffset] = @DayOffset, [ActivityDate] = @ActivityDate,[BookedByEmail] = @BookedByEmail
		,[BookedForEmail] = @BookedForEmail,[BookedByName] = @BookedByName,[BookedForName] = @BookedForName, [IsEmployee] = @IsEmployee,[Modified] = GETDATE() where Id = @ActivityId
	    
		DELETE FROM ActivityShift WHERE ActivityId = @ActivityId
		DELETE FROM ActivityLocation WHERE ActivityId = @ActivityId
		DELETE FROM ActivityEquipment WHERE ActivityId = @ActivityId		

		INSERT INTO ActivityShift (ActivityId,ShiftId,[Created],[Modified])SELECT  @ActivityId, Id,GETDATE(),GETDATE() from @ShiftIds
	    INSERT INTO ActivityLocation (ActivityId,LocationId,[Created],[Modified])SELECT  @ActivityId, Id,GETDATE(),GETDATE() from @LocationIds
		INSERT INTO ActivityEquipment (ActivityId,EquipmentId,[Created],[Modified])SELECT @ActivityId, Id,GETDATE(),GETDATE() from @EquipmentIds

		COMMIT
		DECLARE @ModifiedOnDate datetime
		Set @ModifiedOnDate = GETDATE()
		INSERT INTO ActivityAudit
		(ActivityId,ModifiedOn,ModifiedByEmail,Notes)  VALUES
		(@ActivityId,@ModifiedOnDate,@BookedByEmail,@Notes)


	RETURN @@ERROR
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
        ROLLBACK
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_Update_Experiment]    Script Date: 19-06-2020 16:01:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[usp_Update_Experiment]
(
@ExperimentId int,
@ProjectId int,
@ExpName nvarchar(255),
@ExpStartDate datetime,
@ExpDescription nvarchar(max),
@StatusId int,
@ExpRemarks nvarchar(max),
@ExpOwner nvarchar(255),
@ExpOwnerName nvarchar(255),
@UpdateActivities bit,
@ExeStatus [int] OUTPUT
)
AS
BEGIN  
    set nocount on;
	BEGIN TRY 	
	 BEGIN TRANSACTION 

		declare @oldDate date;		
		declare @dateDiff int;
		set @oldDate = (select StartDate from [dbo].[Experiment] where Id=@ExperimentId);
		set @dateDiff=(DATEDIFF(day, @oldDate, @ExpStartDate));
		
		UPDATE Experiment SET
        [ProjectId] = @ProjectId
		,[Name]= @ExpName
		,[StartDate] = @ExpStartDate
		,[Description] = @ExpDescription
		,[StatusId] = @StatusId
		,[Remarks]= @ExpRemarks
		,[Owner] = @ExpOwner
		,[OwnerName] = @ExpOwnerName
		,[Modified] = GETDATE()
	    WHERE Id = @ExperimentId

		if(@UpdateActivities = 1)
		begin
			UPDATE [dbo].[Activity] SET
			ActivityDate=DATEADD(day, @dateDiff, ActivityDate)
			,[Modified]=GETDATE()
			WHERE ExperimentId=@ExperimentId;		
			Exec DBO.usp_Get_ActivitiesForUser @experimentId=@ExperimentId,@userEmail=null,@statusId=1
		end

	COMMIT

	RETURN @@ERROR
	END TRY
	BEGIN CATCH	   
	 IF @@TRANCOUNT > 0
        ROLLBACK
		DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		DECLARE @ErrorSeverity int = ERROR_SEVERITY()
		DECLARE @ErrorState int = ERROR_STATE()
		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState)
	END CATCH
END
GO
