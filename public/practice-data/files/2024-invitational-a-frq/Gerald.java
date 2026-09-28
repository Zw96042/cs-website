/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;

public class Gerald {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("gerald.dat"));
		int smallest = 10000, largest = 0;
		int sum = 0, count = 0;
		while (data.hasNext()) {
			int n = data.nextInt();
			if (n > largest) largest = n;
			if (n < smallest) smallest = n;
			sum += n;
			count++;
		}
		System.out.println("COUNT:" + count);
		System.out.println("SMALLEST:" + smallest);
		System.out.println("LARGEST:" + largest);
		System.out.printf("MEAN:%3.1f\n", (float)sum/count);
	}
}
