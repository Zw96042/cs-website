import java.io.File;
import java.io.FileNotFoundException;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Ewa {
	
	public static void main(String[] args) throws FileNotFoundException
	{
		new Ewa().run();
	}
	
	double PI = Math.PI;
	
	public void run() throws FileNotFoundException
	{
		Scanner file = new Scanner(new File("ewa.dat"));
		int T = file.nextInt();
		for(int zz = 0;zz<T;zz++)
		{
			int N = file.nextInt();
			double pie = 0;
			for(int i = 0;i<N;i++)
			{
				String next = file.next();
				if(next.equals("BRING"))
				{
					double R = file.nextDouble();
					double D = file.nextDouble();
					pie += R*R*D*PI;
				}else {
					pie -= file.nextDouble();
				}
				System.out.printf("%.2f%n", pie);
			}
			System.out.println("----------");
		}
	}

}
