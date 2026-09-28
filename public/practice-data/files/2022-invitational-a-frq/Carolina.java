import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Carolina {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("carolina.dat"));
		float tax, total, subtotal = 0, sum = 0;
		while (data.hasNext()) {
			float cost = data.nextFloat();
			String desc = data.nextLine().trim();
			tax = Math.round(cost * 8.25f) / 100.0f;
			total = cost + tax;
			subtotal += cost;
			sum += total;
			System.out.printf("$%5.2f + $%4.2f = $%5.2f %s\n", cost, tax, total, desc);
		}
		tax = Math.round(subtotal * 8.25f) / 100.0f;
		total = subtotal + tax;
		System.out.printf("$%5.2f + $%4.2f = $%5.2f Combined Single Purchase\n", subtotal, tax, total);
		System.out.printf("$%5.2f Sum of Individual Purchases\n", sum);
	}
}
