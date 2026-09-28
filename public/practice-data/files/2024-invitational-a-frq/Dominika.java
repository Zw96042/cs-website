/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Dominika
{

	public static double distance(double x1, double y1, double x2, double y2)
	{
		return Math.sqrt((Math.pow(x1-x2,2))+(Math.pow(y1-y2,2)));
	}

	public static void main(String args[]) throws FileNotFoundException
	{
		Scanner s;
		if(args.length==0)
			s = new Scanner(new File("dominika.dat"));
		else
			s = new Scanner(new File(args[0]));

		int N = s.nextInt();
		s.nextLine();

		for ( int n = 1; n <= N; n++ )
		{
			int x1,y1,x2,y2;
			x1 = s.nextInt();
			y1 = s.nextInt();
			x2 = s.nextInt();
			y2 = s.nextInt();

			double xNew1, yNew1,xNew2,yNew2;
			xNew1=(x1+x2+Math.sqrt(3)*(y2-y1))/2.0;
			xNew2=(x1+x2-Math.sqrt(3)*(y2-y1))/2.0;

			yNew1=(y1+y2-Math.sqrt(3)*(x2-x1))/2.0;
			yNew2=(y1+y2+Math.sqrt(3)*(x2-x1))/2.0;

			System.out.println("Test case: "+n);
			/*
			System.out.println(distance(x1,y1,x2,y2));
			System.out.println(distance(x1,y1,xNew1,yNew1));
			System.out.println(distance(x2,y2,xNew1,yNew1));
			System.out.println(distance(x1,y1,x2,y2));
			System.out.println(distance(x1,y1,xNew2,yNew2));
			System.out.println(distance(x2,y2,xNew2,yNew2));
			 */
			if(xNew1<xNew2)
			{
				System.out.printf("(%.2f,%.2f)\n",xNew1,yNew1);
				System.out.printf("(%.2f,%.2f)\n",xNew2,yNew2);
			}
			else if((xNew2<xNew1))
			{
				System.out.printf("(%.2f,%.2f)\n",xNew2,yNew2);
				System.out.printf("(%.2f,%.2f)\n",xNew1,yNew1);
			}
			else//x are equal
			{
				if(yNew1<yNew2)
				{
					System.out.printf("(%.2f,%.2f)\n",xNew1,yNew1);
					System.out.printf("(%.2f,%.2f)\n",xNew2,yNew2);
				}
				else
				{
					System.out.printf("(%.2f,%.2f)\n",xNew2,yNew2);
					System.out.printf("(%.2f,%.2f)\n",xNew1,yNew1);
				}
			}

		}
	}
}