/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.awt.geom.Line2D;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Sanjay {
	
	int T;
	int N;
	double dx;
	double dz;
	double theta;
	double[][] X;
	double[][] Z;
	double bx;
	double bz;
	double epsilon = .0000001;
	double cos, sin;
	
	public static void main(String[] args) throws FileNotFoundException
	{
		new Sanjay().run();
	}
	
	public void run() throws FileNotFoundException {
		Scanner file = new Scanner(new File("sanjay.dat"));
		T = file.nextInt();
		for(int cas = 0;cas<T;cas++)
		{
			N = file.nextInt();
			bx = file.nextDouble();
			bz = file.nextDouble();
			dx = file.nextDouble();
			dz = file.nextDouble();
			double bigx = bx + dx * 10000;
			double bigz = bz + dz * 10000;
			X = new double[N][];
			Z = new double[N][];
			for(int i = 0;i<N;i++)
			{
				int islandLength = file.nextInt();
				X[i] = new double[islandLength];
				Z[i] = new double[islandLength];
				for(int j = 0;j<islandLength;j++)
				{
					X[i][j] = file.nextDouble();
					Z[i][j] = file.nextDouble();
				}
			}
			double min = Double.MAX_VALUE;
			for(int i = 0;i<N;i++)
			{
				for(int j = 0;j<X[i].length;j++)
				{
					double x1 = X[i][j];
					double x2 = X[i][(j + 1) % X[i].length];
					double y1 = Z[i][j];
					double y2 = Z[i][(j + 1) % X[i].length];
					double dist = lineLineDistance(bx, bz, bigx, bigz, x1, y1, x2, y2);
					min = Math.min(min, dist);
				}
			}
			System.out.printf("%.3f%n", min);
		}
	}
	
	public double lineLineDistance(double x1, double y1, double x2, double y2, double x3, double y3, double x4, double y4)
	{
		Line2D line1 = new Line2D.Double(x1,y1,x2,y2);
		Line2D line2 = new Line2D.Double(x3,y3,x4,y4);
		if(line1.intersectsLine(line2))
			return 0.0;
		double a = pointLineDistance(x1, y1, x3, y3, x4, y4);
		double b = pointLineDistance(x2, y2, x3, y3, x4, y4);
		double c = pointLineDistance(x3, y3, x1, y1, x2, y2);
		double d = pointLineDistance(x4, y4, x1, y1, x2, y2);
		return Math.min(Math.min(a, b), Math.min(c,d));
	}
	
	public double pointLineDistance(double x, double y, double x1, double y1, double x2, double y2)
	{
		double min = dist(x,y,x1,y1);
		min = Math.min(min, dist(x,y,x2,y2));
		line line = new line(x1, y1, x2, y2);
		line perp = line.perpThrough(x,y);
		double[] intersection = line.intersection(perp);
		if(intersection != null && contained(intersection[0], intersection[1], x1, y1, x2, y2))
		{
			min = Math.min(min,dist(x,y,intersection[0], intersection[1]));
		}
		return min;
	}
	
	public boolean contained(double x, double y, double x1, double y1, double x2, double y2)
	{
		double ac = dist(x1,y1,x2,y2);
		double ab = dist(x,y,x1,y1);
		double bc = dist(x,y,x2,y2);
		return Math.abs(ab + bc - ac) < epsilon;
	}
	
	public double dist(double x1, double y1, double x2, double y2)
	{
		return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
	}
	
	private class line{
			
		double A,B,C;
		
		public line(double x1, double y1, double x2, double y2)
		{
			this(y2 - y1, x1 - x2, (y2 - y1)*x1 + (x1 - x2)*y1);
		}
		
		public line(double A, double B, double C)
		{
			this.A = A;
			this.B = B;
			this.C = C;
		}
		
		public line perpThrough(double x, double y)
		{
			double A = B;
			double B = -this.A;
			double C = A*x + B*y;
			return new line(A,B,C);
		}
		
		public double[] intersection(line li)
		{
			double det = A*li.B-li.A*B;
			if(det==0) return null; //zero or infinite solutions
			double x = (li.B*C-B*li.C)/det;
			double y = (A*li.C-li.A*C)/det;
			return new double[] {x,y};
		}
		
		public String toString()
		{
			return A+" "+B+" "+C;
		}
	}
}