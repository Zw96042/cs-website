import java.util.*;
import java.io.*;
import static java.lang.System.*;
public class Isha {

	public static void main(String[] args) throws IOException{
		Scanner f=new Scanner(new File("isha.dat"));
		
		/*
		 * This problem is a graphing problem which can be solved using adjacency matrices.
		 * Note that the problem could have been solved with a single matrix by creating a Flight
		 * class that had fields for both the flight times and the appropriate time shift for 
		 * each flight. The elements of the adjacency matrix would have been Flight objects.
		 * Programmers choice! 
		 */
		
		int[][] flightTimes={{0,119,174,263,0},
							 {119,0,125,0,0},
							 {174,125,0,130,121},
							 {263,0,130,0,89},
							 {0,0,121,89,0}};
		int[][] timeshift={{0,60,120,180,180},
						   {-60,0,60,0,0},
						   {-120,-60,0,60,60},
						   {-180,0,-60,0,0},
						   {0,0,-60,0,0}};
		int n=Integer.parseInt(f.nextLine());
		for(int x=1;x<=n;x++){
			String line=f.nextLine();// Read an entire line.
			Scanner flight=new Scanner(line);// Make it into a Scanner object.
			String depart=flight.next();
			if(depart.equals("San"))
				depart+=" "+flight.next();// In this problem there is only one city with a two part name. This accounts for San Diego.
			int row=0;
			
			// Each row represents all of the possible destinations for each city of departure.
			
			switch(depart){
				case "San Diego":row=0;break;
				case "Denver":row=1;break;
				case "Houston":row=2;break;
				case "Charlotte":row=3;break;
				case "Orlando":row=4;break;
				}
			String time=flight.next();
			
			// Parse out the hour and minute of the departure time.
			
			int hour=Integer.parseInt(time.substring(0, time.indexOf(":")));
			int minute=Integer.parseInt(time.substring(time.indexOf(":")+1));
			String ampm=flight.next();
			boolean am=ampm.equals("A.M.");
			int departureTimeInMinutes=0;
			
			// Convert all times to minutes past midnight.
			
			// A.M. and P.M. departure times must be handled differently.
			
			if(am)
				// Departure during the midnight hour means that the hour is equal to zero (0).
				if(hour==12)
					departureTimeInMinutes=minute;
				else
					departureTimeInMinutes=hour*60+minute;
			else
				// Departure during the noon hour means that the hour is equal to zero (0).
				if(hour==12)
					departureTimeInMinutes=12*60+minute;
				else
					departureTimeInMinutes=(hour+12)*60+minute;
			String dest=flight.nextLine().trim();// Can't have any extra spaces hanging around on this String.
			int column=0;
			
			// The column number is the destination for this particular row.
			
			switch(dest){
				case "San Diego":column=0;break;
				case "Denver":column=1;break;
				case "Houston":column=2;break;
				case "Charlotte":column=3;break;
				case "Orlando":column=4;break;
				}
			
			// Calculate the arrival time in minutes past midnight.
			
			int arrivalTime=departureTimeInMinutes+flightTimes[row][column]+timeshift[row][column];
			String arrivalAmPm="";
			
			// Noon is 720 minutes past midnight.
			
			if(arrivalTime<720)
				arrivalAmPm="A.M.";
			else
				arrivalAmPm="P.M.";
			int arrivalHour=-1,arrivalMinute=-1;
			
			// Convert the arrival time back to an A.M. or P.M. time. (Twelve hour clock.)
			
			if(am)
				arrivalHour=arrivalTime/60;				
			else
				arrivalHour=arrivalTime/60-12;
			if(arrivalHour==0)
				arrivalHour=12;
			arrivalMinute=arrivalTime%60;
			
			// Ensure that minutes have leading zeroes.
			
			out.printf("%s %d:%02d %s %s %d:%02d %s\n",depart,hour,minute,ampm,dest,arrivalHour,arrivalMinute,arrivalAmPm);
		}

	}

}
