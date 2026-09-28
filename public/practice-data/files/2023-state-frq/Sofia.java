/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Sofia {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("sofia.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			double tempf = data.nextDouble();
			double relhumid = data.nextDouble();
			double heatindex = 0.0;

			System.out.printf("Test case #%d: ", t);
			heatindex = (0.5 * (tempf + 61.0 + ((tempf - 68.0) * 1.2) + (relhumid * 0.094)));
			heatindex = (heatindex + tempf) / 2;
			if (heatindex >= 80) {
				heatindex = (-42.379
						+ 2.04901523 * tempf
						+ 10.14333127 * relhumid
						- 0.22475541 * tempf * relhumid
						- 6.83783e-3 * Math.pow(tempf, 2)
						- 5.481717e-2 * Math.pow(relhumid, 2)
						+ 1.22874e-3 * Math.pow(tempf, 2) * relhumid
						+ 8.5282e-4 * tempf * Math.pow(relhumid, 2)
						- 1.99e-6 * Math.pow(tempf, 2) * Math.pow(relhumid, 2)
						);
				if (relhumid < 13.0 && tempf >= 80.0 && tempf <= 112.0)
					heatindex -= (( ( 13.0 - relhumid ) / 4.0 ) * Math.sqrt( ( 17.0 - Math.abs( tempf - 95.0 ) ) / 17.0 ));
				else if (relhumid > 85.0 && tempf >= 80.0 && tempf <= 87.0)
					heatindex += ((relhumid - 85.0) * (87.0 - tempf) / 50.0);
			}
			if (heatindex <= 140.0 && heatindex >= 75.0)
				System.out.printf("%4.1f\n", heatindex);
			else
				System.out.printf("Heat Index %4.1f NOT VALID!\n", heatindex);
		}
		data.close();
	}
}