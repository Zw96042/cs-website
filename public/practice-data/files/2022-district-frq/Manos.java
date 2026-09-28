import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Scanner;

public class Manos {
	
	public static void main(String[] args) throws FileNotFoundException
	{
		Scanner file = new Scanner(new File("manos.dat"));
		int T = file.nextInt();
		for(int z = 0;z<T;z++)
		{
			int A = file.nextInt();
			int B = file.nextInt();
			System.out.println(A == B?"P2":"P1");
		}
	}
}
