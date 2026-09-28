import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Diana {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("diana.dat"));
		double dx, dy, dz, d;
		while (data.hasNext()) {
			dx = data.nextDouble();
			dy = data.nextDouble();
			dz = data.nextDouble();
			dx -= data.nextDouble();
			dy -= data.nextDouble();
			dz -= data.nextDouble();
			d = Math.sqrt(dx * dx + dy * dy + dz * dz);
			System.out.printf("%4.2f\n", d);
		}
	}
}
