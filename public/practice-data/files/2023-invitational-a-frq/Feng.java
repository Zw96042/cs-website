/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Feng {

	static double getHour(int hour, int min)
	{
		double returnValue=0.0;
		if(hour>=1&&hour<=3)//condition when the hours is [1,3]
		    returnValue = -30*hour+90;
		else
		    returnValue = -30*hour+450;

		//calculate how much the hour hand has (needs to advance)
		double degreesToSubtract=min/60.0*30.0;
		if(hour!=3)
		    returnValue=returnValue-degreesToSubtract;
		else if(hour==3&&degreesToSubtract!=0.0)
		    returnValue=360.0-degreesToSubtract;
		else
		{
		    //hour==3 and mins==0 so we don't want to adjust from 0 degrees to 360 degrees
		    //do nothing
		}

		return returnValue;
	}

    static double getMinute(int min)
	{
		double returnValue=0.0;

		if(min>=0&&min<=15)
		    returnValue = -6*min+90;
		else
		    returnValue = -6*min+450;

		return returnValue;
	}

	public static void printAngles(String s)
	{
		int hour, minute;
		hour=Integer.parseInt(s.substring(0,2));
		minute=Integer.parseInt(s.substring(3,5));
		System.out.printf("Hour: %.1f",getHour(hour,minute));
        System.out.println(" Minute: "+getMinute(minute));
	}

	public static void main(String[] args) throws FileNotFoundException
	{
		Scanner s;
        if(args.length==0)
           s = new Scanner(new File("feng.dat"));
        else
            s = new Scanner(new File(args[0]));

		int N = s.nextInt();
		s.nextLine();
		for ( int n = 1; n <= N; n++ )
		{
			printAngles(s.nextLine());
		}
		s.close();
	}
}