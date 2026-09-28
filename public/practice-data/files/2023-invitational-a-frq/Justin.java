/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;

public class Justin {

	public static void main(String[] args) throws FileNotFoundException {
		
		Scanner data = new Scanner(new File("justin.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			double price = data.nextDouble();
			double downpay = data.nextDouble();
			double apr = data.nextDouble();
			int n = data.nextInt();
			double r = apr/1200;
			double payment = (price - downpay) * r / (1 - Math.pow(1 + r, -n));
			payment = Math.round(payment * 100) / 100.0;
			double cost = payment * n + downpay;
			double interest = cost - price;
			System.out.printf("$%9.2f $%9.2f $%9.2f\n", payment, cost, interest);
		}
	}
}
