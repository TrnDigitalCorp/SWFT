export interface IActivityGridModel{
    ActivityId: number,
    ActivityName: string,
    ActivityDate: Date,
    ActivityDescription: string,
    BookedByEmail: string,
    BookedForEmail: string,
    DayOffset: number,
    ExperimentId: number,
    ExperimentName: string,
    ExperimentStartDate: any,
    Owner: string,
    ShiftName: string,
    LocationName: string,
    EquipmentName: string,
    BookedForName: string,
    BookedByName: string;
}

/* export default class ActivityGridModel{
    public ActivityId: number;
    public ActivityName: string;
    public ActivityDate: Date;
    public ActivityDescription: string;
    public BookedByEmail: string;
    public BookedForEmail: string;
    public DayOffset: number;
    public ExperimentId: number;
    public ExperimentName: string;
    public Owner: string;
    public ShiftName: string;
    public LocationName: string;
    public EquipmentName: string;

    constructor(grid: IActivityGridModel){
        this.ActivityId=grid.ActivityId;
        this.ActivityName=grid.ActivityName;
        this.ActivityDate=grid.ActivityDate;
        this.ActivityDescription=grid.ActivityDescription;
        this.BookedByEmail=grid.BookedByEmail;
        this.BookedForEmail=grid.BookedForEmail;
        this.DayOffset=grid.DayOffset;
        this.ExperimentId=grid.ExperimentId;
        this.ExperimentName=grid.ExperimentName;
        this.Owner=grid.Owner;
        this.ShiftName=grid.ShiftName;
        this.LocationName=grid.LocationName;
        this.EquipmentName=grid.EquipmentName;
    } 
}*/