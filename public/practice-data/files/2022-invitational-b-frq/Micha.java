import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

public class Micha {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("micha.dat"));
		int S = data.nextInt();
		data.nextLine();  // displose of newline after integer
		String [] seq = new String[S];
		int [] counts = new int[S];
		Arrays.fill(counts, 0);
		for (int i = 0; i < S; i++)
			seq[i] = data.nextLine().trim();
		while (data.hasNext()) {
			String line = data.nextLine().trim().toLowerCase();
			for (int i = 0; i < S; i++) {
				int pos = 0;
				int next = line.indexOf(seq[i], pos);
				while (next != -1) {
					counts[i]++;
					pos = next + 1;
					next = line.indexOf(seq[i], pos);
				}
			}
		}
		for (int i = 0; i < S; i++)
			System.out.printf("\"%s\" %d\n", seq[i], counts[i]);
		data.close();
	}
}
