import java.util.*;
import java.io.*;
public class Arti {

	public static void main(String[] args) throws IOException{
		Scanner file = new Scanner(new File("arti.dat"));
		int count = file.nextInt();
		for(int x = 1; x <= count; x++) {
			int number = file.nextInt();
			double sqrt = Math.sqrt(number);
			System.out.printf("%1d %1.3f\n",number,sqrt);
		}

	}

}
