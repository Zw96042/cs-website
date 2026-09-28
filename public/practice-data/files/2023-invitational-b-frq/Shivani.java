/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;
import java.math.*;

public class Shivani {
	public static void main(String[]args)throws Exception{
		Scanner file=new Scanner(new File("shivani.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			BigInteger b= new BigInteger(file.nextLine().trim());
			BigInteger c = b.multiply(b.add(BigInteger.ONE));
			c = c.multiply(b.add(BigInteger.TWO));
			c = c.divide(new BigInteger("6"));
			System.out.println(c);
		}
	}
}
