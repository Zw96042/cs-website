/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Emily
{
	public static void main(String args[]) throws FileNotFoundException
    {
        Scanner s;
        if(args.length==0)
           s = new Scanner(new File("emily.dat"));
        else
            s = new Scanner(new File(args[0]));

        int N = s.nextInt();
        s.nextLine();
        for ( int n = 1; n <= N; n++ )
        {
        	int num1 = s.nextInt();
        	char op= s.next().charAt(0);
        	int num2 = s.nextInt();
        	switch(op)
        	{
        		case '+':
        			System.out.println(num1 + " + " + num2 + " = " + (num1+num2));
        			break;
        		case '-':
        			System.out.println(num1 + " - " + num2 + " = " + (num1-num2));
        			break;
        		case 'X':
        		case 'x':
        		case '*':
        			System.out.println(num1 + " " + op + " " + num2 + " = " + (num1*num2));
        			break;
        		case '/':
        			System.out.println(num1 + " / " + num2 + " = " + (num1/num2) + " remainder " + (num1%num2));
        			break;
        	}
        }
        s.close();
    }
}