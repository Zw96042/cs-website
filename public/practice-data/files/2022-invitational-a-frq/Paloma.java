import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Paloma {
	
	public static void main(String[] args) throws FileNotFoundException
	{
		int[] fib = new int[21];
		fib[0] = fib[1] = 1;
		for(int i = 2;i<fib.length;i++)
			fib[i] = fib[i-1] + fib[i-2];
		Scanner file = new Scanner(new File("paloma.dat"));
		int T = file.nextInt();
		for(int casenum = 0;casenum<T;casenum++)
		{
			int N = file.nextInt();
			System.out.println(fib[N]);
		}
	}
	
}
