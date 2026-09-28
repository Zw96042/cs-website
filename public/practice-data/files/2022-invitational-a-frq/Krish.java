import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Krish {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("krish.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int nbr = data.nextInt();
			int sum = 0;
			int prod = 1;
			int reverse = 0;
			int temp = nbr;
			while (temp != 0) {
				int digit = temp % 10;
				sum += digit;
				if (digit != 0) prod *= digit;
				reverse = reverse * 10 + digit;
				temp /= 10;
			}
			long bigprod = (long)nbr * (long)reverse;
			System.out.printf("%d %d %d %d %d\n", nbr, sum, prod, reverse, bigprod);
		}
	}
}
