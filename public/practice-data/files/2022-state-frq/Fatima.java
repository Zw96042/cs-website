/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class Fatima {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("fatima.dat"));
		int N = data.nextInt();
		for (int n = 1; n <= N; n++) {
			double tfstep = data.nextFloat();
			double rhstep = data.nextFloat();
			System.out.printf("Temp ");
			for (double tempf = 80.0; tempf <= 125.0; tempf += tfstep)
				System.out.printf(" %5.1f", tempf);
			System.out.println("\nHumid ===============================================================================================");
			double heatindex = 0.0;
			boolean flag;
			for (double relhumid = 20.0; relhumid <= 100.0; relhumid += rhstep) {
				flag = true;
				System.out.printf("%5.1f", relhumid);
				for (double tempf = 80.0; tempf <= 140.0 && flag; tempf += tfstep) {
					heatindex = -42.379 + 2.04901523 * tempf 
							+ 10.14333127 * relhumid
							- 0.22475541 * tempf * relhumid
							- 6.83783e-3 * tempf * tempf
							- 5.481717e-2 * relhumid * relhumid
							+ 1.22874e-3 * tempf * tempf * relhumid
							+ 8.5282e-4 * tempf * relhumid * relhumid
							- 1.99e-6 * tempf * tempf * relhumid * relhumid;
					if (relhumid > 85.0) 
						heatindex += (relhumid - 85.0) * (87.0 - tempf) / 50.0;
					if (heatindex <= 140.0f)
						System.out.printf(" %5.1f", heatindex);
					else
						flag = false;
				}
				System.out.println();
			}
			System.out.println("==============================");
		}
		data.close();
	}
}
